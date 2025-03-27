'use client'
import { useActionState } from 'react'

import { createPost } from '@/actions/post'

export default function NewPostPage() {

  const [state, action, isPending] = useActionState(
    createPost,
    {} as { errors?: string[] },
  )

  return (
    <>
      <h1>Create a new post</h1>
      <form action={action}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title"/>
        </p>
        <p className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={5}/>
        </p>
        <p className="form-actions">
          {isPending ? 'Saving...' : <>
            <button type="reset">Reset</button>
            <button>Create Post</button>
          </>}
        </p>
        {state.errors?.length && (
          <ul className="form-errors">
            {state.errors.map(err => <li key={err}>{err}</li>)}
          </ul>
        )}
      </form>
    </>
  )
}
