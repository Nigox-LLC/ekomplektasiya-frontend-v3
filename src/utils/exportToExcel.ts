import * as XLSX from 'xlsx';

export const exportToExcel = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[]
) => {
  if (!data || !data.length) {
    alert("Yuklash uchun ma'lumot mavjud emas");
    return;
  }

  let dataToExport = data;

  // If columns are provided, map the data to match the columns and use headers
  if (columns) {
    dataToExport = data.map((item) => {
      const row: Record<string, unknown> = {};
      columns.forEach((col) => {
        row[col.header] = item[col.key];
      });
      return row;
    }) as T[];
  }

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate buffer
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
