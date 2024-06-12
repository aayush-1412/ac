export interface BlogType {
    title: string;
    body: string;
    createdAt: Date;
    _id?: string;
    user: {
      fullname: string;
      email: string;
      _id:string,
    };
  }
  export interface CreateBlogType {
    title: string;
    body: string;
  }
  