import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './posteditform.css';


const PostEditForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('post')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        setError('Failed to fetch post');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('post')
        .update({ ...post })
        .eq('id', postId);

      if (error) throw error;

      navigate(`/post/${postId}`);
    } catch (error) {
      setError('Failed to update post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="post-edit-form">
      <h2>Edit Post</h2>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={post.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image_url">Image URL</label>
        <input
          id="image_url"
          name="image_url"
          type="text"
          value={post.image_url}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        Update Post
      </button>
    </form>
  );
};

export default PostEditForm;
