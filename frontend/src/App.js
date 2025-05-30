import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import BookRegister from './pages/BookRegister';
import Book_Page from './pages/Book_Page';
import Book_Edit from './pages/Book_Edit';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React

          <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 나중에 도서 등록/상세 페이지 경로도 여기에 추가 가능 */}
        <Route path="/books/register" element={<BookRegister />} />      
        <Route path="/books/:id" element={<Book_Page />} />
        <Route path="/books/edit/:id" element={<Book_Edit />} />

      </Routes>
    </BrowserRouter>
        </a>
      </header>
    </div>
  );
}

export default App;
