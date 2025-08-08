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

export type Order = {
  date: string;
  orderNumber: string;
  products: { name: string; image: string; details: string }[];
  amount: string;
  status: string;
  statusType: "success" | "processing" | "canceled" | "done";
};

export type Review = {
  id: string;
  product: { name: string; image: string; date: string };
  rating: number;
  content: string;
  images?: string[];
};

export type Coupon = {
  discount: string;
  title: string;
  type: "percent" | "amount";
  value: number;
  daysLeft: number;
  categories: string[];
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
};
