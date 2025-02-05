
const { validationResult } = require("express-validator");
const auth = require('./auth');
const entries = require("../models/entries");
const loadingSlip = require("../models/loading_slip");

const helper = require('./helper')
const moment = require("moment");
async function create(req, res, next) {
    console.log(req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((d) => {
          return { message: d.msg };
        }),
      });
    } else {
      const user = await auth.getUserBytoken(req.headers.authorization);
      const isAlreadyExist = await entries.findOne({loading_id:req.body.loading_id});
      console.log(isAlreadyExist);
      
      if(isAlreadyExist){
        res.status(400).send({ message: 'already exist!' });
        return;
      }
      let clt = new entries({
        ...req.body,
        franchise_id: user.franchise_id,
      });
      clt.save(async (err, doc) => {
        if (err) {
          res.status(400).send({ message: err });
        } else {
          
          res.send({ message: "successfully created", id: doc._id });
        }
      });
    }
  }

const getEntries = async (req, res) => {
    const user = await auth.getUserBytoken(req.headers.authorization);
  
    try {
      // for pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      let loading_ids = []
      // Query for result
      if(req.query.search || req.query.customer){
        
      loading_ids = await loadingSlip
      .find({
        ...(req.query.search && {
          $or: [
            // { customer: { $regex: req.query.search, $options: "i" } },
            { trailor_no: { $regex: req.query.search, $options: "i" } },
          ],
        }),
        ...(req.query.customer && {
          customer: req.query.customer,
        }),
        franchise_id: user.franchise_id,
      })
        
      if(loading_ids.length == 0){
        res.send({
          count: 0,
          next: null,
          previous: null,
          results: [],
        });
        return
      }
      }

      // entries
      const list = await entries
      .find({
          ...loading_ids.length && {
            "loading_id": { $in: loading_ids },
          },
          ...(req.query.start_date &&
            req.query.end_date && {
              date: {
                $gte: moment(new Date(req.query.start_date)).format("YYYY-MM-DD"),
                $lte: moment(new Date(req.query.end_date)).format("YYYY-MM-DD"),
              },
            }),
            franchise_id: user.franchise_id,
          })
        .populate("loading_id", ["_id", "date","customer","trailor_no","from","to","freight","detain","l","w","h","weight","advance","balance"])
        .populate({ 
          path: 'loading_id',
          populate: { path: 'customer' }
         })
        .skip(skip)
        .limit(limit)
  
      const response = list;
      
      // export excel
      if (req.query.export && req.query.export == "yes") {
        const columns = [
          { header: "Date", key: "date", width: 15 },
          { header: "Party", key: "customer", width: 30 },
          { header: "Address", key: "address", width: 30 },
          { header: "Trailor No.", key: "trailor_no", width: 15 },
          { header: "From", key: "from", width: 15 },
          { header: "To", key: "to", width: 15 },
          { header: "Freight", key: "freight", width: 15 },
          { header: "Detain", key: "detain", width: 15 },
          { header: "length", key: "l", width: 10 },
          { header: "width", key: "w", width: 10 },
          { header: "Height", key: "h", width: 10 },
          { header: "Weight", key: "weight", width: 10 },
          { header: "Advance", key: "advance", width: 25 },
          { header: "Balance", key: "balance", width: 25 },
          { header: "bill_amount", key: "bill_amount", width: 25 },
          { header: "amount_recd", key: "amount_recd", width: 25 },
          { header: "commission", key: "commission", width: 25 },
          { header: "sheet_no", key: "sheet_no", width: 25 },
          { header: "remarks", key: "remarks", width: 25 },
          
          
        ];
        helper.exportAsExcel(res, response, columns);
        return;
      }
      // pagination
      const count = await entries.countDocuments();
      const { next, previous } = helper.pagination(req, count, page, limit);
      
      // send response JSON
      res.send({
        count: count,
        next: next,
        previous: previous,
        results: response,
      });
      return;
    } catch (err) {
      console.log(err);
      
      return res.status(400).send({ message: err });
    }
  };
  const deleteEntries = async (req, res) => {
    if (req.params.id) {
      const user = await auth.getUserBytoken(req.headers.authorization);
      // const companyEmail = await comPController.getCompanyEmail(
      //   req.headers.authorization
      // );
      entries.findOneAndDelete({ _id: req.params.id }, async (err, doc) => {
        if (err) {
          return res.status(400).send({ message: "Not found" });
        } else {
          // const tem = await emailTemplate(
          //     "deleted",
          //     companyEmail,
          //     doc?.s_no,
          //     user.username
          //   ),
          //   obj = {
          //     from: process.env.AUTH_EMAIL,
          //     to: companyEmail,
          //     subject: "Loading slip",
          //     html: tem,
          //   };
          // const mail = await mailer.sendMail(obj);
  
          res.send({ message: "successfully deleted" });
        }
      });
    } else {
      res.status(400).send({ message: "entrie id is required" });
    }
  };

  const updateEntries = async (req, res) => {
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
          ...req.body,
          franchise_id: user.franchise_id,
        };
  
        // const companyEmail = await comPController.getCompanyEmail(
        //   req.headers.authorization
        // );
        entries.findOneAndUpdate(
          { _id: req.params.id },
          { $set: payload },
          { new: true },
          async (err, doc) => {
            if (err) {
              return res.status(400).send({ message: "Not found" });
            } else {
              // const tem = await emailTemplate(
              //     "updated",
              //     companyEmail,
              //     doc.s_no,
              //     user.username
              //   ),
              //   obj = {
              //     from: process.env.AUTH_EMAIL,
              //     to: companyEmail,
              //     subject: "Loading slip",
              //     html: tem,
              //   };
              // const mail = await mailer.sendMail(obj);
              res.send({ message: "updated successfully", id: doc._id });
            }
          }
        );
      }
    } else {
      res.status(400).send({ message: "Entry id is required" });
    }
  };
module.exports ={
    create,
    getEntries,
    updateEntries,
    deleteEntries
}