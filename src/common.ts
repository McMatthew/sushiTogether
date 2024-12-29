export type OrderItem = {
  item: string;
  quantity: number;
};

export interface Session {
  limit: number;
  title: string;
  partecipants: string[];
  orders?: {
    [key: string]: OrderItem[];
  };
}

export type ReturnedSessionType = {
  [key: string]: Session;
};
