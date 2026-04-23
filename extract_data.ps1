$tempDir = Join-Path "C:\Users\haras\.gemini\antigravity\brain\34d47c49-15a9-44a5-bb0d-1764720ad19e\web-spk" "temp_excel"
$sharedStringsFile = Join-Path $tempDir "xl/sharedStrings.xml"
$sheetFile = Join-Path $tempDir "xl/worksheets/sheet1.xml"

Write-Host "Checking paths..."
if (-not (Test-Path $sharedStringsFile)) { Write-Error "Shared strings file not found"; exit }
if (-not (Test-Path $sheetFile)) { Write-Error "Sheet file not found"; exit }

[xml]$ssXml = Get-Content $sharedStringsFile
$ns = New-Object System.Xml.XmlNamespaceManager($ssXml.NameTable)
$ns.AddNamespace("ns", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")

$sharedStrings = $ssXml.SelectNodes("//ns:si", $ns) | ForEach-Object { 
    $t = $_.SelectNodes(".//ns:t", $ns)
    if ($t) { ($t | ForEach-Object { $_.InnerText }) -join "" } else { "" }
}

Write-Host "Loaded $($sharedStrings.Count) shared strings."

[xml]$sheetXml = Get-Content $sheetFile
$rows = $sheetXml.SelectNodes("//ns:row", $ns)
Write-Host "Found $($rows.Count) rows."

$results = New-Object System.Collections.Generic.List[PSObject]

foreach ($row in $rows) {
    $entry = @{}
    $cells = $row.SelectNodes("ns:c", $ns)
    
    foreach ($cell in $cells) {
        $r = $cell.getAttribute("r")
        $col = $r -replace '[0-9]', ''
        $vNode = $cell.SelectSingleNode("ns:v", $ns)
        $val = if ($vNode) { $vNode.InnerText } else { "" }
        
        $tAttr = $cell.getAttribute("t")
        if ($tAttr -eq 's' -and $val -ne "") {
            $idx = [int]$val
            if ($idx -lt $sharedStrings.Count) {
                $val = $sharedStrings[$idx]
            }
        }
        
        $entry[$col] = $val
    }

    # Filter for data rows (skip headers if they don't have Name/Nominal)
    if ($entry.B -ne "" -and $entry.N -ne "" -and $entry.B -ne "PENGURUS" -and $entry.B -ne "AK") {
        $nominalRaw = $entry.N -replace '[^0-9]', ''
        if ($nominalRaw -eq "") { $nominalRaw = "0" }
        
        $obj = [PSCustomObject]@{
            no = $entry.A
            nama = $entry.B
            id = $entry.C
            total_komponen = [int]($entry.D -replace '[^0-9]', '0')
            aud = [int]($entry.E -replace '[^0-9]', '0')
            sd = [int]($entry.F -replace '[^0-9]', '0')
            smp = [int]($entry.G -replace '[^0-9]', '0')
            sma = [int]($entry.H -replace '[^0-9]', '0')
            lansia = [int]($entry.I -replace '[^0-9]', '0')
            disabilitas = [int]($entry.J -replace '[^0-9]', '0')
            hamil = [int]($entry.K -replace '[^0-9]', '0')
            nominal = [long]$nominalRaw
        }
        $results.Add($obj)
    }
}

$results | ConvertTo-Json | Out-File "C:\Users\haras\.gemini\antigravity\brain\34d47c49-15a9-44a5-bb0d-1764720ad19e\web-spk\excel_data.json" -Encoding utf8
Write-Host "Successfully extracted $($results.Count) records to excel_data.json"
