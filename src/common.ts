export type OrderItem = {
  item: string;
  quantity: number;
};

export type OrderSummaryPropsType = {
  items: OrderItem[] | [];
};

export type ReturnedSessionType = {
  [key: string]: {
    title: string;
    partecipants: string[];
    orders?: OrderItem[] | [];
  };
};
