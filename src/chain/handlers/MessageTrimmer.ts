import {AbstractHandler} from '../AbstractHandler';
import {SystemErrorRecord} from '../../models/DataRecord';

export class MessageTrimmer extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    if (!record.message) {
      throw new Error("Missing required field 'message'");
    }

    let trimmedMessage = record.message.trim();
    if (trimmedMessage === '') {
      throw new Error('Empty message');
    }

    if (trimmedMessage.length > 255) {
      trimmedMessage = trimmedMessage.substring(0, 255);
    }

    record.message = trimmedMessage;
    return record;
  }
}
