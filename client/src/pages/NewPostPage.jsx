import { useNavigate } from 'react-router-dom';
import { postsApi } from '../api/posts.api.js';
import { PostForm } from '../components/PostForm.jsx';

export function NewPostPage() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    const post = await postsApi.create(data);
    navigate(`/posts/${post.slug}`);
  }

  return (
    <div>
      <h1>New post</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Publish" />
    </div>
  );
}