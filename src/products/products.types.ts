export type TProduct = {
  _id?: string;
  name: string;
  brand: string;
  price: number;
  productModel: string;
  stock: number;
  isDeleted: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
