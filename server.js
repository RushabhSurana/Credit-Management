require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const logger = require('./middleware/logger');
const bodyParser = require('body-parser');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const userController = require('./controllers/userController');
const app = express();
const mongoose = require('mongoose');
const Transfer = mongoose.model('Transfer');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(logger);

app.use(express.static('public'));

const handlebars = exphbs.create({
    extname:"hbs",
    defaultLayout:'mainLayout',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir:__dirname+'/views/layouts/'

    //Create Custom Helpers
})

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',handlebars.engine);
app.set('view engine','hbs');

const PORT = process.env.PORT || 5000;



app.get('/negative', (req, res) => {
  res.render('user/negative',{msg:"Please enter a valid credit value"});
});


app.get('/success', (req, res) => {
  res.render('user/success');
});

app.get('/failure', (req, res) => {
  res.render('user/failure',{msg:"Please check the amount you have entered,you may not have sufficient balance in account!!"});
});

app.get('/transactionHistory', (req, res) => {
  Transfer.find((err, docs) => {
    if (!err) {
      res.render('transfer/transactionHistory', {
        transactions: docs,
      });
    } else {
      console.log('Error in retrieving transactions list:', +err);
    }
  });
});


app.listen(PORT,() => {
  console.log(`Server started on port ${PORT}`)
});
app.use('/',userController);
