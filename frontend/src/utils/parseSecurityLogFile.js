function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell); cell = '';
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell);
  if (row.some(value => value.trim())) rows.push(row);
  if (rows.length < 2) throw new Error('CSV file must contain a header and at least one event.');
  const headers = rows[0].map(value => value.trim());
  return rows.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

export function parseSecurityLogFile(file, text) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let parsed;
  if (extension === 'csv') parsed = parseCsv(text);
  else if (extension === 'jsonl' || extension === 'ndjson') {
    parsed = text.split(/\r?\n/).filter(line => line.trim()).map((line, index) => {
      try { return JSON.parse(line); }
      catch { throw new Error(`Invalid JSON on line ${index + 1}.`); }
    });
  } else {
    try { parsed = JSON.parse(text); }
    catch { throw new Error('Choose a valid JSON, JSONL, NDJSON, or CSV log export.'); }
  }
  if (!Array.isArray(parsed)) {
    parsed = parsed?.events || parsed?.records || parsed?.Records || parsed?.value || parsed?.results;
  }
  if (!Array.isArray(parsed) || !parsed.length) throw new Error('The file must contain an event array.');
  if (!parsed.every(row => row && typeof row === 'object' && !Array.isArray(row))) throw new Error('Each event must be an object.');
  if (parsed.length > 5000) throw new Error('Import up to 5,000 events at a time.');
  return parsed;
}
