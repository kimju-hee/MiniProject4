import React, { useState } from "react";
import axios from "axios";

function BookForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateCover = async () => {
    console.log("🔑 OpenAI API KEY:", process.env.REACT_APP_OPENAI_API_KEY);

  setLoading(true);
  try {
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an assistant that creates short, vivid prompts for generating book cover illustrations using DALL·E."
          },
          {
            role: "user",
            content: `
제목: ${title}
카테고리: ${category}
태그: ${tags}
내용: ${content}
위 정보를 바탕으로 영어로, 시각적으로 표현 가능한 DALL·E용 북커버 생성 프롬프트 한 문단만 작성해줘.
`
          }
        ],
        temperature: 0.8
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const prompt = gptResponse.data.choices[0].message.content.trim();
    console.log("GPT 생성 프롬프트:", prompt);

    const imageResponse = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "512x512"
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const imageUrl = imageResponse.data.data[0].url;
    setCoverImage(imageUrl);
  } catch (error) {
    alert("이미지 생성 실패: " + error.message);
    console.error("오류 상세:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  const register = async () => {
    const book = {
      title,
      category,
      tags,
      content,
      coverImage
    };

    try {
      await axios.post("http://localhost:8080/api/books", book);
      alert("등록 완료!");
    } catch (error) {
      alert("등록 실패: " + error.message);
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
        <button onClick={generateCover}>AI 북커버 생성</button>
        <button onClick={register}>등록</button>
      </div>
    </div>
  );
}

export default BookForm;
