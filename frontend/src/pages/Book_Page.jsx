// src/pages/Book_Page.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Book_Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // 책 정보 가져오기
  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('책 정보를 가져오는데 실패했습니다:', error);
      alert('책 정보를 찾을 수 없습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  // 책 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 책을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setDeleting(true);
      await axios.delete(`http://localhost:8080/books/${id}`);
      alert('책이 성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('책 삭제 실패:', error);
      alert('책 삭제에 실패했습니다: ' + (error.response?.data?.message || error.message));
      setDeleting(false);
    }
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/books/edit/${id}`);
  };

  // 표지 재생성
  const handleRegenerateCover = async () => {
    if (!window.confirm('새로운 AI 표지를 생성하시겠습니까?')) {
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/books/${id}/generate`);
      setBook(prev => ({ ...prev, coverUrl: response.data }));
      alert('새로운 표지가 생성되었습니다!');
    } catch (error) {
      console.error('표지 생성 실패:', error);
      alert('표지 생성에 실패했습니다.');
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
        📖 책 정보를 불러오는 중...
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem',
        color: '#666'
      }}>
        <h2>❌ 도서를 찾을 수 없습니다</h2>
        <button 
          onClick={() => navigate('/')}
          style={buttonStyle}
        >
          🏠 홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      padding: '2rem', 
      gap: '1.5rem',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
    }}>
      {/* 왼쪽: 북커버 및 메타 정보 */}
      <div style={{ 
        flex: 1, 
        maxWidth: '400px',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt="cover" 
              style={{ 
                width: '270px', 
                maxHeight: '386px', 
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }} 
            />
          ) : (
            <div style={{
              background: 'linear-gradient(135deg,rgb(199, 101, 255) 0%, #764ba2 100%)',
              color: 'white',
              width: '270px', 
              height: '386px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              margin: '0 auto',
              fontSize: '18px'
            }}>
              📚 표지 없음
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            margin: '0 0 1rem 0', 
            color: '#333',
            fontSize: '24px',
            lineHeight: '1.3'
          }}>
            제목:{book.title}
          </h1>
          
          {book.bookCategory && (
            <div style={{ 
              display: 'inline-block',
              color: '#rgb(46, 89, 233)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '15px',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
               카테고리:{book.bookCategory}
            </div>
          )}
          
          {book.bookTag && (
            <div style={{ 
              color: '#666',
              fontSize: '14px',
              marginBottom: '1rem'
            }}>
              태그:{book.bookTag}
            </div>
          )}

          {book.createdAt && (
            <div style={{ 
              color: '#999',
              fontSize: '12px',
              marginBottom: '2rem'
            }}>
               등록:{new Date(book.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}

          {/* 버튼들 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem'
          }}>
            <button 
              onClick={handleEdit} 
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg,rgb(60, 184, 29) 0%,rgb(12, 133, 28) 100%)'
              }}
            >
              ✏️ 책 수정
            </button>
            
            <button 
              onClick={handleRegenerateCover}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg,rgb(13, 71, 158) 0%,rgb(45, 150, 177) 100%)',
                
              }}
            >
              🎨 표지 재생성
            </button>
            
            <button 
              onClick={handleDelete} 
              disabled={deleting}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg,rgb(255, 5, 5) 0%,rgb(207, 57, 57) 100%)',
              }}
            >
              {deleting ? '삭제 중...' : '🗑️ 책 삭제'}
            </button>
            
            <button 
              onClick={() => navigate('/')}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg,rgb(58, 56, 56) 0%,rgb(77, 69, 69) 100%)',

              }}
            >
              ≡ 목록으로
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽: 본문 내용 */}
      <div style={{ 
        flex: 2, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        maxHeight: '905px',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '2rem 2rem 1rem 2rem',
          borderBottom: '1px solid #eee'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#333',
            fontSize: '20px'
          }}>
            📖 책 내용
          </h2>
        </div>

        {/* 스크롤 가능한 내용 영역 */}
        <div style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
          lineHeight: '1.8',
          fontSize: '16px',
          maxHeight: 'calc(110vh - 150px)'
        

        }}>
          {book.content ? (
            <p style={{ 
              whiteSpace: 'pre-wrap',
              color: '#444',
              margin: 0
            }}>
              {book.content}
            </p>
          ) : (
            <div style={{ 
              textAlign: 'center',
              color: '#999',
              fontStyle: 'italic',
              padding: '4rem'
            }}>
              📝 작성된 내용이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  width: '100%',
  height: '45px',
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
};

export default Book_Page;