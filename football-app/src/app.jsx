import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeFeed from './pages/homefeed';
import PostCreateForm from './pages/postcreateform';
import Header from './components/header';
import PostDetail from './pages/postdetail';
import PostEditForm from './pages/posteditform';

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create-post" element={<PostCreateForm />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/edit-post/:postId" element={<PostEditForm />} />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}

export default App;
