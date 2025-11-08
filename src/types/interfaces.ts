export interface PostCardProps {
  id: number;
  title: string;
  description?: string;
  code: string;
  language?: string;
  authorName: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  editable?: boolean;
  fetchCollectionData?: () => void;

  mode?: "add" | "remove"; // какой режим
  collectionId?: number;   // id коллекции (нужно для удаления)
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
  role: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  created_at: string;
  updated_at: string | null;
  parent_id: number | null;
  username: string;
  avatar_url?: string | null;
  replies: Comment[];
}

export interface CommentThreadProps {
  comment: Comment;
  level?: number;
  post_id?: number;
  focusedCommentId: number | null;
  setFocusedCommentId: React.Dispatch<React.SetStateAction<number | null>>;
  refreshComments: () => Promise<void>;
}

export interface Collection {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface AddToCollectionDropdownProps {
  postId: number;
  collections: Collection[];
  onAdded?: (collectionId: number) => void;
  onClose: () => void;
}