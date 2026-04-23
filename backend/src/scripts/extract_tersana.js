const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

async function extractTersana() {
    try {
        const filePath = path.join(__dirname, '..', '..', '..', 'PABEDILAN_SP2D APRIL-JUNI 2025.xlsx');
        const workbook = XLSX.readFile(filePath);

        const sheetName = 'TERSANA';
        if (!workbook.SheetNames.includes(sheetName)) {
            console.error(`Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
            return;
        }

        const sheet = workbook.Sheets[sheetName];
        // Use default range (starts at row 1) to use row 1 as headers
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`Total rows read from TERSANA: ${data.length}`);

        // Clean and map data
        const cleanedData = data.map(row => {
            const nominalRaw = row['NOMINAL'];
            let nominal = 0;
            if (typeof nominalRaw === 'string') {
                nominal = parseInt(nominalRaw.replace(/[^0-9]/g, '')) || 0;
            } else if (typeof nominalRaw === 'number') {
                nominal = nominalRaw;
            }

            return {
                no: row['NO'],
                pengurus: row['PENGURUS'],
                no_kk: row['NO KK'],
                ak: row['AK'],
                komponen: row['KOMPONEN'],
                aud: row['AUD'] || 0,
                sd: row['SD'] || 0,
                smp: row['SMP'] || 0,
                sma: row['SMA'] || 0,
                disabilitas: row['DISABILITAS'] || 0,
                lansia: row['LANSIA'] || 0,
                hamil: row['HAMIL'] || 0,
                ham: row['HAM'] || 0,
                nominal: nominal
            };
        }).filter(item => item.pengurus); // Filter out empty rows

        const outputPathBackend = path.join(__dirname, '..', '..', 'tersana_data.json');
        const outputPathFrontend = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'data', 'tersana_data.json');
        
        // Ensure frontend data directory exists
        const frontendDataDir = path.dirname(outputPathFrontend);
        if (!fs.existsSync(frontendDataDir)) {
            fs.mkdirSync(frontendDataDir, { recursive: true });
        }

        fs.writeFileSync(outputPathBackend, JSON.stringify(cleanedData, null, 2));
        fs.writeFileSync(outputPathFrontend, JSON.stringify(cleanedData, null, 2));

        console.log(`Successfully extracted ${cleanedData.length} records to:`);
        console.log(`- Backend: ${outputPathBackend}`);
        console.log(`- Frontend: ${outputPathFrontend}`);

        // Summary for user
        const totalNominal = cleanedData.reduce((sum, item) => sum + (item.nominal || 0), 0);
        console.log('--- SUMMARY ---');
        console.log(`Total Penerima: ${cleanedData.length}`);
        console.log(`Total Nominal: Rp ${totalNominal.toLocaleString('id-ID')}`);

    } catch (error) {
        console.error('Error during extraction:', error);
    }
}

extractTersana();