// src/pages/Book_Edit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Book_Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // 책 정보 로딩
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/books/${id}`);
        const book = response.data;
        
        setTitle(book.title || '');
        setCategory(book.bookCategory || '');
        setTags(book.bookTag || '');
        setContent(book.content || '');
        setCoverImage(book.coverUrl || '');
      } catch (error) {
        console.error('책 정보를 가져오는데 실패했습니다:', error);
        alert('책 정보를 찾을 수 없습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  // AI 북커버 생성 (수정된 로직)
  const handleGenerateCover = async () => {
    if (!title.trim()) {
      alert('제목을 먼저 입력해주세요.');
      return;
    }

    if (!window.confirm('새로운 AI 표지를 생성하시겠습니까?')) {
      return;
    }

    try {
      setGenerating(true);
      console.log('🎨 AI 북커버 재생성 시작...');
      
      // 백엔드 API 호출
      const response = await axios.post(`http://localhost:8080/books/${id}/generate`);
      
      // 응답 구조 확인
      console.log('📡 API 응답:', response.data);
      
      // coverUrl 추출 (Map<String, String> 응답 처리)
      const newCoverUrl = response.data.coverUrl || response.data;
      
      if (!newCoverUrl || newCoverUrl.includes('error')) {
        throw new Error(response.data.message || '표지 생성에 실패했습니다.');
      }
      
      setCoverImage(newCoverUrl);
      console.log('✅ 새로운 표지 URL:', newCoverUrl);
      alert('🎨 새로운 AI 표지가 생성되었습니다!');
      
    } catch (error) {
      console.error('❌ 표지 생성 실패:', error);
      
      // 세분화된 에러 처리
      if (error.response?.status === 500) {
        alert('🔧 서버에서 표지 생성 중 오류가 발생했습니다.\nOpenAI API 키 설정을 확인해주세요.');
      } else if (error.response?.status === 400 || error.response?.status === 401) {
        alert('🔑 OpenAI API 키가 설정되지 않았거나 유효하지 않습니다.\n백엔드 설정을 확인해주세요.');
      } else if (error.response?.status === 429) {
        alert('⏰ API 호출 한도에 도달했습니다.\n잠시 후 다시 시도해주세요.');
      } else {
        alert('표지 생성에 실패했습니다:\n' + (error.response?.data?.message || error.message));
      }
    } finally {
      setGenerating(false);
    }
  };

  // 책 정보 수정
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    if (!window.confirm('책 정보를 수정하시겠습니까?')) {
      return;
    }

    try {
      setSaving(true);
      console.log('💾 책 정보 수정 시작...');
      
      const updateData = {
        title: title.trim(),
        content: content.trim(),
        coverUrl: coverImage || '',
        userId: 1, // 임시 사용자 ID
        bookCategory: category.trim(),
        bookTag: tags.trim()
      };
      
      await axios.put(`http://localhost:8080/books/${id}`, updateData);

      console.log('✅ 책 정보 수정 완료');
      alert('📝 책 정보가 성공적으로 수정되었습니다!');
      navigate(`/books/${id}`); // 상세 페이지로 이동
      
    } catch (error) {
      console.error('❌ 책 수정 실패:', error);
      alert('책 수정에 실패했습니다:\n' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
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
        📝 책 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      padding: '2rem', 
      gap: '3rem',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* 왼쪽 입력 필드 */}
      <div style={{ 
        flex: 2,
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '2rem', color: '#333' }}>📝 책 정보 수정</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#555'
          }}>
            1. 작품 제목 *
          </label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="예) 해리포터"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#555'
          }}>
            2. 작품 카테고리
          </label>
          <input 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="예) 판타지"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#555'
          }}>
            3. 작품 태그
          </label>
          <input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="예) 마법사, 호그와트"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#555'
          }}>
            4. 작품 내용 *
          </label>
          <textarea
            rows={12}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              lineHeight: '1.6'
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="작품 내용을 입력하세요..."
          />
        </div>

        {/* 하단 버튼들 */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleUpdate} 
            disabled={saving || generating || !title.trim() || !content.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (saving || generating || !title.trim() || !content.trim()) ? '#ccc' : '#28a745',
              flex: 1,
              minWidth: '120px'
            }}
          >
            {saving ? '💾 저장 중...' : '💾 수정 완료'}
          </button>
          
          <button 
            onClick={() => navigate(`/books/${id}`)} 
            disabled={saving || generating}
            style={{
              ...buttonStyle,
              backgroundColor: (saving || generating) ? '#ccc' : '#6c757d',
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
        textAlign: 'center',
      }}>
        <h3 style={{ marginBottom: '2rem', color: '#333' }}>🎨 북커버</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          {coverImage ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={coverImage} 
                alt="book cover" 
                style={{ 
                  width: '220px', 
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }} 
              />
              {generating && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  borderRadius: '8px',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '2rem' }}>🎨</div>
                  <div>새 표지 생성 중...</div>
                </div>
              )}
            </div>
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
                  <div style={{ fontSize: '2rem' }}>🎨</div>
                  <div>AI 생성 중...</div>
                  <div style={{ fontSize: '12px' }}>약 10-30초 소요</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem' }}>📚</div>
                  <div>표지 없음</div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          <button 
            onClick={handleGenerateCover} 
            disabled={generating || saving || !title.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (generating || saving || !title.trim()) ? '#ccc' : '#28a745',
              color: (generating || saving || !title.trim()) ? '#666' : '#ffffff'
            }}
          >
            {generating ? '🎨 생성 중...' : '🎨 AI 북커버 다시 생성'}
          </button>
          
          {coverImage && !generating && (
            <button 
              onClick={() => setCoverImage('')}
              disabled={saving || generating}
              style={{
                ...buttonStyle,
                backgroundColor: (saving || generating) ? '#ccc' : '#dc3545'
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
          <strong>💡 AI 북커버 재생성 팁:</strong><br/>
          • 제목을 수정한 후 재생성하면 새로운 스타일의 표지 생성<br/>
          • 카테고리와 태그를 추가/수정하면 더 정확한 표지 생성<br/>
          • 내용을 더 구체적으로 작성하면 주제에 맞는 표지 생성<br/>
          • 마음에 들지 않으면 여러 번 재생성 가능<br/>
          • 생성에는 10-30초 정도 소요됩니다
        </div>

        {/* 상태 표시 */}
        {(saving || generating) && (
          <div style={{ 
            marginTop: '1rem', 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            {generating ? '🎨 AI가 새로운 북커버를 생성하고 있습니다...' : 
             saving ? '💾 책 정보를 저장하고 있습니다...' : ''}
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

export default Book_Edit;