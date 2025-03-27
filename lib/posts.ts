import sql from 'better-sqlite3'
import Database from 'better-sqlite3'
import { Post, PostResult } from '@/types'

const db = new sql('posts.db')

function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT, 
      last_name TEXT,
      email TEXT
    )`)

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY, 
      image_url TEXT NOT NULL,
      title TEXT NOT NULL, 
      content TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER, 
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`)

  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER, 
      post_id INTEGER, 
      PRIMARY KEY(user_id, post_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`)

  const stmt = db.prepare('SELECT COUNT(*) AS count FROM users')
  if ((stmt.get() as { count: number }).count === 0) {
    db.exec(`INSERT INTO users (first_name, last_name, email) VALUES ('John', 'Doe', 'john@example.com')`)
    db.exec(`INSERT INTO users (first_name, last_name, email) VALUES ('Art', 'Ole', 'art@example.com')`)
  }
}

initDb()

export async function getPosts(maxNumber?: number): Promise<PostResult[]> {
  const limitClause = maxNumber ? 'LIMIT ?' : ''

  const stmt = db.prepare(`
    SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, 
           first_name AS userFirstName, last_name AS userLastName, 
           COUNT(likes.post_id) AS likes, 
           EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = 2) AS isLiked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY createdAt DESC
    ${limitClause}`)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return maxNumber ? (stmt.all(maxNumber) as PostResult[]) : (stmt.all() as PostResult[])
}

export async function storePost(post: Post): Promise<Database.RunResult> {
  const stmt = db.prepare(`
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (?, ?, ?, ?)
  `)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return stmt.run(post.imageUrl, post.title, post.content, post.userId)
}

export async function updatePostLikeStatus(postId: number, userId: number): Promise<Database.RunResult> {
  const stmt = db.prepare(`SELECT COUNT(*) AS count FROM likes WHERE user_id = ? AND post_id = ?`)
  const isLiked = (stmt.get(userId, postId) as { count: number }).count === 0

  if (isLiked) {
    const insertStmt = db.prepare(`INSERT INTO likes (user_id, post_id) VALUES (?, ?)`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return insertStmt.run(userId, postId)
  } else {
    const deleteStmt = db.prepare(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return deleteStmt.run(userId, postId)
  }
}
