// src/pages/BookRegister.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookRegister = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [defaultUserId, setDefaultUserId] = useState(null);

  // 기본 사용자 ID 가져오기
  useEffect(() => {
    const fetchDefaultUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users');
        if (response.data && response.data.length > 0) {
          setDefaultUserId(response.data[0].userId);
        }
      } catch (error) {
        console.warn('사용자 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchDefaultUser();
  }, []);

  // 책 등록 (표지 생성 없이)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      // 백엔드 API 호출
      const response = await axios.post('http://localhost:8080/books', {
        title: title.trim(),
        content: content.trim(),
        coverUrl: coverImage || '',
        userId: defaultUserId,
        bookCategory: category.trim(),
        bookTag: tags.trim()
      });

      alert(`책이 성공적으로 등록되었습니다! (ID: ${response.data.id})`);
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Book registration error:', error);
      alert('책 등록에 실패했습니다: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // AI 북커버 생성 (백엔드에서 처리)
  const generateCover = async () => {
    if (!title.trim()) {
      alert('제목을 먼저 입력해주세요!');
      return;
    }

    setGenerating(true);
    try {
      // 1. 먼저 책을 임시로 등록
      const bookResponse = await axios.post('http://localhost:8080/books', {
        title: title.trim(),
        content: content.trim(),
        coverUrl: '',
        userId: defaultUserId,
        bookCategory: category.trim(),
        bookTag: tags.trim()
      });

      const bookId = bookResponse.data.id;

      // 2. 백엔드에서 AI 표지 생성
      const coverResponse = await axios.post(`http://localhost:8080/books/${bookId}/generate`);
      
      setCoverImage(coverResponse.data);
      alert('🎨 AI 북커버가 생성되었습니다!');

      // 3. 임시 책 삭제 (실제 등록은 "책 등록" 버튼으로)
      await axios.delete(`http://localhost:8080/books/${bookId}`);

    } catch (error) {
      console.error('Cover generation error:', error);
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        alert('🔑 OpenAI API 키가 설정되지 않았거나 유효하지 않습니다.\n백엔드 설정을 확인해주세요.');
      } else if (error.response?.status === 429) {
        alert('⏰ API 호출 한도에 도달했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert('북커버 생성에 실패했습니다. 콘솔을 확인해주세요.');
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem', minHeight: '100vh' }}>
      {/* 왼쪽 입력 필드 */}
      <div style={{ flex: 1 }}>
        <h2>📚 새 책 등록</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>1. 작품 제목 *</label><br />
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="예) 해리포터"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginTop: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>2. 작품 카테고리</label><br />
          <input 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="예) 판타지"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginTop: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>3. 작품 태그</label><br />
          <input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="예) 마법사, 호그와트"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginTop: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>4. 작품 내용 *</label><br />
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="작품 내용을 입력하세요..."
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginTop: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              resize: 'vertical',
              lineHeight: '1.6'
            }}
          />
        </div>

        {/* 하단 버튼들 */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleSubmit} 
            disabled={loading || !title.trim() || !content.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (loading || !title.trim() || !content.trim()) ? '#ccc' : 'rgb(17, 159, 224)',
              flex: 1,
              minWidth: '150px'
            }}
          >
            {loading ? '💾 등록 중...' : '📚 책 등록'}
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            disabled={loading || generating}
            style={{
              ...buttonStyle,
              backgroundColor: (loading || generating) ? '#ccc' : '#6c757d',
              flex: 1,
              minWidth: '120px'
            }}
          >
            ❌ 취소
          </button>
        </div>
      </div>

      {/* 오른쪽: 북커버 및 버튼 */}
      <div style={{ 
        width: '350px',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '2rem', color: '#333' }}>🎨 AI 북커버 생성</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          {coverImage ? (
            <img 
              src={coverImage} 
              alt="AI generated book cover" 
              style={{ 
                width: '220px', 
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }} 
            />
          ) : (
            <div
              style={{
                width: '220px',
                height: '300px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                margin: '0 auto',
                border: '2px dashed #dee2e6',
                fontSize: '16px',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {generating ? (
                <>
                  <div>🎨</div>
                  <div>AI 생성 중...</div>
                  <div style={{ fontSize: '12px' }}>약 10-20초 소요</div>
                </>
              ) : (
                <>
                  <div>📚</div>
                  <div>표지 없음</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 버튼들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={generateCover} 
            disabled={generating || loading || !title.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (generating || loading || !title.trim()) ? '#ccc' : '#28a745'
            }}
          >
            {generating ? '🎨 AI 생성 중...' : '🤖 AI 북커버 생성'}
          </button>
          
          {coverImage && (
            <button 
              onClick={() => setCoverImage(null)}
              disabled={loading || generating}
              style={{
                ...buttonStyle,
                backgroundColor: (loading || generating) ? '#ccc' : '#dc3545'
              }}
            >
              🗑️ 표지 제거
            </button>
          )}
        </div>

        {/* 도움말 */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e8f4f8',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#555',
          textAlign: 'left'
        }}>
          <strong>💡 AI 북커버 생성 팁:</strong><br/>
          • 제목, 카테고리, 태그를 정확히 입력하세요<br/>
          • 내용이 구체적일수록 더 정확한 표지가 생성됩니다<br/>
          • OpenAI API 키가 필요합니다 (백엔드 설정)<br/>
          • 생성에 10-20초 정도 소요됩니다
        </div>

        {/* 로딩 상태 표시 */}
        {(loading || generating) && (
          <div style={{ 
            marginTop: '1rem', 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            {generating ? '🎨 AI가 북커버를 생성하고 있습니다...' : '💾 책을 등록하고 있습니다...'}
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
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
  transition: 'all 0.2s ease',
  padding: '0 1rem'
};

export default BookRegister;