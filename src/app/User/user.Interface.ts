import { Model } from 'mongoose';
export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
  Profileimage:string;
  role: 'ADMIN' | 'USER';
  is_blocked?: boolean;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
}

export interface UserModel extends Model<UserInterface> {
  isUserExists(email: string): Promise<UserInterface | null>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}