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
  const [originalCoverImage, setOriginalCoverImage] = useState(''); // 원본 표지 저장
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [coverChanged, setCoverChanged] = useState(false); // 표지 변경 여부 추적

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
        setOriginalCoverImage(book.coverUrl || ''); // 원본 표지 저장
        setCoverChanged(false);
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

  // AI 북커버 생성 (미리보기 방식으로 변경)
  const handleGenerateCover = async () => {
    if (!title.trim()) {
      alert('제목을 먼저 입력해주세요.');
      return;
    }

    if (!window.confirm('새로운 AI 표지를 생성하시겠습니까?\n(미리보기로 생성되며, "수정 완료"를 눌러야 실제로 저장됩니다)')) {
      return;
    }

    try {
      setGenerating(true);
      console.log('🎨 AI 북커버 미리보기 생성 시작...');
      
      // 미리보기 API 사용 (실제 저장하지 않음)
      const response = await axios.post('http://localhost:8080/books/preview-cover', {
        title: title.trim(),
        content: content.trim(),
        bookCategory: category.trim(),
        bookTag: tags.trim(),
        userId: 1 // 임시 사용자 ID
      });
      
      const newCoverUrl = response.data.coverUrl;
      
      if (!newCoverUrl || newCoverUrl.includes('error')) {
        throw new Error(response.data.message || '표지 생성에 실패했습니다.');
      }
      
      setCoverImage(newCoverUrl);
      setCoverChanged(true); // 표지가 변경되었음을 표시
      console.log('✅ 새로운 표지 미리보기 생성:', newCoverUrl);
      alert('🎨 새로운 AI 표지 미리보기가 생성되었습니다!\n"수정 완료"를 눌러야 실제로 저장됩니다.');
      
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

  // 표지 제거 (미리보기)
  const handleRemoveCover = () => {
    if (!window.confirm('표지를 제거하시겠습니까?\n(미리보기로 제거되며, "수정 완료"를 눌러야 실제로 저장됩니다)')) {
      return;
    }
    
    setCoverImage('');
    setCoverChanged(true);
  };

  // 책 정보 수정
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    const confirmMessage = coverChanged 
      ? '책 정보와 표지를 수정하시겠습니까?' 
      : '책 정보를 수정하시겠습니까?';
    
    if (!window.confirm(confirmMessage)) {
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
      
      const successMessage = coverChanged 
        ? '📝 책 정보와 표지가 성공적으로 수정되었습니다!' 
        : '📝 책 정보가 성공적으로 수정되었습니다!';
      
      alert(successMessage);
      navigate(`/books/${id}`); // 상세 페이지로 이동
      
    } catch (error) {
      console.error('❌ 책 수정 실패:', error);
      alert('책 수정에 실패했습니다:\n' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // 취소 처리 (원본 상태로 복구)
  const handleCancel = () => {
    const hasChanges = 
      title !== (originalData?.title || '') ||
      category !== (originalData?.bookCategory || '') ||
      tags !== (originalData?.bookTag || '') ||
      content !== (originalData?.content || '') ||
      coverChanged;
    
    if (hasChanges) {
      if (!window.confirm('변경사항이 있습니다. 정말로 취소하시겠습니까?\n모든 변경사항이 사라집니다.')) {
        return;
      }
    }
    
    navigate(`/books/${id}`);
  };

  // 원본 데이터를 저장하기 위한 state 추가
  const [originalData, setOriginalData] = useState(null);

  // useEffect 수정
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/books/${id}`);
        const book = response.data;
        
        // 원본 데이터 저장
        setOriginalData(book);
        
        setTitle(book.title || '');
        setCategory(book.bookCategory || '');
        setTags(book.bookTag || '');
        setContent(book.content || '');
        setCoverImage(book.coverUrl || '');
        setOriginalCoverImage(book.coverUrl || '');
        setCoverChanged(false);
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
            onClick={handleCancel} 
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
        <h3 style={{ marginBottom: '2rem', color: '#333' }}>
          🎨 북커버 {coverChanged && '(미리보기)'}
        </h3>
        
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
              
              {/* 표지 상태 표시 */}
              {coverChanged && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(255, 193, 7, 0.9)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  📝 미리보기
                </div>
              )}
              
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
                  {coverChanged && (
                    <div style={{ fontSize: '12px', color: '#ffc107' }}>
                      (미리보기로 제거됨)
                    </div>
                  )}
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
            {generating ? '🎨 생성 중...' : '🎨 AI 북커버 미리 생성'}
          </button>
          
          {coverImage && !generating && (
            <button 
              onClick={handleRemoveCover}
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
          backgroundColor: coverChanged ? '#fff3cd' : '#e8f4f8',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#555',
          textAlign: 'left',
          border: coverChanged ? '1px solid #ffeaa7' : 'none'
        }}>
          {coverChanged ? (
            <>
              <strong>⚠️ 미리보기 모드:</strong><br/>
              • 현재 표지는 미리보기 상태입니다<br/>
              • "수정 완료"를 눌러야 실제로 저장됩니다<br/>
              • "취소"를 누르면 원래 표지로 돌아갑니다<br/>
            </>
          ) : (
            <>
              <strong>💡 AI 북커버 생성 팁:</strong><br/>
              • 제목을 수정한 후 재생성하면 새로운 스타일의 표지 생성<br/>
              • 카테고리와 태그를 추가/수정하면 더 정확한 표지 생성<br/>
              • 내용을 더 구체적으로 작성하면 주제에 맞는 표지 생성<br/>
              • 마음에 들지 않으면 여러 번 재생성 가능<br/>
              • 미리보기로 생성되어 안전합니다<br/>
            </>
          )}
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
            {generating ? '🎨 AI가 새로운 북커버 미리보기를 생성하고 있습니다...' : 
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