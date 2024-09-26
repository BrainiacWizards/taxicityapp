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
