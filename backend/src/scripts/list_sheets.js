const XLSX = require('xlsx');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', '..', 'PABEDILAN_SP2D APRIL-JUNI 2025.xlsx');
try {
    const workbook = XLSX.readFile(filePath);
    console.log('SHEET_NAMES_START');
    console.log(JSON.stringify(workbook.SheetNames));
    console.log('SHEET_NAMES_END');
} catch (e) {
    console.error(e);
}
