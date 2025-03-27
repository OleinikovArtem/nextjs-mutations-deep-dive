export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Post {
  id?: number;
  imageUrl: string;
  title: string;
  content: string;
  userId: number;
}

export interface PostResult {
  id: number;
  image: string;
  title: string;
  content: string;
  createdAt: string;
  userFirstName: string;
  userLastName: string;
  likes: number;
  isLiked: boolean;
}
