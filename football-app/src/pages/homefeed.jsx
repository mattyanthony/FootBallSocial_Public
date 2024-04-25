import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homefeed.css'; // Ensure you have the correct path to your CSS file
import { supabase } from '../client';
import moment from 'moment'; // You'll need to install moment for date formatting

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('post')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filteredData = [...posts];

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredData = filteredData.filter((post) =>
        post.title.toLowerCase().includes(lowercasedFilter)
      );
    }

    if (sortType === 'upvotes') {
      filteredData.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortType === 'newest') {
      filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredPosts(filteredData);
  }, [searchTerm, sortType, posts]);

  return (
    <div className="home-feed">
      <div className="search-and-sort">
        <input
          type="search"
          className="search-input"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSortType('newest')}>Newest</button>
        <button onClick={() => setSortType('upvotes')}>Most Upvotes</button>
      </div>
      {loading && <div>Loading posts...</div>}
      {error && <div>Error fetching posts: {error.message}</div>}
      {!loading && !error && (
        filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-card-link">
              <div className="post-card">
                <div className="post-header">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span>Posted {moment(post.created_at).fromNow()}</span>
                    <span>{post.upvotes} upvotes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>No posts found.</div>
        )
      )}
    </div>
  );
};

export default HomeFeed;
