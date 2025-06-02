# 📘 Book Cover Generator

# 📚 도서 관리 프로젝트

AI를 활용해 책 제목, 장르, 키워드, 내용을 입력하면 **AI 기반 이미지 생성 API**로 **북커버(책 표지)**를 자동 생성해주는 웹 애플리케이션입니다.  
생성된 이미지는 저장하여 한 눈에 확인할 수 있으며, 사용자는 OpenAI의 이미지 생성 기능(DALL·E)을 활용하여 창작물을 시각적으로 표현할 수 있습니다.


## 참여 인원
<a href="https://github.com/kimju-hee" align="center">
  <img src="https://img.shields.io/badge/kimjuhee-ed61e6?style=flat-square"/>
</a>
<a href="https://github.com/Jinwoo1104" align="center">
  <img src="https://img.shields.io/badge/Jinwoo1104-f28b82?style=flat-square"/>
</a>
<a href="https://github.com/wonjun4149" align="center">
  <img src="https://img.shields.io/badge/wonjun4149-fbbc04?style=flat-square"/>
</a>
<a href="https://github.com/byeongchan" align="center">
  <img src="https://img.shields.io/badge/byeongchan-34a853?style=flat-square"/>
</a>
<a href="https://github.com/yooon613" align="center">
  <img src="https://img.shields.io/badge/yooon613-4285f4?style=flat-square"/>
</a>
<a href="https://github.com/mina-dong" align="center">
  <img src="https://img.shields.io/badge/mina--dong-ff8a65?style=flat-square&logoColor=white">
</a>

<a href="https://github.com/7250khm" align="center">
  <img src="https://img.shields.io/badge/7250khm-a142f4?style=flat-square"/>
</a>
<a href="https://github.com/red0pyo" align="center">
  <img src="https://img.shields.io/badge/red0pyo-f44292?style=flat-square"/>
</a>




---

## ✨ 주요 기능

- 🔐 **OpenAI API 키 입력**
- 📝 **책 제목, 장르, 키워드, 내용 입력**
- 🎨 **AI 기반 북커버 이미지 자동 생성**
- 📌 **생성된 이미지 등록 및 목록 관리**
- ⚡ **직관적인 UI & 실시간 반영**

---

## 📸 사용 예시

1. OpenAI API 키를 입력합니다.
2. 책 제목, 장르, 키워드, 내용을 입력합니다.
3. `🎨 AI 북커버 생성` 버튼을 클릭하여 표지 이미지를 생성합니다.
4. `📌 등록` 버튼을 클릭하여 저장합니다.

---

## 🧩 사용 기술 스택
💻 Frontend

<p> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> </p>
🖥 Backend

<p> <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/JPA-007396?style=flat-square&logo=hibernate&logoColor=white"> </p>
🗂 Version Control

<p> <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"> </p>

🎨 이미지 생성 및 HTTP 통신

<p> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/DALL·E-000000?style=flat-square&logo=openai&logoColor=white"> </p>


## 📁 프로젝트 구조

```
🔙 Backend
backend/
└── src/
    └── main/
        ├── java/com/project/book/backend/
        │   ├── BackendApplication.java
        │   ├── config/              # 설정 클래스
        │   ├── controller/          # REST 컨트롤러
        │   ├── dto/                 # 요청/응답 DTO
        │   ├── entity/              # JPA 엔티티
        │   ├── repository/          # JPA 리포지토리
        │   └── service/             # 비즈니스 로직
        └── resources/
            └── application.properties

🌐 Frontend
frontend/
├── public/                        # 정적 리소스
├── src/
│   ├── components/                # 공통 컴포넌트
│   │   ├── BookCoverGenerator.jsx
│   │   └── RegisterBook.js
│   ├── pages/                     # 페이지 컴포넌트
│   │   ├── Book_Edit.jsx
│   │   ├── Book_Page.jsx
│   │   ├── BookRegister.jsx
│   │   └── MainPage.jsx
│   ├── App.js                     # 루트 컴포넌트
│   ├── index.js                   # 진입점
│   ├── 스타일 및 테스트 관련 파일들
├── .env, package.json, README.md 등 설정 파일들
```

---

📮 기타  
OpenAI API 키는 `.env` 파일에 별도로 관리합니다.

책 표지는 DALL·E 기반 이미지로 생성되며, 리스트 형태로 저장 및 관리가 가능합니다.
