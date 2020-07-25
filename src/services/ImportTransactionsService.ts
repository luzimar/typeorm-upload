import fs from 'fs';
import path from 'path';
import csvToJson from 'csvtojson';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/Upload';
import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, filename);

    if (!(await fs.promises.stat(filePath))) {
      throw new AppError('File not found');
    }

    const parsedTransactions = await csvToJson({ checkType: true }).fromFile(
      filePath,
    );

    const createTransactionService = new CreateTransactionService();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < parsedTransactions.length; i++) {
      const { title, type, value, category } = parsedTransactions[i];
      // eslint-disable-next-line no-await-in-loop
      await createTransactionService.execute({ title, type, value, category });
    }

    await fs.promises.unlink(filePath);
    return parsedTransactions;
  }
}

export default ImportTransactionsService;
