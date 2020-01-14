var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
var port = process.env.PORT || 80;

mongoose.connect('mongodb://localhost:27017/trash', {useFindAndModify:false});

app.listen(port, function () {
  console.log('server is running on' + port);
});


//스키마
var Schema_login = mongoose.Schema;
var Schema = mongoose.Schema;
var PointSchema = new Schema({type: String, date: String, point: Number}, {_id:false});
var loginSchema = new Schema_login({
  userImg: String,
  name : String,
  userID : {type:String,unique:true, trim:true}, 
  userPassword : String,
  email : String,
  points : {type: [PointSchema], default:[{"type":"hello world", "date":"2020-01-15", "point":100}]},
  totalPoints : {type:Number, default:0}
});

var Login = mongoose.model("Login", loginSchema);
var Point = mongoose.model("Point", PointSchema);

//전체 학생 명단
app.get('/logins', function (req, res, next){
  Login.find({}, function (error, login){
    if (error) {
      return res.json(error);
    }
    return res.json(login);
    });
});
/*
app.get('/logins/:userID', function (req, res, next){
  Login.find({userID : req.params.userID}, function (error, login){
    if (error) {
      return res.json(error);
    }
    return res.json(login);
    });
});*/
/*
app.put('/logins/:userID', function (req, res, next) {
  var userImg = req.body.userImg;
  var userID = req.body.userID;
  var userPassword = req.body.userPassword;
  var name = req.body.name;
  var userEmail = req.body.userEmail;
  var points = req.body.points;
  Login.update({userImg : userImg, 
    userID : userID, 
    userPassword: userPassword,
    name : name,
    userEmail : userEmail,
    points : [{type : points.type, date : points.date, point : points.point}]}, function (error, login) {
      if (error) {
        return res.json(error);
      } 
      return res.json(login);
    });
});*/

app.delete('/logins/:id', function (req, res, next){
  Login.remove({ _id : req.params.id}, function (error, login){
    if (error) {
      return res.json(error);
    }
    return res.json(login);
    });
});

app.put('/personalInfo/:userID', function(req, res, next) {

  const json = req.body.points
  const obj = JSON.parse(json);
  Login.findOneAndUpdate({userID:req.body.userID}, 
    {$push:{points:{type:obj.type, date:obj.date, point:obj.point}}},{new:true}, function (error, login){
      if (error) {
        console.log("req---" + req.body.points);
        return res.json(error);
      }
      console.log("req---" + req.body.points);
      console.log("req---userID-- " + req.body.userID);
      return res.json(login);
    });    
});


/*
app.put('/logins/:id', function (req, res, next){
  Login.findByIdAndInsert(req.params.id,
    {"$push": {"points": {"type": "pet", "date":"2010-10-10", "point":35}}},
    {"new":true, "upsert": true},
    function (err, managerparent) {
      if(error) throw err;
      console.log(managerparent);
    });
});*/

app.post('/logins', function(req, res, next){
  var userImg = req.body.userImg;
  var userID = req.body.userID;
  var userPassword = req.body.userPassword;
  var name = req.body.name;
  var email = req.body.email;
  var points = req.body.points
  var totalPoints = req.body.totalPoints
 // var point_array = Point({
 //   type : points.type,
//    date : points.date,
 //   point : points.point
 // }); 
  var login = Login({
    userImg : userImg,
    userID : userID,
    userPassword : userPassword,
    name : name,
    email : email,
    points : points,
    totalPoints: totalPoints
  });

  login.save(function(err){
    if (err) {
      return res.json(err);
    }
    return res.send("Successfully Created");
  });
});

var pipeline = [
  {"$unwind": "$points"},
  {
    "$group": {
      "_id":"$_id",
      "userImg": {"$first":"$userImg"},
      "userID": {"$first":"$userID"},
      "userPassword":{"$first":"$userPassword"},
      "name":{"$first":"$name"},
      "email":{"$first":"$email"},
      "points": {"$push": "$points"},
      "totalPoints":{"$sum":"$points.point"}
    }
  }, {"$out":"logins"}
]


app.get('/personalInfo/:userID', function(req, res, next) {
  Login.aggregate(pipeline).exec(function(err, results) {
    console.log(JSON.stringify(results));
    if(err) throw err;
    Login.find({userID:req.params.userID}, function(err, found) {
      if(err) return res.json(err);
     
    return res.send(found);
    })
  })
});


app.get('/logins/:userID', function(req, res, next){
  Login.find({userID: req.params.userID}, function(err, found){
    if(err){
      return res.json(err);
    }
    return res.send(found);
    });
});
