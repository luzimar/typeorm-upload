import { EntityRepository, Repository, getRepository } from 'typeorm';
import GetValueFromType from '../utils/GetValueFromType';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await getRepository(Transaction).find();

    const totalIncome = GetValueFromType({
      transactions,
      type: 'income',
    });

    const totalOutcome = GetValueFromType({
      transactions,
      type: 'outcome',
    });

    const total = totalIncome - totalOutcome;
    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
