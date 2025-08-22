import {SystemErrorRecord} from '../../models/DataRecord';
import * as fs from 'fs/promises';

export class ErrorLogWriter {
  private lines: string[] = [];

  write(record: SystemErrorRecord) {
    this.lines.push(
      JSON.stringify({
        timestamp: record.timestamp,
        level: record.level,
        message: record.message,
      })
    );
  }

  async finalize() {
    await fs.writeFile('src/output/errors.jsonl', this.lines.join('\n'));
  }
}
