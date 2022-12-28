const XLSX = require('xlsx');

const getDataFromExcel = (filePath) => {
  const parcour = XLSX.readFile(filePath);

  const sheetName = parcour.SheetNames[0];
  const ws = parcour.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(ws);

  return json;
};
module.exports = getDataFromExcel;
