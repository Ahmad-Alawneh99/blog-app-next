export interface User {
  name: string;
  _id: string;
  email?: string;
  password?: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  owner: Pick<User, '_id' | 'name'>;
  createdAt: string;
  updatedAt: string;
}
