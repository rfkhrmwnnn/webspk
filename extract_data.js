const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

async function parseExcel() {
    const tempDir = path.join(__dirname, 'temp_excel');
    const sharedStringsFile = path.join(tempDir, 'xl', 'sharedStrings.xml');
    const sheetFile = path.join(tempDir, 'xl', 'worksheets', 'sheet1.xml');

    const parser = new xml2js.Parser();

    // Parse shared strings
    const sharedStringsXml = fs.readFileSync(sharedStringsFile, 'utf8');
    const sharedStringsData = await parser.parseStringPromise(sharedStringsXml);
    const sharedStrings = sharedStringsData.sst.si.map(si => {
        if (si.t) return si.t[0];
        if (si.r) return si.r.map(r => r.t[0]).join('');
        return '';
    });

    // Parse sheet
    const sheetXml = fs.readFileSync(sheetFile, 'utf8');
    const sheetData = await parser.parseStringPromise(sheetXml);
    const rows = sheetData.worksheet.sheetData[0].row;

    const results = [];
    // Skip header row (index 2 in XML is row 3, but row 2 is also headers sometimes)
    // Looking at the view_file output, row r="2" is header indices or similar.
    // Row r="3" starts the data.
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        const entry = {};
        
        cells.forEach(cell => {
            const r = cell.$.r;
            const col = r.replace(/[0-9]/g, '');
            let val = cell.v ? cell.v[0] : '';
            
            if (cell.$.t === 's') {
                val = sharedStrings[parseInt(val)];
            }
            
            entry[col] = val;
        });

        if (entry.B && entry.N) {
            results.push({
                no: entry.A,
                nama: entry.B,
                id: entry.C,
                total_komponen: parseInt(entry.D) || 0,
                aud: parseInt(entry.E) || 0,
                sd: parseInt(entry.F) || 0,
                smp: parseInt(entry.G) || 0,
                sma: parseInt(entry.H) || 0,
                lansia: parseInt(entry.I) || 0,
                disabilitas: parseInt(entry.J) || 0,
                hamil: parseInt(entry.K) || 0,
                nominal: entry.N ? parseInt(entry.N.replace(/[^0-9]/g, '')) : 0
            });
        }
    }

    fs.writeFileSync(path.join(__dirname, 'excel_data.json'), JSON.stringify(results, null, 2));
    console.log(`Successfully extracted ${results.length} records.`);
}

parseExcel().catch(console.error);
