const loadingSlip = require("../models/loading_slip");
const { validationResult } = require("express-validator");
const comPController = require("../controllers/company");
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
    const companyEmail = await comPController.getCompanyEmail(
      req.headers.authorization
    );
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
      franchise_id: user.franchise_id,
    });
    clt.save(async (err, doc) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        const tem = await emailTemplate(
            "created",
            companyEmail,
            doc.s_no,
            user.username
          ),
          obj = {
            from: process.env.AUTH_EMAIL,
            to: companyEmail,
            subject: "Loading slip",
            html: tem,
            // html: `<h1 style="color:red;">loading slip with serial number ${doc.s_no} is created by ${user.username}</h1>`,
          };
        const mail = await mailer.sendMail(obj);
        res.send({ message: "successfully created", id: doc._id });
      }
    });
  }
}
// get All slips
const getLoadingSlips = async (req, res) => {
  const user = await auth.getUserBytoken(req.headers.authorization);
  if (req.query.search) {
    loadingSlip.find(
      { party: req.query.search, franchise_id: user.franchise_id },
      (err, doc) => {
        if (err) {
          return res.status(400).send({ message: err });
        } else {
          res.send({ count: doc.length, data: doc });
        }
      }
    );
  } else {
    loadingSlip.find({ franchise_id: user.franchise_id }, (err, doc) => {
      if (err) {
        return res.status(400).send({ message: err });
      } else {
        res.send({ count: doc.length, data: doc });
      }
    });
  }
};
// single get
const getSingleLoadingSlips = async (req, res) => {
  const user = await auth.getUserBytoken(req.headers.authorization);
  loadingSlip.findOne(
    { _id: req.params.id, franchise_id: user.franchise_id },
    (err, doc) => {
      if (err) {
        return res.status(400).send({ message: "Not found" });
      } else {
        res.send(doc);
      }
    }
  );
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
      const user = await auth.getUserBytoken(req.headers.authorization);
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
        franchise_id: user.franchise_id,
        created_by: req.body.user_name,
      };

      const companyEmail = await comPController.getCompanyEmail(
        req.headers.authorization
      );
      loadingSlip.findOneAndUpdate(
        { _id: req.params.id },
        { $set: payload },
        { new: true },
        async (err, doc) => {
          if (err) {
            return res.status(400).send({ message: "Not found" });
          } else {
            const tem = await emailTemplate(
                "updated",
                companyEmail,
                doc.s_no,
                user.username
              ),
              obj = {
                from: process.env.AUTH_EMAIL,
                to: companyEmail,
                subject: "Loading slip",
                html: tem,
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
    const companyEmail = await comPController.getCompanyEmail(
      req.headers.authorization
    );
    loadingSlip.findOneAndDelete({ _id: req.params.id }, async (err, doc) => {
      if (err) {
        return res.status(400).send({ message: "Not found" });
      } else {
        const tem = await emailTemplate(
            "deleted",
            companyEmail,
            doc?.s_no,
            user.username
          ),
          obj = {
            from: process.env.AUTH_EMAIL,
            to: companyEmail,
            subject: "Loading slip",
            html: tem,
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
const getLoadingSlipsSerialNo = async (req, res) => {
  const user = await auth.getUserBytoken(req.headers.authorization);
  loadingSlip.find({ franchise_id: user.franchise_id }, (err, doc) => {
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

function emailTemplate(action, email, s_no, userName) {
  return ` <div style="width:100%;justify-content:center;display:flex;">
   <div style="width:100%">
  <div style="color:white;background:#ff811af4;text-align:center;height:40px;font-size:25px;font-weight:700;padding:10px 0px 0px 0px">NDRC Doc</div>
    <div style="height:150px;font-size:15px;text-align:center;padding:60px 0px 0px 0px">Hello <span style="text-decoration:underline;color:red">${email}</span> a new loading slip has been ${action} by ${userName}.#${s_no}</div>
    <div style="color:white;background:#ff811af4;text-align:center;height:40px;font-size:12px;font-weight:500;padding:20px 0px 0px 0px">@copyright NDRC Doc,Faridabad support@New Deep Road Carrier</div>
    </div>
  </div>`;
}
const getDashbaordDetails = async (req, res) => {
  const user = await auth.getUserBytoken(req.headers.authorization);
  const payload = {
    total_loading_slip: await getTotalLoadingSlip(user),
    monthly_loading_slip: await getMonthlyLoadingSlip(user),
    total_bills: 0,
  };
  res.status(200).send(payload);
};
async function getTotalLoadingSlip(user) {
  let count;
  count = await loadingSlip
    .find({ franchise_id: user.franchise_id })
    .count(function (err, doc) {
      if (err) {
        return;
      }
      return doc;
    })
    .clone();
  return count;
}
async function getMonthlyLoadingSlip(user) {
  let total;
  const now = new Date().getMonth() + 1;
  total = await loadingSlip
    .find(
      {
        franchise_id: user.franchise_id,
      },
      (err, doc) => {
        if (err) {
          return;
        }
        return doc;
      }
    )
    .clone();
  const count = total.filter(
    (d) => new Date(d.created_date).getMonth() + 1 == now
  );
  return count.length;
}
module.exports = {
  createLoadingSlip,
  getDashbaordDetails,
  getLoadingSlips,
  deleteLoadingSlips,
  getSingleLoadingSlips,
  updateLoadingSlips,
  getLoadingSlipsSerialNo,
};
