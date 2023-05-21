export type OrderItem = {
  item: string;
  quantity: number;
};

export type OrderSummaryPropsType = {
  items: OrderItem[] | [];
};
