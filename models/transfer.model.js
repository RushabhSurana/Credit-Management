const mongoose = require('mongoose');

var transferSchema = new mongoose.Schema(
    {
     fromUser: String,
     ToUSer: String,
     creditsTransferred: Number,
     timestamp:String
    }
);
    


mongoose.model('Transfer',transferSchema);
