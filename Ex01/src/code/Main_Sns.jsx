import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const Main_Sns = () => {
  const [posts, setPosts] = useState([]);
  const [postInput, setPostInput] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  const handlePostSubmit = () => {
    if (!postInput.trim()) return;

    if (editingPostId !== null) {
      setPosts(posts.map(post =>
        post.id === editingPostId ? { ...post, content: postInput } : post
      ));
      setEditingPostId(null);
    } else {
      const newPost = {
        id: Date.now(),
        content: postInput,
        comments: [],
      };
      setPosts([newPost, ...posts]);
    }

    setPostInput('');
  };

  const handlePostDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handlePostEdit = (id, content) => {
    setEditingPostId(id);
    setPostInput(content);
  };

  const handleCommentSubmit = (postId, commentText) => {
    if (!commentText.trim()) return;
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), text: commentText },
            ],
          }
        : post
    ));
  };

  const handleCommentDelete = (postId, commentId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId),
          }
        : post
    ));
  };

  return (
    <div>
      <Header />

      <main style={{ padding: '20px' }}>
        <h2 style={{marginLeft:'630px',marginTop:'150px'}}>게시판</h2>

        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
            rows={4}
            style={{ width: '500px',marginLeft:'630px', padding: '10px' }}
            placeholder="게시글을 입력하세요"
          />
          <br></br>
          <button onClick={handlePostSubmit} style={{marginLeft:'630px'}}>
            {editingPostId !== null ? '수정 완료' : '등록'}
          </button>
        </div>

        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px',marginLeft:'630px',width:'500px' }}>
            <p>{post.content}</p>
            <button onClick={() => handlePostEdit(post.id, post.content)}>수정</button>
            <button onClick={() => handlePostDelete(post.id)}>삭제</button>

            {/* 댓글 기능 */}
            <CommentSection
              post={post}
              onCommentSubmit={handleCommentSubmit}
              onCommentDelete={handleCommentDelete}
            />
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
};

// 댓글 섹션 컴포넌트
const CommentSection = ({ post, onCommentSubmit, onCommentDelete }) => {
  const [commentInput, setCommentInput] = useState('');

  const handleSubmit = () => {
    onCommentSubmit(post.id, commentInput);
    setCommentInput('');
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <strong>댓글</strong>
      <ul>
        {post.comments.map(comment => (
          <li key={comment.id}>
            {comment.text}
            <button onClick={() => onCommentDelete(post.id, comment.id)}>삭제</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="댓글 입력"
      />
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
};

export default Main_Sns;
