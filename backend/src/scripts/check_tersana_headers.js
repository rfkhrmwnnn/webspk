const XLSX = require('xlsx');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', '..', 'PABEDILAN_SP2D APRIL-JUNI 2025.xlsx');
try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['TERSANA'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log('ROWS_START');
    console.log(JSON.stringify(data.slice(0, 5)));
    console.log('ROWS_END');
} catch (e) {
    console.error(e);
}
