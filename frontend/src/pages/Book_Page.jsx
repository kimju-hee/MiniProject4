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
          <img src={book.coverImage} alt="cover" style={{ width: '210px', maxHeight: '296px', objectFit: 'cover' }} />
        ) : (
          <div style={{
            background: 'black',
            color: 'white',
            width: '210px', 
            height: '296px',
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
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
        {/* 스크롤 영역 */}
        <div style={{
          flex: 1,
          maxHeight: '500px',
          overflowY: 'auto',
          paddingRight: '1rem'
        }}>
          <h3>책 내용</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{book.content}</p>
        </div>

        {/* 버튼 영역 (스크롤 영향 없음) */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button onClick={Edit} style={buttonStyle}>책 수정</button>
          <button onClick={Delete} style={buttonStyle}>책 삭제</button>
        </div>
      </div>
    </div>
  );
};
const buttonStyle = {
  width: '150px',
  height: '40px',
  backgroundColor: 'rgb(17, 159, 224)',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',              
  padding: '0.5rem 0.5rem',
};
export default Book_Page;
