export type Order = {
  date: string;
  orderNumber: string;
  products: { name: string; image: string; option: string; count: number }[];
  amount: string;
  status: string;
  statusType: "success" | "processing" | "canceled" | "done";
};
