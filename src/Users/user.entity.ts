export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
