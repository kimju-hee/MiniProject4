// src/pages/Book_Page.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Book_Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const book = books.find((b) => b.id === Number(id));

  if (!book) {
    return <div style={{ padding: '2rem' }}>도서를 찾을 수 없습니다.</div>;
  }

  const Delete = () => {
  };

  const Edit = () => {
    navigate(`/books/edit/${id}`);
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* 왼쪽: 북커버 및 메타 정보 */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
        {book.coverImage ? (
          <img src={book.coverImage} alt="cover" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
        ) : (
          <div style={{
            background: 'black',
            color: 'white',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            표지 없음
          </div>
        )}
        <h2>{book.title}</h2>
        <p><strong>카테고리:</strong> {book.category}</p>
        <p><strong>태그:</strong> {book.tags}</p>
        <h4>책 소개</h4>
        <p>{book.summary}</p>
      </div>

      {/* 오른쪽: 본문 내용 */}
      <div style={{ flex: 2, maxHeight: '400px', overflowY: 'scroll', paddingRight: '1rem' }}>
        <h3>책 내용</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{book.content}</p>
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button onClick={Edit} style={{ marginRight: '1rem' }}>책 수정</button>
          <button onClick={Delete}>책 삭제</button>
        </div>
      </div>
    </div>
  );
};

export default Book_Page;
