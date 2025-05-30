import React, { useState } from 'react';
import axios from 'axios';

const BookCoverGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedCovers, setSavedCovers] = useState([]);

  const generateImage = async () => {
    if (!apiKey) {
      alert('🔐 OpenAI API 키를 입력해주세요!');
      return;
    }

    const prompt = `책 제목은 "${title}", 장르는 "${category}", 주요 키워드는 ${tags}입니다. 내용: ${content.slice(0, 200)}. 이 내용을 바탕으로 한 책 표지 일러스트를 생성해주세요.`;
    setLoading(true);
    setImageUrl('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt,
          n: 1,
          size: '512x512',
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setImageUrl(response.data.data[0].url);
    } catch (error) {
      console.error('❌ 이미지 생성 실패:', error);
      alert('이미지를 생성하는 도중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (imageUrl) {
      setSavedCovers([...savedCovers, { title, category, tags, content, imageUrl }]);
    }
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* 왼쪽 - 생성된 이미지 */}
      <div style={{ marginRight: '2rem', textAlign: 'center' }}>
        <h3>📘 생성된 북커버</h3>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="북커버"
            style={{ width: '256px', height: '256px', border: '1px solid #ccc' }}
          />
        ) : (
          <div
            style={{
              width: '256px',
              height: '256px',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '14px',
            }}
          >
            생성된 이미지 없음
          </div>
        )}

        {/* 버튼 영역 */}
        <div style={{ marginTop: '1rem' }}>
          <button onClick={generateImage} disabled={loading} style={{ marginRight: '1rem' }}>
            {loading ? '생성 중...' : '🎨 AI 북커버 생성'}
          </button>
          <button onClick={handleRegister} disabled={!imageUrl}>
            📌 등록
          </button>
        </div>
      </div>

      {/* 오른쪽 - 입력 폼 */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <label>🔐 OpenAI API Key</label><br />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>1. 작품 제목</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 해리포터"
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>2. 작품 카테고리</label><br />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="예: 판타지"
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>3. 작품 태그</label><br />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="예: 마법사, 호그와트"
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>4. 작품 내용</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="작품 내용을 입력해주세요"
            rows={6}
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>
      </div>

      {/* 생성된 목록은 아래에 표시 */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
        {savedCovers.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3>📚 등록된 북커버들</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {savedCovers.map((cover, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <img
                    src={cover.imageUrl}
                    alt={cover.title}
                    style={{ width: '128px', height: '128px', border: '1px solid #ccc' }}
                  />
                  <div style={{ fontSize: '12px' }}>{cover.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCoverGenerator;
