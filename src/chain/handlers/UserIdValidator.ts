import {AbstractHandler} from '../AbstractHandler';
import {AccessLogRecord} from '../../models/DataRecord';

export class UserIdValidator extends AbstractHandler {
  protected process(record: AccessLogRecord): AccessLogRecord {
    if (!record.userId) {
      throw new Error('Invalid userId');
    }
    if (record.userId.trim() === '') {
      throw new Error('Invalid userId');
    }
    return record;
  }
}
