# 📘 Book Cover Generator

AI를 활용해 책 제목, 장르, 키워드, 내용을 입력하면 **AI 기반 이미지 생성 API**로 **북커버(책 표지)**를 자동 생성해주는 웹 애플리케이션입니다.  
생성된 이미지는 저장하여 한 눈에 확인할 수 있으며, 사용자는 OpenAI의 이미지 생성 기능(DALL·E)을 활용하여 창작물을 시각적으로 표현할 수 있습니다.


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

| 분야      | 기술            |
| ------- | ------------- |
| 프론트엔드   | React.js      |
| 이미지 생성  | OpenAI DALL·E |
| HTTP 통신 | Axios         |


---

## 📁 프로젝트 구조

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


📮 기타
OpenAI API 키는 .env 파일에 별도로 관리합니다.

책 표지는 DALL·E 기반 이미지로 생성되며, 리스트 형태로 저장 및 관리가 가능합니다.