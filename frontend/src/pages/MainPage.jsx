import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  // 등록된 책 불러오기
  const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');

  return (
    <div style={{ padding: '2rem' }}>
      {/* 상단 버튼/검색 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/books/register')}>📘 책 등록</button>
        <div>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button>검색</button>
        </div>
      </div>

      {/* 도서 리스트 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.5rem' }}>
        {storedBooks.length === 0 ? (
          <div>등록된 도서가 없습니다.</div>
        ) : (
          storedBooks.map((book) => (
            <div
              key={book.id}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => navigate(`/books/${book.id}`)}
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt="book cover"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: 'black',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                  }}
                >
                  표지 없음
                </div>
              )}
              <div style={{ marginTop: '0.5rem' }}>{book.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
