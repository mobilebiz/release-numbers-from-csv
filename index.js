const fs = require('fs');
const { parse }  = require('csv-parse/sync');
require('dotenv').config();

// 実行時のパラメータを取得する
const args = process.argv.slice(2);
const DELETE = args[0] === 'delete';

// TwilioのアカウントSIDとトークンを環境変数から取得する
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// ログを色付きで表示する
const log = (message, color = '') => {
  if (color === 'red') {
    console.info('\x1b[31m%s\x1b[0m', message);
  } else if (color === 'green') {
    console.info('\x1b[32m%s\x1b[0m', message);
  } else if (color === 'yellow') {
    console.info('\x1b[33m%s\x1b[0m', message);
  } else if (color === 'blue') {
    console.info('\x1b[34m%s\x1b[0m', message);
  } else if (color === 'magenta') {
    console.info('\x1b[35m%s\x1b[0m', message);
  } else if (color === 'cyan') {
    console.info('\x1b[36m%s\x1b[0m', message);
  } else {
    console.info(message);
  }
}


// CSVファイルを読み込む
function readCSVFile(filePath, callback) {
  const jsonArray = [];
  
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(filePath);
      const records = parse(data);
      for (const record of records) {
        jsonArray.push(record);
      }
    } catch (error) {
      reject(error);
    }
    resolve(jsonArray);
  });
}

// 実行
(async () => {
  if (!DELETE) {
    log('実際の削除はされません。削除する場合は、プログラム起動時に delete を追加してください。例： node index.js delete', 'red');
  }
  // CSVファイルを読み込む
  const jsonArray = await readCSVFile('./numbers.csv');
  // 電話番号ごとに処理を実行する
  for (let number of jsonArray) {
    // 電話番号形式をE.164に変換する
    const phoneNumber = number[0].replace(/-/g, '');
    const e164PhoneNumber = phoneNumber.indexOf('+') === 0 ? phoneNumber : `+81${phoneNumber.replace(/^0/, '')}`;
    log(e164PhoneNumber, 'blue');
    try {
      // 電話番号を削除する
      let count = 0;
      (await client.incomingPhoneNumbers.list({ phoneNumber: e164PhoneNumber, limit: 1 })).forEach(async pn => {
        count++;
        // log(pn.sid, 'magenta')
        if (DELETE) {
          await client.incomingPhoneNumbers(pn.sid).remove();
          log(`delete: ${e164PhoneNumber}`, 'yellow');
        }
      });
      if (count === 0) {
        log(`not found: ${e164PhoneNumber}`, 'red');
      }
      // if (pn.length > 0) {
      //   if (DELETE) {
      //     await client.incomingPhoneNumbers(e164PhoneNumber).remove();
      //     log(`delete: ${e164PhoneNumber}`, 'yellow');
      //   }
      // } else {
      //   log(`not found: ${e164PhoneNumber}`, 'red');
      // }
    } catch (error) {
      log(`${error}`, 'red')
      // 処理は継続させる
      continue;
    }
  }
})();