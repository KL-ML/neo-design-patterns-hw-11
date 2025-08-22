import {AbstractHandler} from '../AbstractHandler';
import {TransactionRecord} from '../../models/DataRecord';

export class AmountParser extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    let amount: number;
    if (typeof record.amount === 'string') {
      amount = parseFloat(record.amount);
    } else {
      amount = record.amount;
    }

    if (isNaN(amount)) {
      throw new Error('Invalid amount');
    }

    record.amount = amount;
    return record;
  }
}
