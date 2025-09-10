export interface Group {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  joinCode: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: User;
  members: Member[];
  materials: Material[];
  sessions: Session[];
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Member {
  id: string;
  role: string;
  joinedAt: string;
  userId: string;
  groupId: string;
  user: User;
}

export interface Material {
  id: string;
  title: string;
  type: "ARTICLE" | "VIDEO" | "LINK";
  url: string;
  description: string | null;
  createdAt: string;
  groupId: string;
  userId: string;
  user: MaterialCreator;
}

export interface MaterialCreator {
  name: string;
  username: string;
  id: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  description: string | null;
  link: string | null;
  createdAt: string;
  groupId: string;
  creatorId: string;
  creator: MaterialCreator;
}

export interface PaginatedGroups {
  data: Group[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type GroupOrderBy =
  | { name: "asc" }
  | { name: "desc" }
  | { createdAt: "asc" }
  | { createdAt: "desc" };

export interface UpdateGroupDTO {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}
