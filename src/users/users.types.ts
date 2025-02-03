export interface TUser extends Document {
  _id?: string;
  email: string;
  name: string;
  password: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeactivated: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
