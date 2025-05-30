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

  // AI 북커버 생성
  const handleGenerateCover = async () => {
    if (!title.trim()) {
      alert('제목을 먼저 입력해주세요.');
      return;
    }

    try {
      setGenerating(true);
      const response = await axios.post(`http://localhost:8080/books/${id}/generate`);
      setCoverImage(response.data);
      alert('새로운 AI 표지가 생성되었습니다!');
    } catch (error) {
      console.error('표지 생성 실패:', error);
      alert('표지 생성에 실패했습니다: ' + (error.response?.data?.message || error.message));
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
      await axios.put(`http://localhost:8080/books/${id}`, {
        title: title.trim(),
        content: content.trim(),
        coverUrl: coverImage,
        userId: 1, // 임시 사용자 ID
        bookCategory: category.trim(),
        bookTag: tags.trim()
      });

      alert('책 정보가 성공적으로 수정되었습니다!');
      navigate(`/books/${id}`); // 상세 페이지로 이동
    } catch (error) {
      console.error('책 수정 실패:', error);
      alert('책 수정에 실패했습니다: ' + (error.response?.data?.message || error.message));
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
        <h2 style={{ marginBottom: '2rem', color: '#333' }}>✏️ 책 정보 수정</h2>
        
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

        {/* 하단 버튼들 (모바일 대응) */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleUpdate} 
            disabled={saving || !title.trim() || !content.trim()}
            style={{
              ...buttonStyle,
              backgroundColor: (saving || !title.trim() || !content.trim()) ? '#ccc' : '#28a745',
              flex: 1,
              minWidth: '120px'
            }}
          >
            {saving ? '💾 저장 중...' : '💾 수정 완료'}
          </button>
          
          <button 
            onClick={() => navigate(`/books/${id}`)} 
            disabled={saving}
            style={{
              ...buttonStyle,
              backgroundColor: saving ? '#ccc' : '#6c757d',
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
        height: 'fit-content'
      }}>
        <h3 style={{ marginBottom: '2rem', color: '#333' }}>🎨 북커버 미리보기</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          {coverImage ? (
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
                fontSize: '16px'
              }}
            >
              {generating ? '🎨 생성 중...' : '📚 표지 없음'}
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
              backgroundColor: (generating || saving || !title.trim()) ? '#ccc' : '#ffc107',
              color: (generating || saving || !title.trim()) ? '#666' : '#333'
            }}
          >
            {generating ? '🎨 생성 중...' : '🎨 AI 북커버 생성'}
          </button>
          
          {coverImage && (
            <button 
              onClick={() => setCoverImage('')}
              disabled={saving}
              style={{
                ...buttonStyle,
                backgroundColor: saving ? '#ccc' : '#dc3545'
              }}
            >
              🗑️ 표지 제거
            </button>
          )}
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666',
          textAlign: 'left'
        }}>
          <strong>💡 팁:</strong><br/>
          • 제목을 입력한 후 AI 표지를 생성해보세요<br/>
          • 카테고리와 태그가 있으면 더 정확한 표지가 생성됩니다<br/>
          • 표지는 언제든 다시 생성할 수 있습니다
        </div>
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