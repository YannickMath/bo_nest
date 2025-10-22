export interface UserInterface {
  id: number;
  username: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Users {
  users: UserInterface[];
}
