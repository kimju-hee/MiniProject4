import React, { useState } from "react";
import axios from "axios";

function RegisterBook() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = 1; // 현재 사용자 ID (임시 하드코딩)

  const register = async () => {
    try {
      const bookRes = await axios.post("http://localhost:8080/books", {
        title,
        content,
        coverUrl: "", // 생성 전
        userId
      });

      const bookId = bookRes.data.bookId;
      alert("책이 등록되었습니다. bookId: " + bookId);

      await generateCover(bookId);
    } catch (err) {
      alert("책 등록 실패: " + err.message);
    }
  };

  const generateCover = async (bookId) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/books/${bookId}/generate`);

      const imageUrl = response.data.coverUrl;
      setCoverImage(imageUrl);
      alert("표지 생성 완료!");
    } catch (err) {
      alert("표지 생성 실패: " + err.message);
      console.error("서버 오류:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>작품 정보 입력</h2>
        <label>1. 작품 제목</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="예) 해리포터" />

        <label>2. 작품 카테고리</label>
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="예) 판타지" />

        <label>3. 작품 태그</label>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="예) 마법사, 호그와트" />

        <label>4. 작품 내용</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용을 입력하세요" rows={8}></textarea>
      </div>

      <div className="cover-section">
        <div className="cover-box">
          {loading ? (
            "생성 중..."
          ) : coverImage ? (
            <img src={coverImage} alt="북커버" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
          ) : (
            "AI 북커버 생성 결과"
          )}
        </div>
        <button onClick={register}>책 등록 & 표지 생성</button>
      </div>
    </div>
  );
}

export default RegisterBook;
