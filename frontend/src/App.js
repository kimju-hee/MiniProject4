import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import BookRegister from './pages/BookRegister';
import Book_Page from './pages/Book_Page';
import Book_Edit from './pages/Book_Edit';
import RegisterBook from "./components/RegisterBook";
import "./style.css";
function App() {
    /*useEffect(() => {
      fetch("http://localhost:8080/books")
        .then((res) => res.json())
        .then((data) => console.log(data));
    }, []);*/

  return (
    <div className="App">
      <header className="App-header">
        
          <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 나중에 도서 등록/상세 페이지 경로도 여기에 추가 가능 */}
        <Route path="/register" element={<RegisterBook />} />      
        <Route path="/books/:id" element={<Book_Page />} />
        <Route path="/books/edit/:id" element={<Book_Edit />} />

      </Routes>
    </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
