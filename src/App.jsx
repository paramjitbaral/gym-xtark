import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import JoinPage from './pages/JoinPage';

function App() {
  const location = useLocation();
  const isJoinPage = location.pathname === '/join';

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<JoinPage />} />
        </Routes>
      </main>
      {!isJoinPage && <Footer />}
    </div>
  );
}

export default App;
