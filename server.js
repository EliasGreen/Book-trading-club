// init project
const express = require('express');
const app = express();
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
       response.json({isLogedIn: request.isAuthenticated(), nickname: document.nickname, city: document.city, street: document.street});
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
