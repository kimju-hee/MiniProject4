import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  // 백엔드에서 책 목록 가져오기
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/books');
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('책 목록을 가져오는데 실패했습니다:', error);
      // 백엔드 연결 실패 시 로컬스토리지 사용
      const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
      setBooks(storedBooks);
      setFilteredBooks(storedBooks);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 책 목록 로드
  useEffect(() => {
    fetchBooks();
  }, []);

  // 검색 기능
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.bookCategory && book.bookCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.bookTag && book.bookTag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.content && book.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBooks(filtered);
  };

  // Enter 키로 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 책 삭제 기능
  const handleDeleteBook = async (bookId, e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    
    if (!window.confirm('정말로 이 책을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/books/${bookId}`);
      alert('책이 삭제되었습니다.');
      fetchBooks(); // 목록 새로고침
    } catch (error) {
      console.error('책 삭제 실패:', error);
      alert('책 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        📚 책 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* 상단 헤더 */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>📚 나만의 책 관리</h1>
        <p style={{ color: '#666', margin: 0 }}>당신만의 책을 등록하고 관리해보세요</p>
      </div>

      {/* 상단 버튼/검색 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button 
          onClick={() => navigate('/register')}
          style={{
              width: '200px',
              height: '60px',
              fontSize: '20px',
              backgroundColor: '#ffffff',      
              color: '#000000',                 
              border: '1px solid #000000',     
              borderRadius: '16px',             
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(240, 240, 240)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(255, 255, 255)'}
        > ➕ 새 책 등록</button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem'
        }}>
          <input 
            type="text" 
            placeholder="제목, 장르, 태그로 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ 
              padding: '0.75rem', 
              fontSize: '20px',
              width: '350px',
              height: '60px',
              border: '1px solid #000000',
              borderRadius: '12px',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleSearch}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '20px',
              backgroundColor: '#ffffff',        
              color: '#000000',                  
              border: '1px solid #000000',     
              borderRadius: '16px',    
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',  
              color: 'black',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              width: '100px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem 0.5rem',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(240, 240, 240)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(255, 255, 255)'}
          >🔍 검색</button>
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilteredBooks(books);
              }}
              style={{
                padding: '0.75rem',
                fontSize: '14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem 0.5rem',
              }}>❌</button>
          )}
        </div>
      </div>

      {/* 검색 결과 표시 */}
      {searchTerm && (
        <div style={{ marginBottom: '1rem', color: '#666' }}>
          "{searchTerm}" 검색 결과: {filteredBooks.length}개
        </div>
      )}

      {/* 도서 리스트 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '2rem'
      }}>
        {filteredBooks.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem',
            color: '#666',
            fontSize: '18px'
          }}>
            {books.length === 0 ? (
              <>
                등록된 도서가 없습니다.<br/>
                <small style={{ fontSize: '14px', marginTop: '1rem', display: 'block' }}>
                  "새 책 등록" 버튼을 클릭하여 첫 책을 등록해보세요!
                </small>
              </>
            ) : (
              '🔍 검색 결과가 없습니다.'
            )}
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}
              onClick={() => navigate(`/books/${book.id}`)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {/* 삭제 버튼 */}
              <button
                onClick={(e) => handleDeleteBook(book.id, e)}
                style={{
                  position: 'absolute',
                  top: '0rem',
                  right: '0.3rem',
                  background: 'rgba(220, 53, 69, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="책 삭제"
              >
                ✕
              </button>

              {/* 책 표지 */}
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt="book cover"
                  style={{ 
                    width: '144px', 
                    height: '205px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '144px',
                    height: '205px',
                    backgroundColor: '#e9ecef',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    margin: '0 auto',
                    border: '2px dashed #dee2e6'
                  }}
                >
                  📚<br/>표지 없음
                </div>
              )}
              
              {/* 책 정보 */}
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '17px',
                  fontWeight: 'bold',
                  color: 'black',
                  lineHeight: '1.3'
                }}>
                  {book.title}
                </h3>
                
                {book.bookCategory && (
                  <div style={{ marginBottom: '0rem' }}>
                    {book.bookCategory.split(',').map((category, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '13px',
                          color: 'rgb(13, 42, 207)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          marginRight: '0.3rem',
                          marginBottom: '0rem',
                        }}
                      >
                        #{category.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {book.bookTag && (
                  <div style={{ marginTop: '0.25rem' }}>
                    {book.bookTag.split(',').map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '12px',
                          color: 'rgb(93, 96, 110)',
                          marginRight: '0.3rem',
                        }}
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {book.createdAt && (
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#aaa',
                    marginTop: '0.8rem',
                    
                    
                  }}>
                    {new Date(book.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 새로고침 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={fetchBooks}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '15px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer'
          }}onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(240, 240, 240)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(255, 255, 255)'}
            >새로고침</button>
      </div>
    </div>
  );
};

export default MainPage;