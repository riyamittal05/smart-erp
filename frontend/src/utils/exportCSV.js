export const exportToCSV = (filename, columns, rows) => {
  if (!rows || rows.length === 0) {
    alert("No data available to export.");
    return;
  }

  const escapeValue = (value) => {
    const str = value === null || value === undefined ? "" : String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.join(",");
  const dataRows = rows.map((row) =>
    columns.map((col) => escapeValue(row[col])).join(",")
  );

  const csvContent = [header, ...dataRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};