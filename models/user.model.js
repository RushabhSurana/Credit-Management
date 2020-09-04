const mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
    fullName:String,
    email:String,
    mobile:String,
    credits: Number 
    }
);

mongoose.model('User',userSchema);
