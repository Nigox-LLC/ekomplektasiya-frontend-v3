export const exportToCSV = <T extends Record<string, unknown>>(data: T[], filename: string) => {
  if (!data || !data.length) {
    alert("Yuklash uchun ma'lumot mavjud emas");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    headers.join(',') +
    '\n' +
    data
      .map((row) => {
        return headers
          .map((fieldName) => {
            const value = row[fieldName];
            // Handle strings with commas or quotes
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          })
          .join(',');
      })
      .join('\n');

  // Download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
