/*
  Author: André Kreienbring
  Represents a BlogPost
*/
export interface Blogpost {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  public: number;
  userid: number;
  cover: string;
  author: {
    alias: string;
    avatarUrl: string;
  };
}
