const ExcelJS = require("exceljs");

const exportAsExcel = async (res, rows, columns) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  worksheet.columns = columns;
  worksheet.addRows(rows);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  await workbook.xlsx.write(res);
  res.end();
};

const pagination = (req, count, page, limit) => {
  const baseUrl = getRequestUrl(req);
  const totalPages = Math.ceil(count / limit);

  const nextPage =
    page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
  const previous =
    page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

  return { next: nextPage, previous: previous };
};

const getRequestUrl = (req) => {
  return `${req.protocol}://${req.get("host")}${req.baseUrl}${req.route.path}`;
};
module.exports = {
  exportAsExcel,
  getRequestUrl,
  pagination,
};
