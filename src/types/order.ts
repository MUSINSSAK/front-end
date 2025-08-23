export type Order = {
  date: string;
  orderNumber: string;
  products: { name: string; image: string; option: string; count: number }[];
  amount: string;
  status: string;
  statusType: "success" | "processing" | "canceled" | "done";
};

export type OrderItemData = {
  id: number;
  brand: string;
  name: string;
  option: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  selected: boolean;
  stock: number;
};
