'use client'
import { useOptimistic } from 'react'

import { formatDate } from '@/lib/format'
import LikeButton from './like-icon'

import { PostResult } from '@/types'
import { togglePostLikeStatus } from '@/actions/post'


function Post({ post, updatePost }: { post: PostResult, updatePost: (postId: number) => void }) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title}/>
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form action={updatePost.bind(null, post.id)} className={post.isLiked ? 'liked' : ''}>
              <LikeButton/>
              {post.likes}
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  )
}

export default function Posts({ posts }: { posts: PostResult[] }) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts, updatedPostId) => {

    const index = prevPosts.findIndex((post) => post.id === updatedPostId)

    if (index === -1) {
      return prevPosts
    }

    const updatedPost = { ...prevPosts[index] }
    updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1)
    updatedPost.isLiked = !updatedPost.isLiked

    const updatedPosts = [...prevPosts]
    updatedPosts[index] = updatedPost

    return updatedPosts
  })

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>
  }

  async function updatePost(postId: number) {
    updateOptimisticPosts(postId)
    await togglePostLikeStatus(postId)
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} updatePost={updatePost}/>
        </li>
      ))}
    </ul>
  )
}
