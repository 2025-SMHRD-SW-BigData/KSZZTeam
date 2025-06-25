// chat-backend/db.js
const oracledb = require('oracledb');
require('dotenv').config(); // .env 파일에서 환경 변수를 로드합니다.

// ⭐ Oracle Instant Client 경로 설정 ⭐
// 본인의 경로로 정확히 변경하세요.
oracledb.initOracleClient({ libDir: 'C:\\oraclexe\\instantclient_21_18' });

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING // 예: 'localhost:1521/XEPDB1' 또는 'your_ip:1521/service_name'
};

async function getConnection() {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        // ⭐ 매우 중요: 이 설정을 해야 결과가 객체 형태로 반환됩니다. ⭐
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        console.log('데이터베이스 연결 성공!');
        return connection;
    } catch (err) {
        console.error('데이터베이스 연결 오류:', err);
        throw err; // 오류를 다시 던져서 상위 호출자에게 알립니다.
    }
}

async function closeConnection(connection) {
    if (connection) {
        try {
            await connection.close();
            console.log('데이터베이스 연결 종료!');
        } catch (err) {
            console.error('데이터베이스 연결 종료 오류:', err);
        }
    }
}

module.exports = {
    getConnection,
    closeConnection
};