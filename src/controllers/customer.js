const customer = require("../models/customer");
const auth = require("./auth");
const { validationResult } = require("express-validator");
const helper = require("../controllers/helper");
const ExcelJS = require("exceljs");

const getCustomerList = async (req, res) => {
  try {
    const user = await auth.getUserBytoken(req.headers.authorization);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const list = await customer
      .find({ franchise_id: user.franchise_id })
      .skip(skip)
      .limit(limit);

    if (req.query.export && req.query.export == "yes") {
      const columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Mobile", key: "mobile", width: 15 },
        { header: "Email", key: "email", width: 15 },
        { header: "Address line 1", key: "address_line_1", width: 30 },
        { header: "Address line 2", key: "address_line_2", width: 15 },
        { header: "Description", key: "description", width: 30 },
      ];
      helper.exportAsExcel(res, list, columns);
      return;
    }
    const count = await customer.countDocuments();
    const { next, previous } = helper.pagination(req, count, page, limit);

    res.send({
      count: count,
      next: next,
      previous: previous,
      results: list,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: err });
  }
};
const getCustomerWithoutPagination = async (req, res) => {
  try {
    const user = await auth.getUserBytoken(req.headers.authorization);
    const customerList = await customer.find(
      {
        franchise_id: user.franchise_id,
      },
      "_id name"
    );
    res.status(200).send(customerList);
  } catch (error) {
    res.status(400).send();
  }
};
const getSingleCustomer = async (req, res) => {
  try {
    const user = await auth.getUserBytoken(req.headers.authorization);
    customer.findOne(
      {
        _id: req.params.id,
        franchise_id: user.franchise_id,
      },
      (err, doc) => {
        if (err) {
          return res.status(400).send({ message: "Not found" });
        } else {
          res.send(doc);
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const createCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((d) => {
          return { error: d.msg };
        }),
      });
    } else {
      const user = await auth.getUserBytoken(req.headers.authorization);

      let newCustomer = new customer({
        ...req.body,
        franchise_id: user.franchise_id,
      });
      newCustomer.save((err, doc) => {
        if (err) {
          res.status(400).send({ message: err });
        } else {
          res.status(200).send({ message: "customer created", id: doc._id });
        }
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: err });
  }
};
const bulkImportCustomer = async (req, res) => {
  try {
    const user = await auth.getUserBytoken(req.headers.authorization);
    const workbook = new ExcelJS.Workbook();

    let filePath = `public/files/${req.file.filename}`;

    await workbook.xlsx.readFile(filePath);

    const workbooksheet = workbook.worksheets[0];

    let data = [];

    workbooksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const rowData = {
          name: row.getCell(1).value,
          mobile: row.getCell(2).value,
          email: row.getCell(3).value,
          address_line_1: row.getCell(4).value,
          address_line_2: row.getCell(5).value,
          description: row.getCell(6).value,
          franchise_id: user.franchise_id,
        };
        data.push(rowData);
      }
    });
    if (data.length == 0) {
      res.status(400).send({ message: "No recodes found in this file." });
      return;
    }

    customer.insertMany(data, (err, doc) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        res.status(200).send({ message: "customers imported successfully" });
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: err });
  }
};
const updatedCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((d) => {
          return { error: d.msg };
        }),
      });
    } else {
      const user = await auth.getUserBytoken(req.headers.authorization);

      customer.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body, franchise_id: user.franchise_id } },
        { new: true },
        (err, doc) => {
          if (err) {
            return res.status(400).send({ message: "Not found" });
          } else {
            res.send({ message: "updated successfully", id: doc._id });
          }
        }
      );
      // let newCustomer = new customer({
      //   ...req.body,
      //   franchise_id: user.franchise_id,
      // });
      // newCustomer.save((err, doc) => {
      //   if (err) {
      //     res.status(400).send({ message: err });
      //   } else {
      //     res.status(200).send({ message: "customer created", id: doc._id });
      //   }
      // });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: err });
  }
};
const deleteCustomer = async (req, res) => {
  if (req.params.id) {
    customer.findOneAndDelete({ _id: req.params.id }, async (err, doc) => {
      if (err) {
        return res.status(400).send({ message: "Not found" });
      } else {
        res.send({ message: "successfully deleted" });
      }
    });
  } else {
    res.status(400).send();
  }
};
module.exports = {
  getCustomerList,
  createCustomer,
  getSingleCustomer,
  updatedCustomer,
  deleteCustomer,
  getCustomerWithoutPagination,
  bulkImportCustomer,
};
