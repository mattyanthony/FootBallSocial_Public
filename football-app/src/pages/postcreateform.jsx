import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client'; 
import './postcreateform.css'; 


const PostCreateForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any existing errors

    // Insert the new post into the Supabase table
    const { error: insertError } = await supabase
      .from('post') // Ensure this is your table name
      .insert([{ title, content, image_url: imageUrl }]);

    if (insertError) {
        console.error('Full error object:', insertError);
        setError(`Error submitting post: ${JSON.stringify(insertError, null, 2)}`);
    } else {
      // Redirect or handle the successful submission
      navigate('/'); // Assuming you want to redirect to the homepage
    }
  };

  return (
    <div className="post-create-form"> {/* Make sure this matches your CSS */}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
  
        <label htmlFor="content">Content (Optional)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
  
        <label htmlFor="image-url">Image or Video URL (Optional)</label>
        <input
          id="image-url"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
  
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
  
};

export default PostCreateForm;
