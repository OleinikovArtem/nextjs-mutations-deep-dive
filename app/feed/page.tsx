import { Metadata } from 'next'

import Posts from '@/components/posts'
import { getPosts } from '@/lib/posts'


export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts()
  const numberOfPosts = posts.length

  return {
    title: `NextPosts | Browse all our ${numberOfPosts} posts.`,
    description: 'Create a new post.',
  }
}

export default async function FeedPage() {
  const posts = await getPosts()
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts}/>
    </>
  )
}
