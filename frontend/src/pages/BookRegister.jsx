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

  // AI 북커버 미리 생성
  const generateCover = async () => {
    if (!title.trim()) {
      alert('제목을 먼저 입력해주세요!');
      return;
    }

    setGenerating(true);
    try {
      console.log('🎨 AI 북커버 생성 시작...');
      
      const response = await axios.post('http://localhost:8080/books/preview-cover', {
        title: title.trim(),
        content: content.trim(),
        bookCategory: category.trim(),
        bookTag: tags.trim(),
        userId: defaultUserId
      });

      const generatedCoverUrl = response.data.coverUrl;
      setCoverImage(generatedCoverUrl);
      
      console.log('✅ AI 북커버 생성 완료:', generatedCoverUrl);
      alert('🎨 AI 북커버가 생성되었습니다!');

    } catch (error) {
      console.error('AI 북커버 생성 실패:', error);
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        alert('🔑 OpenAI API 키가 설정되지 않았거나 유효하지 않습니다.\n백엔드 설정을 확인해주세요.');
      } else if (error.response?.status === 429) {
        alert('⏰ API 호출 한도에 도달했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.response?.status === 500) {
        alert('🔧 서버에서 표지 생성 중 오류가 발생했습니다.\nOpenAI API 키 설정을 확인해주세요.');
      } else {
        alert('북커버 생성에 실패했습니다.\n오류: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setGenerating(false);
    }
  };

  // 책 등록 (일반)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      console.log('📚 책 등록 시작...');
      
      const response = await axios.post('http://localhost:8080/books', {
        title: title.trim(),
        content: content.trim(),
        coverUrl: coverImage || '', // 생성된 표지 URL 또는 빈 문자열
        userId: defaultUserId,
        bookCategory: category.trim(),
        bookTag: tags.trim()
      });

      console.log('✅ 책 등록 완료:', response.data);
      alert(`책이 성공적으로 등록되었습니다!\n제목: ${response.data.title}`);
      navigate('/'); // 메인 페이지로 이동
      
    } catch (error) {
      console.error('책 등록 실패:', error);
      alert('책 등록에 실패했습니다.\n오류: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // AI 표지 생성과 함께 책 등록 (수정된 로직)
  const handleSubmitWithAICover = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      let finalCoverUrl = coverImage;

      // 미리보기된 표지가 없는 경우에만 새로 생성
      if (!coverImage) {
        console.log('🤖 표지가 없어서 AI 표지 생성 중...');
        
        try {
          const coverResponse = await axios.post('http://localhost:8080/books/preview-cover', {
            title: title.trim(),
            content: content.trim(),
            bookCategory: category.trim(),
            bookTag: tags.trim(),
            userId: defaultUserId
          });

          finalCoverUrl = coverResponse.data.coverUrl;
          setCoverImage(finalCoverUrl); // 생성된 표지를 상태에도 저장
          console.log('✅ AI 표지 생성 완료:', finalCoverUrl);
        } catch (coverError) {
          console.error('AI 표지 생성 실패:', coverError);
          
          // 표지 생성 실패 시 사용자에게 선택권 제공
          const continueWithoutCover = window.confirm(
            '⚠️ AI 표지 생성에 실패했습니다.\n표지 없이 책을 등록하시겠습니까?'
          );
          
          if (!continueWithoutCover) {
            return; // 등록 취소
          }
          
          finalCoverUrl = ''; // 빈 표지로 진행
        }
      } else {
        console.log('✅ 기존 미리보기 표지 사용:', finalCoverUrl);
      }

      // 책 등록
      console.log('📚 책 등록 중...');
      const bookResponse = await axios.post('http://localhost:8080/books', {
        title: title.trim(),
        content: content.trim(),
        coverUrl: finalCoverUrl,
        userId: defaultUserId,
        bookCategory: category.trim(),
        bookTag: tags.trim()
      });

      console.log('✅ 책 등록 완료:', bookResponse.data);
      
      const successMessage = finalCoverUrl 
        ? `🎉 AI 표지와 함께 책이 성공적으로 등록되었습니다!\n제목: ${bookResponse.data.title}`
        : `📚 책이 성공적으로 등록되었습니다!\n제목: ${bookResponse.data.title}`;
      
      alert(successMessage);
      navigate('/');
      
    } catch (error) {
      console.error('책 등록 실패:', error);
      alert('책 등록에 실패했습니다.\n오류: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
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
            placeholder="예) 해리포터와 마법사의 돌"
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
            placeholder="예) 판타지, 로맨스, 공포, 과학/기술"
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
            placeholder="예) 마법사, 호그와트, 모험, 우정"
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
            placeholder="작품의 줄거리, 등장인물, 배경 등을 자세히 입력하세요. 내용이 구체적일수록 더 정확한 AI 표지가 생성됩니다."
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
            onClick={handleSubmitWithAICover} 
            disabled={loading || generating || !title.trim() || !content.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (loading || generating || !title.trim() || !content.trim()) 
                ? '#ccc' : '#20c997',
              flex: 1,
              minWidth: '180px'
            }}
          >
            {loading ? 
              (coverImage ? '📚 미리보기 표지로 등록 중...' : '🎨 AI 표지 생성 및 등록 중...') : 
              '🎨 AI 표지와 함께 등록'}
          </button>
          
          <button 
            onClick={handleSubmit} 
            disabled={loading || generating || !title.trim() || !content.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (loading || generating || !title.trim() || !content.trim()) 
                ? '#ccc' : '#285be6',
              flex: 1,
              minWidth: '120px'
            }}
          >
            {loading ? '📚 등록 중...' : '📚 일반 등록'}
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            disabled={loading || generating}
            style={{
              ...buttonStyle,
              backgroundColor: (loading || generating) ? '#ccc' : '#6c757d',
              flex: 1,
              minWidth: '100px' 
            }}
          >❌ 취소</button>
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
        <h3 style={{ marginBottom: '2rem', color: '#333' }}>🎨 AI 북커버 미리보기</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          {coverImage ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={coverImage} 
                alt="AI generated book cover" 
                style={{ 
                  width: '218px', 
                  height: '308px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
              {/* 표지 상태 표시 */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(40, 201, 151, 0.9)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ✓ 생성완료
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '218px',
                height: '308px',
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
              }}>

              {generating ? (
                <>
                  <div style={{ fontSize: '2rem' }}>🎨</div>
                  <div>AI 생성 중...</div>
                  <div style={{ fontSize: '12px' }}>약 10-30초 소요</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem' }}>📚</div>
                  <div>표지 미리보기</div>
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
            {generating 
              ? '🎨 AI 생성 중...' 
              : coverImage 
                ? '🔄 AI 북커버 재생성' 
                : '🎨 AI 북커버 미리보기'}
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
          • <strong>제목:</strong> 명확하고 구체적으로 입력<br/>
          • <strong>카테고리:</strong> 장르를 정확히 입력 (판타지, 로맨스 등)<br/>
          • <strong>태그:</strong> 주요 키워드나 테마 입력<br/>
          • <strong>내용:</strong> 줄거리와 분위기를 자세히 작성<br/>
          • 내용이 구체적일수록 더 정확한 표지 생성<br/>
          • 미리보기 후 "AI 표지와 함께 등록"하면 같은 표지 사용<br/>
          • 생성에는 10-30초 정도 소요됩니다
        </div>

        {/* 상태 표시 */}
        {(loading || generating) && (
          <div style={{ 
            marginTop: '1rem', 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            {generating ? '🎨 AI가 북커버를 생성하고 있습니다...' : 
             loading ? (coverImage ? '💾 미리보기 표지로 책을 등록하고 있습니다...' : '💾 AI 표지를 생성하며 책을 등록하고 있습니다...') : ''}
          </div>
        )}

        {/* 표지 미리보기 완료 안내 */}
        {coverImage && !loading && !generating && (
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#155724'
          }}>
            ✅ <strong>표지 미리보기 완료!</strong><br/>
            이제 "AI 표지와 함께 등록" 버튼을 누르면<br/>
            이 표지로 바로 등록됩니다.
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