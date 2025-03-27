'use server'

import { storePost, updatePostLikeStatus } from '@/lib/posts'
import { redirect } from 'next/navigation'
import { uploadImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'

export async function createPost(previousState: any, formData: FormData) {
  const title = formData.get('title') as string
  const image = formData.get('image') as File
  const content = formData.get('content') as string

  let errors = []

  if (!title || title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required')
  }

  if (!image || image.size === 0) {
    errors.push('Image is required')
  }

  if (errors.length > 0) {
    return { errors }
  }

  let imageUrl: string

  try {
    imageUrl = await uploadImage(image)
  } catch (e) {
    console.error(e)
    throw new Error('Image upload failed, post was not created. Please try again later.')
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  })

  revalidatePath('/feed')
  redirect('/feed')
}

export async function togglePostLikeStatus(postId: number) {
  await updatePostLikeStatus(postId, 2)

  revalidatePath('/feed')
}
