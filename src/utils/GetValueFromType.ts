import Transaction from '../models/Transaction';

interface TransactionDto {
  type: string;
  transactions: Transaction[];
}

function GetValueFromType({ transactions, type }: TransactionDto): number {
  return transactions
    .filter(transaction => transaction.type === type)
    .map(transaction => transaction.value)
    .reduce((v1, v2) => v1 + v2, 0);
}

export default GetValueFromType;
