const XLSX = require('xlsx');
const path = require('path');

async function debugHeaders() {
    const filePath = path.join(__dirname, '..', '..', '..', 'PABEDILAN_SP2D APRIL-JUNI 2025.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['TERSANA'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read as array of arrays
    console.log('Row 1 (Headers):', data[0]);
    console.log('Row 2 (First Data):', data[1]);
}

debugHeaders();
