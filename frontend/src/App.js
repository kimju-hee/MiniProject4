import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import BookRegister from './pages/BookRegister';
import Book_Page from './pages/Book_Page';
import Book_Edit from './pages/Book_Edit';
import React, { useEffect } from 'react';

import RegisterBook from "./components/RegisterBook";
import "./style.css";
function App() {
    /*useEffect(() => {
      fetch("http://localhost:8080/books")
        .then((res) => res.json())
        .then((data) => console.log(data));
    }, []);*/

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<BookRegister />} />      
            <Route path="/books/:id" element={<Book_Page />} />
            <Route path="/books/edit/:id" element={<Book_Edit />} />

          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
