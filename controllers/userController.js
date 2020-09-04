const express = require('express');

var router = express.Router();
const mongoose = require('mongoose');
const chalk = require('chalk');
const User = mongoose.model('User');
const Transfer = mongoose.model('Transfer');


var ObjectID = require('mongodb').ObjectID;

var getUserName = User.find({}, { fullName: 1, _id: 1 });

const recipient = [];

mongoose.set('useFindAndModify', false);

//View the Homepage 
router.get('/', (req, res) => {
  {
    res.render('user/home', {
      viewTitle: 'Insert User',
    });
  }
});

//View All the Users 
router.get('/viewUsers', (req, res) => {
  User.find((err, docs) => {
    if (!err) {
      res.render('user/viewUsers', {
        viewUsers: docs,
      });
    } else {
      console.log('Error in retrieving user list:', +err);
    }
  });
});

//Get to a Profile of a Particular User
router.get('/viewUsers/:id', function (req, res) {
  const id = req.params.id;
  User.findById(id).then((docs) => {
    if (!docs) {
      const error = chalk.red.inverse.bold('Error in retrieving user list!');
      console.log(error);
      
      res.status(404).send('result ERROR');
    
    } else {
      console.log(id);
      res.render('user/avatar', {
        avatar: docs,
        getUserName,
      });
    }
  });
});

//Get to the Transfer Page of a Particular User
router.post('/avatar', function (req, res) {

  const id = req.body.payeeid;
  console.log(id);
  const name = User.findById(ObjectID(id), { fullName: 1, _id: 1 });
 

  //console.log(id)
  name.exec(function (err, docs) {
    if (err) throw err;
    const getUserName = User.find({}, { fullName: 1, _id: 1 })
      .where('fullName')
      .ne(docs.fullName)
      .exec(function (err, data) {
        if (err) throw err;
        //console.log(data);
        //console.log(docs);
        res.render('user/transact', {
          viewTitle: 'Transactions',
          transact: data,
          records: docs,
        });
      });
  });
});

//Transfer the amount of Credits from One User to Another
router.post('/transact', function (req, res) {
  const payee = req.body.fromid;
  const payeeName = req.body.fromname;
 
  const recipientId = req.body.recipientID;

  User.findById(req.body.recipientID, { fullName: 1, _id: 1 }, function (
    err,
    doc
  ) {
    recipient.pop();
    recipient.push(doc.fullName);
    console.log(recipient);
  });
  console.log(recipient[0]);

  User.find(
    {
      _id: payee,
    },
    function (err, user) {
      if (!err) {
        if (user[0].credits >= req.body.amount) {
          User.findOneAndUpdate(
            {
              _id: payee,
            },
            {
              $inc: {
                credits: -req.body.amount,
              },
            },
            function (req, res) {}
          );
          User.findOneAndUpdate(
            {
              _id: recipientId,
            },
            {
              $inc: {
                credits: req.body.amount,
              },
            },
            function (req, res) {}
          );

          var today = new Date();
          var date =
            today.getDate() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getFullYear();
          var time =
            today.getHours() +
            ':' +
            today.getMinutes() +
            ':' +
            today.getSeconds();

          var dateTime = time + ' , ' + date;
          const transaction = new Transfer({
            fromUser: req.body.fromname,
            ToUSer: recipient[0],
            creditsTransferred: req.body.amount,
            timestamp: dateTime,
          });
          transaction.save();
          res.redirect('/success');
        } else {
          res.redirect('/failure');
        }
      }
    }
  );
});

module.exports = router;
