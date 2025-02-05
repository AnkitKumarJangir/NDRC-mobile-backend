const mongoose = require("mongoose");

const entries = mongoose.model("entries", {
    date: { type: String },
    loading_id: { type: mongoose.Schema.Types.ObjectId, ref: "loadingSlip" },
    bill_amount:{type:Number},
    amount_recd:{type:Number},
    commission:{type:String},
    sheet_no:{type:String},
    remarks:{type:String},
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    franchise_id:{type:String}
});
module.exports = entries;
