const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// ファイルを読み込む
fs.readFile('numberExist(削除分).txt', 'utf8', function(err, data) {
    if (err) throw err;

    // 電話番号を抽出
    const phoneNumbers = data.match(/\+\d+/g);

    // CSVファイルに出力
    const csvWriter = createCsvWriter({
        path: 'phone_numbers.csv',
        header: [
            {id: 'phoneNumber', title: 'Phone Number'}
        ]
    });

    const records = phoneNumbers.map((number) => ({phoneNumber: number}));

    csvWriter.writeRecords(records)
        .then(() => console.log('The CSV file was written successfully'));
});