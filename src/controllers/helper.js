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

  return { next:nextPage, previous:previous };
};

const getRequestUrl = (req) => {
  return `${req.protocol}://${req.get("host")}${req.baseUrl}${req.route.path}`;
};



function welcomeEmailTemplate(user) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#1f2937;color:#ffffff;padding:20px;text-align:center;">
              <h1 style="margin:0;font-size:24px;">NDRC Doc</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;color:#333333;">
              <h2 style="margin-top:0;">Welcome, {{user}} 👋</h2>

              <p style="font-size:15px;line-height:1.6;">
                Thank you for signing up on <strong>NDRC</strong>.
                Your account has been successfully created and is now ready to use.
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;margin:20px 0;">
                <tr>
                  <td style="font-size:14px;">
                    <strong>Username:</strong> {{UserName}}<br />
                    <strong>Login URL:</strong>
                    <a href="{{LoginURL}}" style="color:#2563eb;">{{LoginURL}}</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:1.6;">
                If you have any questions or need help, feel free to contact us at
                <a href="mailto:{{SupportEmail}}" style="color:#2563eb;">
                  {{SupportEmail}}
                </a>.
              </p>

              <p style="font-size:15px;">
                We’re excited to have you on board 🚀
              </p>

              <p style="margin-top:30px;">
                Regards,<br />
                <strong>NDRC</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
              © {{Year}} NEW DEEP ROAD CARRIER. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>`;
}
module.exports = {
  exportAsExcel,
  welcomeEmailTemplate,
  getRequestUrl,
  pagination,
};
