import {AbstractHandler} from '../AbstractHandler';
import {TransactionRecord} from '../../models/DataRecord';

export class CurrencyNormalizer extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    if (!record.currency) {
      throw new Error('Invalid currency');
    }
    if (record.currency.trim() === '') {
      throw new Error('Invalid currency');
    }
    record.currency = record.currency.toUpperCase();
    return record;
  }
}
