import * as fs from 'fs/promises';
import {buildAccessLogChain} from './chain/chains/AccessLogChain';
import {buildTransactionChain} from './chain/chains/TransactionChain';
import {buildSystemErrorChain} from './chain/chains/SystemErrorChain';
import {ProcessingMediator} from './mediator/ProcessingMediator';
import {AccessLogWriter} from './mediator/writers/AccessLogWriter';
import {TransactionWriter} from './mediator/writers/TransactionWriter';
import {ErrorLogWriter} from './mediator/writers/ErrorLogWriter';
import {RejectedWriter} from './mediator/writers/RejectedWriter';
import {DataRecord} from './models/DataRecord';

const handlerMap = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

async function main() {
  try {
    await fs.mkdir('src/output', {recursive: true});

    const data = await fs.readFile('src/data/records.json', 'utf8');
    const records: DataRecord[] = JSON.parse(data);

    const accessLogWriter = new AccessLogWriter();
    const transactionWriter = new TransactionWriter();
    const errorLogWriter = new ErrorLogWriter();
    const rejectedWriter = new RejectedWriter();

    const mediator = new ProcessingMediator(
      accessLogWriter,
      transactionWriter,
      errorLogWriter,
      rejectedWriter
    );

    let totalRecords = 0;
    let successfulRecords = 0;
    let rejectedRecords = 0;

    for (const record of records) {
      totalRecords++;

      try {
        const handler = handlerMap[record.type];
        if (!handler) {
          throw new Error(`Unknown record type: ${record.type}`);
        }

        const chain = handler();
        const processedRecord = chain.handle(record);
        mediator.onSuccess(processedRecord);
        successfulRecords++;
      } catch (error: any) {
        mediator.onRejected(record, error.message);
        rejectedRecords++;
      }
    }

    await mediator.finalize();

    console.log(`[INFO] Завантажено записів: ${totalRecords}`);
    console.log(`[INFO] Успішно оброблено: ${successfulRecords}`);
    console.log(`[WARN] Відхилено з помилками: ${rejectedRecords}`);
    console.log(`[INFO] Звіт збережено у директорії output/`);
  } catch (error: any) {
    console.error('[ERROR] Не вдалося обробити записи:', error.message);
  }
}

main();
