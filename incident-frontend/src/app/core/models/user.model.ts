export interface UserRole {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    createdAt: string;
    role: UserRole;
  }