// src/pages/BookRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookRegister = () => {
  const navigate = useNavigate();

  // 입력 필드 상태 관리
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null); // AI 생성 결과 자리

  // AI 북커버 생성 (더미)
  const generateCover = () => {
    // 실제 API 호출은 나중에 연동
    setCoverImage('https://via.placeholder.com/150x200.png?text=AI+북커버');
  };

  const handleSubmit = () => {
    // 나중에 백엔드로 POST 요청을 보내는 로직 추가 예정
    const newBook = {
      id: Date.now(), // 임시 ID
      title,
      coverImage,
    };

    // localStorage를 이용해 메인화면에서 확인 가능하게 유지
    const existingBooks = JSON.parse(localStorage.getItem('books') || '[]');
    localStorage.setItem('books', JSON.stringify([...existingBooks, newBook]));

    navigate('/');
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* 왼쪽: 입력 폼 */}
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

      {/* 오른쪽: 북커버 + 버튼 */}
      <div style={{ textAlign: 'center' }}>
        {coverImage ? (
          <img src={coverImage} alt="생성된 표지" style={{ width: '150px', height: '200px' }} />
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

        <button onClick={generateCover} style={{ marginBottom: '1rem' }}>
          AI 북커버 생성
        </button>
        <br />
        <button onClick={handleSubmit} style={{ marginBottom: '0.5rem' }}>
          등록
        </button>
        <br />
        <button onClick={() => navigate('/')}>취소</button>
      </div>
    </div>
  );
};

export default BookRegister;
