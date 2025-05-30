// src/pages/BookRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookRegister = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);

//경로 수정 필요요
  const generateCover = () => {
    setCoverImage('https://via.placeholder.com/150x200.png?text=AI+북커버');
  };

  const Submit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }

    const newBook = {
      id: Date.now(),
      title,
      category,
      tags,
      content,
      coverImage,
    };

    const existingBooks = JSON.parse(localStorage.getItem('books') || '[]');
    localStorage.setItem('books', JSON.stringify([...existingBooks, newBook]));

    navigate('/');
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
          <img src={coverImage} alt="book cover" style={{ width: '157px', height: '244px' }} />
        ) : (
          <div
            style={{
              width: '157px',
              height: '244px',
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

        {/* 버튼 3개 세로 정렬 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={generateCover} style={buttonStyle}>AI 북커버 생성</button>
          <button onClick={Submit} style={buttonStyle}>책 등록</button>
          <button onClick={() => navigate('/')} style={buttonStyle}>취소</button>
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

export default BookRegister;
