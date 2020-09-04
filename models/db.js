const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rushabh:12345@cluster0.pvsqj.mongodb.net/UsersDB?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true  },(err) =>{
    if(!err){ console.log('MongoDB Connection Succeeded.')}
    else {console.log('Error in DB connection: '+err)}
});

mongoose.Types.ObjectId.isValid('your id here');
require('./user.model');

require('./transfer.model');
