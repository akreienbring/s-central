/*
  Author: André Kreienbring
  Represents a BlogPost
*/
export type Blogpost = {
  id: number;
  blogpostid?: number;
  title: string;
  content: string;
  createdAt: number;
  public: number;
  alias: string;
  userid: number;
  cover?: string;
  author?: {
    name: string;
    avatarUrl: string;
  };
};
