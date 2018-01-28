// init project
const express = require('express');
const app = express();
// book search "engine"
const books = require('google-books-search');
// dotenv
require('dotenv').config()
// body-parser
const bodyParser = require('body-parser');
// cookie-parser
const cookieParser = require('cookie-parser');
// passport
const passport = require('passport');
// bcrypt - hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;
// session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// assert
const assert = require('assert');
//require/import the mongodb native drivers
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// using Node.js `require()`
const mongoose = require('mongoose');
// connection URL
const url = process.env.MONGOLAB_URI;      
// connection
const promise_connection = mongoose.connect(url, {
	useMongoClient: true
});
let db = mongoose.connection;
// if connection is success
promise_connection.then(function(db){
	console.log('Connected to mongodb');
});
/******************************/
// set store
/******************************/
let store = new MongoDBStore(
      {
        uri: url,
        collection: "sessions"
      });
 // Catch errors
    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
/***********************************/
// set USEs
/***********************************/
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ 
  extended: true
}));
/***/
app.use(cookieParser())
/***/
app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
      },
  store: store,
  resave: false,
  saveUninitialized: false
  //cookie: { secure: true }
}));
/***/
app.use(passport.initialize());
app.use(passport.session());
/***/
app.use(express.static('public'));
/***********************************/

/******************************/
// mongoDB models and schemas
/******************************/
// if connection is success
promise_connection.then(function(db){
	console.log('Connected to mongodb');
});
// describe the schema
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
let userSchema = new Schema({
    nickname: String,
    email: String,
    password: String,
    city: String,
    street: String,
    books: [],
    income: [],
    outcome: []
});
// get the model
let userModel = mongoose.model('usersforbooktrading', userSchema);
/***********************************/
// getting the layout(page) of application
app.get("*", function(request, response) {
  // prevent user from getting the wrong page when user is authenticated or not
  if((request.path == "/books" || request.path == "/profile") && request.isAuthenticated() === false) {
    response.redirect("/login");
  }
  else if((request.path == "/signup" || request.path == "/login") && request.isAuthenticated() === true) {
    response.redirect("/books"); 
  }
  else {
   response.sendFile(__dirname + '/app/index.html');
  }
});

/******************************/
//       POST methods
/******************************/
app.post("/sign-up", function(request, response) {
  // check if email is already used
  userModel.find({ email: request.body["email"]}, function (err, document) {
              if(!err) {
                if(document.length == 0) {
                     // check if email is already used
                    userModel.find({ nickname: request.body["nickname"]}, function (err, document) {
                                if(!err) {
                                  if(document.length == 0) {
                                           //hash password
                                            bcrypt.hash(request.body["password"], saltRounds, function(err, hash) {
                                            // create a user
                                                let obj = {nickname: request.body["nickname"], email: request.body["email"], password: hash, city: "", street: "", books: [], income: [], outcome: []};
                                                let user = new userModel(obj);
                                                user.save(function (err) {
                                                  if (!err) console.log('Success!');
                                                      // login after registration
                                                      userModel.find({nickname: request.body["nickname"], email: request.body["email"], password: hash}, function (err, document) {
                                                        if(!err) {
                                                          let user_id = document[0]["id"];
                                                          request.login(user_id, () => {
                                                            // send to user main page if error == zero
                                                               response.json({"error": 0});
                                                      });
                                                    }
                                                  });
                                              });
                                          });
                                }
                                else {
                                  response.json({"error": "nickname"});
                                }
                              }
                       });
                    }
                else if(document.length == 1) {
                 response.json({"error": "error"});
                }
            }
        });
});
/***********************************/
app.post("/log-in", function(request, response) {
              userModel.find({ email: request.body["email"]}, function (err, document) {
              if(!err) {
                if(document.length == 0) {
                  response.json({"error": "error0"});
                }
                else if(document.length == 1) {
                bcrypt.compare(request.body["password"], document[0]["password"], function(err, res) {
                if(res === true) {
                let user_id = document[0]["id"];
                request.login(user_id, () => {
                     response.json({"error": 0});
                           });
                        }
                  else if(res === false) {
                    response.json({"error": "error1"});
                  }
                   });
                }
            }
        });
});
/***********************************/
app.post("/log-out", function(request, response) {
          request.logout();
          request.session.destroy(function(err) {
          response.status(200).clearCookie('connect.sid', {path: '/'}).json({error: 0});
     })
});
/***********************************/
app.post("/is-loged-in", function(request, response) {
  // in addition to check is loged in user also we get user nickname
  if(request.session.hasOwnProperty("passport")) {
   userModel.findById(request.session.passport.user, (err, document) => {
     if(!err) {
       response.json({isLogedIn: request.isAuthenticated(), nickname: document.nickname, city: document.city, street: document.street, books: document.books, income: document.income, outcome: document.outcome});
     } 
     else {
       console.log("ERROR!: ", err);
     } 
        });
  } 
         
  else {
        response.json({isLogedIn: request.isAuthenticated(), nickname: "0"}); 
    }
});
/***********************************/
app.post("/set-city", function(request, response) {
      userModel.findById(request.session.passport.user, (err, user) => {
      if (err) throw err;

      user.set({city: request.body["city"]});
      user.save(function (err, updatedUser) {
        if (err) throw err;
        response.json({update: true});
      });
    });
});
/***********************************/
app.post("/set-street", function(request, response) {
      userModel.findById(request.session.passport.user, (err, user) => {
      if (err) throw err;

      user.set({street: request.body["street"]});
      user.save(function (err, updatedUser) {
        if (err) throw err;
        response.json({update: true});
      });
    });
});
/***********************************/
app.post("/get-street-city-by-nick", function(request, response) {
      userModel.findOne({nickname: request.body["nickname"]}, (err, user) => {
      if (err) throw err;
      response.json({street: user.street, city: user.city});
    });
});
/***********************************/
app.post("/add-book", function(request, response) {
      userModel.findById(request.session.passport.user, (err, user) => {
      if (err) throw err;
        //search book img
        books.search(request.body["bookname"], function(error, results) {
            if ( ! error ) {
                let arrayOfBooks = user.books;
                arrayOfBooks.push({bookname:request.body["bookname"], img_url: results[0].thumbnail, nickname: user.nickname});
                user.set({books: arrayOfBooks});
                user.save(function (err, updatedUser) {
                  if (err) throw err;
                  response.json({update: true});
                });
            } else {
                console.log(error);
            }
        });  
    });
});
/***********************************/
app.post("/get-all-users-books", function(request, response) {
       userModel.find({}, (err, users) => {
          if(err) throw err;
          let books = []          
         
          for(let i = 0; i < users.length; i++) {
            for(let j = 0; j < users[i].books.length; j++) {
              // function for filtering
               function checkBookName(el) {
                 return el.chosenBook == users[i].books[j].bookname;
               }
              let filteredIncome = users[i].income.filter(checkBookName);
              let filteredOutcome = users[i].outcome.filter(checkBookName);
              if((filteredIncome.length == 0) && (filteredOutcome.length == 0)) {
                books.push(users[i].books[j]);
              }
            }
            if(i == users.length - 1) response.json({books: books});
          }
       });
});
/***********************************/
app.post("/get-user-filtered-books", function(request, response) {
       userModel.findById(request.session.passport.user, (err, user) => {
          if (err) throw err;
          let books = []          

            for(let j = 0; j < user.books.length; j++) {
              // function for filtering
               function checkBookName(el) {
                 return el.chosenBook == user.books[j].bookname;
               }
              let filteredIncome = user.income.filter(checkBookName);
              let filteredOutcome = user.outcome.filter(checkBookName);
              if((filteredIncome.length == 0) && (filteredOutcome.length == 0)) {
                books.push(user.books[j]);
              }
            }
         
          response.json({books: books});
     });
});
/***********************************/
app.post("/create-proposals", function(request, response) { 
  userModel.findById(request.session.passport.user, (err, user) => {
      if (err) response.json({error: 1});
       console.log(user.nickname);
       console.log(request.body["anotherUserNickname"]);
       console.log(request.body["chosenBook"]);
       console.log(request.body["chosenAnotherUserBook"]);
       let arrayOfOutcome = user.outcome;
       arrayOfOutcome.push({chosenBook: request.body["chosenBook"], 
                            anotherUserNickname: request.body["anotherUserNickname"], 
                            chosenAnotherUserBook: request.body["chosenAnotherUserBook"]});
      user.set({outcome: arrayOfOutcome});
      user.save(function (err, updatedUser) {
                  if (err) response.json({error: 2});
                  userModel.findOne({nickname: request.body["anotherUserNickname"]}, (err, anotherUser) => {
                      if (err) response.json({error: 3});
                    let arrayOfIncome = anotherUser.income;
                     arrayOfIncome.push({chosenBook: request.body["chosenAnotherUserBook"], 
                                          anotherUserNickname: user.nickname, 
                                          chosenAnotherUserBook: request.body["chosenBook"]});
                    anotherUser.set({income: arrayOfIncome});
                    anotherUser.save((err, updatedAnotherUser) => {
                      response.json({error: 0});
                    });
                  });
                });
    });
});
/******************************/
// user sessions handlers:
/******************************/
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});
// listen for requests
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
