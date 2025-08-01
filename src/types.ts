export type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
};

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
};
