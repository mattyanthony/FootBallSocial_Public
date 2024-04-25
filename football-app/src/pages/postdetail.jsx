import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './postdetail.css'; 
const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostDetails = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('post')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      setPost(postData);
      
      // Assuming you have a relationship set up in Supabase
      const { data: commentsData, error: commentsError } = await supabase
        .from('comment')
        .select('*')
        .eq('post_id', postId);

      if (commentsError) throw commentsError;

      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleUpvote = async () => {
    // Optimistically update UI
    setPost((prevPost) => ({ ...prevPost, upvotes: prevPost.upvotes + 1 }));
  
    try {
      const { error } = await supabase
        .from('post')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', postId)
        .single();
  
      if (error) throw error;
    } catch (error) {
      console.error('Error upvoting post:', error);
      // Rollback if there was an error
      setPost((prevPost) => ({ ...prevPost, upvotes: prevPost.upvotes - 1 }));
    }
  };
  
  const handleCommentSubmit = async () => {
    // Optimistically update UI
    const newCommentObj = { post_id: postId, content: newComment };
    setComments((prevComments) => [...prevComments, newCommentObj]);
    setNewComment('');
  
    try {
      const { error } = await supabase
        .from('comment')
        .insert([newCommentObj])
        .single();
  
      if (error) throw error;
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Rollback if there was an error
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.content !== newComment)
      );
    }
  };
  

  const handleEdit = () => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async () => {
    const confirmation = window.confirm('Are you sure you want to delete this post?');
    if (confirmation) {
      try {
        setLoading(true); // Set loading to true to prevent multiple clicks
  
        // First, delete all comments associated with the post
        const { error: commentsError } = await supabase
          .from('comment')
          .delete()
          .eq('post_id', postId);
  
        if (commentsError) {
          console.error('Error deleting comments:', commentsError);
          throw commentsError;
        }
  
        // Then, delete the post
        const { error: postError } = await supabase
          .from('post')
          .delete()
          .eq('id', postId);
  
        if (postError) {
          console.error('Error deleting post:', postError);
          throw postError;
        }
  
        navigate('/');
      } catch (error) {
        console.error('Error during delete operation:', error);
        setError('Failed to delete post. Please try again.');
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };
  

  const isVideo = (url) => {
    const videoPattern = /\.(mp4|webm|ogg)$/i;
    return videoPattern.test(url);
  };

  if (loading) return <div>Loading post details...</div>;
  if (error) return <div>Error fetching post details: {error.message}</div>;

  return (
    <div className="post-detail">
      <div className="post-header">
        <h2>{post.title}</h2>
        <button onClick={handleUpvote}>{post.upvotes} Upvotes</button>
        <time>{/* Time since post logic here */}</time>
        <div className="actions">
          <button onClick={handleEdit}>Edit Post</button>
          <button onClick={handleDelete}>Delete Post</button>
        </div>
      </div>
      {post.image_url && (
        isVideo(post.image_url) ? (
          <video controls>
            <source src={post.image_url} type={`video/${post.image_url.split('.').pop()}`} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={post.image_url} alt={post.title} />
        )
      )}
      <p>{post.content}</p>
      <div className="comments-section">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
          </div>
        ))}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a Comment" // This is the placeholder attribute
        />
        <button onClick={handleCommentSubmit}>Add Comment</button>
      </div>
    </div>
  );
};

export default PostDetail;
