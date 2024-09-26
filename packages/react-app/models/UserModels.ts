export interface iTransaction {
  hash: string;
  from: string;
  to: string;
  date: string;
  amount: number;
}

export interface iTransactionListProps {
  transactions: iTransaction[];
}

export interface iTripCardProps {
  from: string;
  to: string;
  driver: string;
  reg: string;
  price: string;
  date: string;
}

export interface iTrip {
  from: string;
  to: string;
  driver: string;
  reg: string;
  price: string;
  date: string;
}
