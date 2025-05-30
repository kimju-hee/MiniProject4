// src/pages/Book_Edit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Book_Edit = () => {
  const { id } = useParams(); // URL에서 책 ID 추출
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  // 책 정보 로딩
  useEffect(() => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const book = books.find((b) => b.id === Number(id));
    if (book) {
      setTitle(book.title || '');
      setCategory(book.category || '');
      setTags(book.tags || '');
      setContent(book.content || '');
      setCoverImage(book.coverImage || null);
    }
  }, [id]);

  // AI 북커버 생성 (가짜)
  const GenerateCover = () => {
    setCoverImage('https://via.placeholder.com/150x200.png?text=AI+북커버');
  };

  // 수정 버튼 클릭 시 알림
  const Update = () => {
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* 왼쪽 입력 필드 */}
      <div style={{ flex: 1 }}>
        <div>
          <label>1. 작품 제목</label><br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예) 해리포터" />
        </div>
        <div>
          <label>2. 작품 카테고리</label><br />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="예) 판타지" />
        </div>
        <div>
          <label>3. 작품 태그</label><br />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="예) 마법사, 호그와트" />
        </div>
        <div>
          <label>4. 작품 내용</label><br />
          <textarea
            rows={6}
            style={{ width: '100%' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="작품 내용을 입력하세요..."
          />
        </div>
      </div>

      {/* 오른쪽: 북커버 및 버튼 */}
      <div style={{ textAlign: 'center' }}>
        {coverImage ? (
          <img src={coverImage} alt="book cover" style={{ width: '150px', height: '200px' }} />
        ) : (
          <div
            style={{
              width: '150px',
              height: '200px',
              backgroundColor: 'black',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            표지 없음
          </div>
        )}
        <button onClick={GenerateCover} style={buttonStyle}>
          AI 북커버 생성
        </button>
        <br />
        <button onClick={Update} style={buttonStyle}>수정하기기</button>
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
export default Book_Edit;
