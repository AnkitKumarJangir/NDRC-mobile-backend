const loadingSlip = require("../models/loading_slip");
const { validationResult } = require("express-validator");
const mailer = require("../controllers/mailer");
const auth = require("./auth");
const moment = require("moment");
// create new slip
async function createLoadingSlip(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((d) => {
        return { message: d.msg };
      }),
    });
  } else {
    const user = await auth.getUserBytoken(req.headers.authorization);
    let clt = new loadingSlip({
      s_no: req.body.s_no,
      date: req.body.date,
      party: req.body.party,
      address: req.body.address,
      trailor_no: req.body.trailor_no,
      from: req.body.from,
      to: req.body.to,
      goods: req.body.goods,
      freight: req.body.freight,
      p_m_t: req.body.p_m_t,
      fine: req.body.fine,
      detain: req.body.detain,
      size: req.body.size,
      l: req.body.l,
      w: req.body.w,
      h: req.body.h,
      weight: req.body.weight,
      guarantee: req.body.guarantee,
      advance: req.body.advance,
      balance: req.body.balance,
      created_date: moment().format("YYYY-MM-DD"),
      updated_date: moment().format("YYYY-MM-DD"),
      created_by: user ? user.username : "",
    });

    clt.save(async (err, doc) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        obj = {
          from: process.env.authEmail,
          to: user.email,
          subject: "Loading slip",
          text: `loading slip with serial number ${doc.s_no} is created by ${user.username}`,
        };
        const mail = await mailer.sendMail(obj);
        res.send({ message: "successfully created", id: doc._id });
      }
    });
  }
}
// get All slips
const getLoadingSlips = (req, res) => {
  loadingSlip.find((err, doc) => {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      res.send({ count: doc.length, data: doc });
    }
  });
};
// single get
const getSingleLoadingSlips = (req, res) => {
  console.log(req);
  loadingSlip.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) {
      return res.status(400).send({ message: "Not found" });
    } else {
      res.send(doc);
    }
  });
};
// update one
const updateLoadingSlips = async (req, res) => {
  if (req.params.id) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((d) => {
          return { message: d.msg };
        }),
      });
    } else {
      let payload = {
        s_no: req.body.s_no,
        date: req.body.date,
        party: req.body.party,
        address: req.body.address,
        trailor_no: req.body.trailor_no,
        from: req.body.from,
        to: req.body.to,
        goods: req.body.goods,
        freight: req.body.freight,
        p_m_t: req.body.p_m_t,
        fine: req.body.fine,
        detain: req.body.detain,
        size: req.body.size,
        l: req.body.l,
        w: req.body.w,
        h: req.body.h,
        weight: req.body.weight,
        guarantee: req.body.guarantee,
        advance: req.body.advance,
        balance: req.body.balance,
        created_date: req.body.created_date,
        updated_date: moment().format("YYYY-MM-DD"),
        created_by: req.body.user_name,
      };
      const user = await auth.getUserBytoken(req.headers.authorization);
      loadingSlip.findOneAndUpdate(
        { _id: req.params.id },
        { $set: payload },
        { new: true },
        async (err, doc) => {
          if (err) {
            return res.status(400).send({ message: "Not found" });
          } else {
            obj = {
              from: process.env.authEmail,
              to: user.email,
              subject: "Loading slip",
              text: `loading slip with serial number ${doc.s_no} is updated by ${user.username}`,
            };
            const mail = await mailer.sendMail(obj);
            res.send({ message: "updated successfully", id: doc._id });
          }
        }
      );
    }
  } else {
    res.status(400).send({ message: "slip id is required" });
  }
};
// delete one
const deleteLoadingSlips = async (req, res) => {
  if (req.params.id) {
    const user = await auth.getUserBytoken(req.headers.authorization);
    loadingSlip.deleteOne({ _id: req.params.id }, async (err, doc) => {
      if (err) {
        return res.status(400).send({ message: "Not found" });
      } else {
        obj = {
          from: process.env.authEmail,
          to: user.email,
          subject: "Loading slip",
          text: `loading slip with serial number ${doc.s_no} is deleted by ${user.username}`,
        };
        const mail = await mailer.sendMail(obj);
        res.send({ message: "successfully deleted" });
      }
    });
  } else {
    res.status(400).send({ message: "slip id is required" });
  }
};
// get serial number
const getLoadingSlipsSerialNo = (req, res) => {
  loadingSlip.find((err, doc) => {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      if (doc?.length) {
        let collection = doc.sort((a, b) => b.s_no - a.s_no);
        let lastNumber = collection[0].s_no;
        res.send({ serial_number: lastNumber + 1 });
      } else {
        res.send({ serial_number: 1001 });
      }
    }
  });
};
module.exports = {
  createLoadingSlip,
  getLoadingSlips,
  deleteLoadingSlips,
  getSingleLoadingSlips,
  updateLoadingSlips,
  getLoadingSlipsSerialNo,
};
