// chat-backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { getConnection, closeConnection } = require('./db');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use((req, res, next) => {
    req.currentUserId = req.headers['x-user-id'] ? parseInt(req.headers['x-user-id']) : 1;
    if (isNaN(req.currentUserId)) {
        req.currentUserId = 1;
        console.warn('x-user-id 헤더가 유효한 숫자가 아닙니다. 기본 사용자 ID 1을 사용합니다.');
    }
    console.log(`요청 사용자 ID: ${req.currentUserId}, 경로: ${req.path}`);
    next();
});

// LOB 객체를 문자열로 변환하는 헬퍼 함수
// oracledb 5.x 이후 버전의 getDataAsText()를 우선 사용하고,
// 이전 버전 또는 다른 경우를 대비해 스트림 읽기 로직 포함
async function getLobAsString(lob) {
    if (lob === null || lob === undefined) {
        return null;
    }
    if (lob && typeof lob.getDataAsText === 'function') { // oracledb 5.x 이후
        return await lob.getDataAsText();
    } else if (lob && typeof lob.read === 'function') { // oracledb 4.x 이전
        return new Promise((resolve, reject) => {
            let data = '';
            lob.on('data', (chunk) => { data += chunk; });
            lob.on('end', () => { resolve(data); });
            lob.on('error', (err) => { reject(err); });
        });
    } else if (typeof lob === 'string') { // 이미 문자열인 경우
        return lob;
    } else { // 그 외 알 수 없는 경우
        console.warn('Unknown LOB type or non-LOB data for conversion:', lob);
        return lob ? lob.toString() : null;
    }
}

// 1. 사용자 채팅방 목록 조회 (GET /api/chatrooms)
app.get('/api/chatrooms', async (req, res) => {
    let connection;
    try {
        const currentUserId = req.currentUserId;
        connection = await getConnection();

        const sql = `
            SELECT
                CR.ROOM_ID,
                CR.USER1_ID,
                CR.USER2_ID,
                CASE
                    WHEN CR.USER1_ID = :currentUserId THEN U2.USERNAME
                    ELSE U1.USERNAME
                END AS OPPONENT_NAME,
                CM.CONTENT AS LAST_MESSAGE,
                CM.SENT_AT AS LAST_MESSAGE_TIME,
                UCS.LAST_VIEWED_AT,
                UCS.LAST_LEFT_AT
            FROM
                CHAT_ROOMS CR
            JOIN
                USER_CHAT_ROOM_STATUS UCS ON CR.ROOM_ID = UCS.ROOM_ID
            LEFT JOIN
                USERS U1 ON CR.USER1_ID = U1.USER_ID
            LEFT JOIN
                USERS U2 ON CR.USER2_ID = U2.USER_ID
            LEFT JOIN (
                SELECT
                    MESSAGE_ID,
                    ROOM_ID,
                    CONTENT,
                    SENT_AT,
                    ROW_NUMBER() OVER (PARTITION BY ROOM_ID ORDER BY SENT_AT DESC, MESSAGE_ID DESC) AS rn
                FROM
                    CHAT_MESSAGES
            ) CM ON CR.ROOM_ID = CM.ROOM_ID AND CM.rn = 1
            WHERE
                UCS.USER_ID = :currentUserId
                AND UCS.LAST_LEFT_AT IS NULL
                AND UCS.IS_ACTIVE = 1
            ORDER BY
                CM.SENT_AT DESC NULLS LAST
        `;

        const result = await connection.execute(sql, { currentUserId: currentUserId });

        const chatrooms = await Promise.all(result.rows.map(async row => ({
            ROOM_ID: row.ROOM_ID,
            USER1_ID: row.USER1_ID,
            USER2_ID: row.USER2_ID,
            OPPONENT_NAME: row.OPPONENT_NAME,
            LAST_MESSAGE: await getLobAsString(row.LAST_MESSAGE),
            LAST_MESSAGE_TIME: row.LAST_MESSAGE_TIME ? row.LAST_MESSAGE_TIME.toISOString() : null,
            LAST_VIEWED_AT: row.LAST_VIEWED_AT ? row.LAST_VIEWED_AT.toISOString() : null,
            LAST_LEFT_AT: row.LAST_LEFT_AT ? row.LAST_LEFT_AT.toISOString() : null
        })));
        
        console.log(`채팅방 목록 조회 성공 (사용자 ID: ${currentUserId}): ${chatrooms.length}개`);
        res.json(chatrooms);

    } catch (err) {
        console.error('--- 채팅방 목록 조회 오류 발생 ---');
        console.error('오류 메시지:', err.message);
        console.error('오류 코드:', err.code || 'N/A');
        console.error('오류 DB 에러 번호:', err.errorNum || 'N/A');
        console.error('오류 스택 트레이스:', err.stack);
        console.error('요청 사용자 ID:', req.currentUserId);
        console.error('--- 오류 END ---');
        res.status(500).json({ error: 'Failed to retrieve chat rooms', detail: err.message });
    } finally {
        if (connection) {
            try {
                await closeConnection(connection);
            } catch (err) {
                console.error('DB 연결 종료 오류 (채팅방 목록):', err);
            }
        }
    }
});

// 2. 특정 채팅방 메시지 조회 및 LAST_VIEWED_AT 업데이트 (GET /api/chatrooms/:roomId/messages)
app.get('/api/chatrooms/:roomId/messages', async (req, res) => {
    let connection;
    try {
        const roomId = parseInt(req.params.roomId);
        const currentUserId = req.currentUserId;
        if (isNaN(roomId)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }

        connection = await getConnection();

        const messagesSql = `
            SELECT MESSAGE_ID, ROOM_ID, SENDER_ID, CONTENT, SENT_AT
            FROM CHAT_MESSAGES
            WHERE ROOM_ID = :roomId
            ORDER BY SENT_AT ASC
        `;
        const messagesResult = await connection.execute(messagesSql, { roomId: roomId });

        const updateViewedSql = `
            UPDATE USER_CHAT_ROOM_STATUS
            SET LAST_VIEWED_AT = SYSTIMESTAMP
            WHERE USER_ID = :currentUserId AND ROOM_ID = :roomId
        `;
        await connection.execute(updateViewedSql, { currentUserId: currentUserId, roomId: roomId }, { autoCommit: true });

        const messages = await Promise.all(messagesResult.rows.map(async row => ({
            MESSAGE_ID: row.MESSAGE_ID,
            ROOM_ID: row.ROOM_ID,
            SENDER_ID: row.SENDER_ID,
            CONTENT: await getLobAsString(row.CONTENT),
            SENT_AT: row.SENT_AT ? row.SENT_AT.toISOString() : null
        })));

        console.log(`메시지 조회 성공 (방 ID: ${roomId}, 사용자 ID: ${currentUserId}): ${messages.length}개`);
        res.json(messages);

    } catch (err) {
        console.error('--- 메시지 조회 및 업데이트 오류 발생 ---');
        console.error('오류 메시지:', err.message);
        console.error('오류 스택 트레이스:', err.stack);
        console.error('요청 방 ID:', req.params.roomId);
        console.error('요청 사용자 ID:', req.currentUserId);
        console.error('--- 오류 END ---');
        res.status(500).json({ error: 'Failed to retrieve messages', detail: err.message });
    } finally {
        if (connection) {
            try {
                await closeConnection(connection);
            } catch (err) {
                console.error('DB 연결 종료 오류 (메시지 조회):', err);
            }
        }
    }
});

// 3. 채팅방 나가기 (POST /api/chatrooms/:roomId/leave)
app.post('/api/chatrooms/:roomId/leave', async (req, res) => {
    let connection;
    try {
        const roomId = parseInt(req.params.roomId);
        const currentUserId = req.currentUserId;
        if (isNaN(roomId)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }

        connection = await getConnection();

        const sql = `
            UPDATE USER_CHAT_ROOM_STATUS
            SET LAST_LEFT_AT = SYSTIMESTAMP,
                IS_ACTIVE = 0
            WHERE USER_ID = :currentUserId AND ROOM_ID = :roomId
        `;
        await connection.execute(sql, { currentUserId: currentUserId, roomId: roomId }, { autoCommit: true });
        
        console.log(`채팅방 나가기 성공 (방 ID: ${roomId}, 사용자 ID: ${currentUserId})`);
        res.status(200).json({ message: 'Chat room left successfully' });
    } catch (err) {
        console.error('--- 채팅방 나가기 오류 발생 ---');
        console.error('오류 메시지:', err.message);
        console.error('오류 스택 트레이스:', err.stack);
        console.error('요청 방 ID:', req.params.roomId);
        console.error('요청 사용자 ID:', req.currentUserId);
        console.error('--- 오류 END ---');
        res.status(500).json({ error: 'Failed to leave chat room', detail: err.message });
    } finally {
        if (connection) {
            try {
                await closeConnection(connection);
            } catch (err) {
                console.error('DB 연결 종료 오류 (채팅방 나가기):', err);
            }
        }
    }
});

// 4. 새 채팅방 생성 또는 재활성화 (POST /api/chatrooms/create)
app.post('/api/chatrooms/create', async (req, res) => {
    let connection;
    try {
        const { targetUserId: reqTargetUserId } = req.body;
        const currentUserId = req.currentUserId;

        const targetUserId = parseInt(reqTargetUserId);
        if (isNaN(targetUserId) || targetUserId <= 0) {
            console.error(`유효하지 않은 targetUserId: ${reqTargetUserId}`);
            return res.status(400).json({ error: 'Invalid target user ID provided.' });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ error: '자기 자신과 채팅방을 만들 수 없습니다.' });
        }

        const user1Id = Math.min(currentUserId, targetUserId);
        const user2Id = Math.max(currentUserId, targetUserId);

        connection = await getConnection();

        let existingRoomId = null;

        const checkRoomSql = `
            SELECT ROOM_ID FROM CHAT_ROOMS
            WHERE USER1_ID = :user1Id AND USER2_ID = :user2Id
        `;
        const checkRoomResult = await connection.execute(checkRoomSql, { user1Id: user1Id, user2Id: user2Id });

        if (checkRoomResult.rows.length > 0) {
            existingRoomId = parseInt(checkRoomResult.rows[0].ROOM_ID);
            if (isNaN(existingRoomId)) {
                console.error(`유효하지 않은 기존 ROOM_ID: ${checkRoomResult.rows[0].ROOM_ID}`);
                throw new Error('Internal server error: Invalid existing room ID.');
            }

            const updateStatusSql = `
                MERGE INTO USER_CHAT_ROOM_STATUS D
                USING (SELECT :userId AS USER_ID, :roomId AS ROOM_ID FROM DUAL) S
                ON (D.USER_ID = S.USER_ID AND D.ROOM_ID = S.ROOM_ID)
                WHEN MATCHED THEN
                    UPDATE SET D.LAST_LEFT_AT = NULL, D.IS_ACTIVE = 1, D.LAST_VIEWED_AT = SYSTIMESTAMP
                WHEN NOT MATCHED THEN
                    INSERT (USER_ID, ROOM_ID, IS_ACTIVE, LAST_VIEWED_AT, LAST_LEFT_AT)
                    VALUES (S.USER_ID, S.ROOM_ID, 1, SYSTIMESTAMP, NULL)
            `;

            const resCurrentUser = await connection.execute(updateStatusSql, { userId: currentUserId, roomId: existingRoomId }, { autoCommit: false });
            console.log(`사용자 ${currentUserId}의 방 ${existingRoomId} 상태 MERGE됨. (행: ${resCurrentUser.rowsAffected})`);

            const resTargetUser = await connection.execute(updateStatusSql, { userId: targetUserId, roomId: existingRoomId }, { autoCommit: false });
            console.log(`사용자 ${targetUserId}의 방 ${existingRoomId} 상태 MERGE됨. (행: ${resTargetUser.rowsAffected})`);
            
            await connection.commit();

            console.log(`채팅방 재활성화 성공 (방 ID: ${existingRoomId}, 사용자 ID: ${currentUserId}, 상대방 ID: ${targetUserId})`);
            res.status(200).json({ roomId: existingRoomId, message: 'Chat room reactivated' });

        } else {
            const createRoomSql = `
                INSERT INTO CHAT_ROOMS (USER1_ID, USER2_ID)
                VALUES (:user1Id, :user2Id)
                RETURNING ROOM_ID INTO :outRoomId
            `;
            const bindVars = {
                user1Id: user1Id,
                user2Id: user2Id,
                outRoomId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            };
            const createRoomResult = await connection.execute(createRoomSql, bindVars, { autoCommit: false });
            const newRoomId = createRoomResult.outBinds.outRoomId[0];

            const insertStatusSql = `
                INSERT INTO USER_CHAT_ROOM_STATUS (USER_ID, ROOM_ID, IS_ACTIVE, LAST_VIEWED_AT, LAST_LEFT_AT)
                VALUES (:userId, :roomId, 1, SYSTIMESTAMP, NULL)
            `;
            await connection.execute(insertStatusSql, { userId: user1Id, roomId: newRoomId }, { autoCommit: false });
            await connection.execute(insertStatusSql, { userId: user2Id, roomId: newRoomId }, { autoCommit: false });

            await connection.commit();

            console.log(`새 채팅방 생성 성공 (방 ID: ${newRoomId}, 사용자 ID: ${currentUserId}, 상대방 ID: ${targetUserId})`);
            res.status(201).json({ roomId: newRoomId, message: 'New chat room created' });
        }

    } catch (err) {
        console.error('--- 채팅방 생성/재활성화 오류 발생 ---');
        console.error('오류 메시지:', err.message);
        console.error('오류 스택 트레이스:', err.stack);
        console.error('요청 사용자 ID:', req.currentUserId);
        console.error('요청 상대방 ID:', req.body.targetUserId);
        console.error('--- 오류 END ---');
        if (connection) {
            try {
                await connection.rollback();
                console.log('채팅방 생성/재활성화 트랜잭션 롤백됨.');
            } catch (rbErr) {
                console.error('롤백 오류:', rbErr);
            }
        }
        if (err.message.includes('ORA-00001')) {
            res.status(409).json({ error: 'Chat room already exists or could not be reactivated for both users. Please select the existing chat room.', detail: err.message });
        } else {
            res.status(500).json({ error: 'Failed to create or join chat room', detail: err.message });
        }
    } finally {
        if (connection) {
            try {
                await closeConnection(connection);
            } catch (err) {
                console.error('DB 연결 종료 오류 (채팅방 생성):', err);
            }
        }
    }
});


// ----- Socket.IO 실시간 메시지 처리 -----

io.on('connection', (socket) => {
    console.log('새로운 사용자 연결:', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} 가 ${roomId} 방에 조인`);
    });

    socket.on('sendMessage', async (data) => {
        let connection;
        try {
            const { roomId, senderId, content } = data;
            if (!roomId || !senderId || !content) {
                console.error("Invalid message data received via Socket.IO:", data);
                return;
            }
            connection = await getConnection();

            const insertMessageSql = `
                INSERT INTO CHAT_MESSAGES (ROOM_ID, SENDER_ID, CONTENT)
                VALUES (:roomId, :senderId, :content)
                RETURNING MESSAGE_ID INTO :outMessageId
            `;
            const bindVars = {
                roomId: roomId,
                senderId: senderId,
                content: content,
                outMessageId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            };
            const result = await connection.execute(insertMessageSql, bindVars, { autoCommit: true });
            const messageId = result.outBinds.outMessageId[0];

            const newMessage = {
                MESSAGE_ID: messageId,
                ROOM_ID: roomId,
                SENDER_ID: senderId,
                CONTENT: content,
                SENT_AT: new Date().toISOString()
            };
            
            io.to(roomId).emit('receiveMessage', newMessage);
            console.log(`방 ${roomId} 에 메시지 전송 및 브로드캐스트 성공: "${content}" (from ${senderId})`);

        } catch (err) {
            console.error('--- 메시지 저장 및 전송 오류 발생 (Socket.IO) ---');
            console.error('오류 메시지:', err.message);
            console.error('오류 스택 트레이스:', err.stack);
            console.error('수신 데이터:', data);
            console.error('--- 오류 END ---');
        } finally {
            if (connection) {
                try {
                    await closeConnection(connection);
                } catch (err) {
                    console.error('DB 연결 종료 오류 (메시지 전송):', err);
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('사용자 연결 해제:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Node.js Server running on port ${PORT}`);
});