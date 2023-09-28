const request = require('request');
const express = require('express');
const app = express();
app.use(express.static("public"));
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
var serviceAccount = require("./Accountservicekey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.set("view engine","ejs")
app.use(express.static('views'));

const db = admin.firestore();


app.get('/',function (req,res) {
  res.render( __dirname + "/views/" + "home" );
});

app.get('/signup',function (req,res) {
  res.render( __dirname + "/views/" + "signup" );
});



app.post('/signupsubmit',function (req, res) {
  db.collection("users")
    .add({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    
    })
    .then(() => {
      res.render("signup.ejs");
    });
});

app.post('/login',function (req,res) {
  res.render( __dirname + "/views/" + "signup.ejs" );
});

app.post('/loginsubmit',function (req, res) {
  db.collection("users")
  .where("email", "==" ,req.body.email)
  .where("password", "==" ,req.body.password)
  .get()
  .then((docs) =>{
    if(docs.size>0){
      res.render("time");
    }else{
      res.render("loginfail.ejs");
    }
    console.log(docs.size)
  });
});
app.post('/timesubmit',(req,res) =>{
  const title = req.body.title;

  request.get({
    url: 'https://api.api-ninjas.com/v1/worldtime?city=' + title,
    headers: {
      'X-Api-Key': 'VoNOqiYnho+ksLTG1CK0gg==v0sfgZYgBLFKKI0f'
    },
  }, function (error, response, body){
      if("error" in JSON.parse(body))
      {
        if((JSON.parse(body).error.code.toString()).length > 0)
        {
          res.render("time");
        }
      }
      else
      {
        const timezone= JSON.parse(body).timezone;
        const datetime= JSON.parse(body).datetime;
        const date = JSON.parse(body).date;
        const year= JSON.parse(body).year;
        const month= JSON.parse(body).month;
        const day= JSON.parse(body).day;
        const hour=JSON.parse(body).hour;
         const minute=JSON.parse(body).minute;
         const second=JSON.parse(body).second;
 const day_of_week=JSON.parse(body).day_of_week;
        
        


       res.render('title',{
  timezone:  timezone,
  datetime:datetime,
  date:date,
  year:year,
  month:month,
  day: day,
  hour: hour,
  minute:minute ,
  second: second,
  day_of_week: day_of_week,
});
        
      } 
    }
    );
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})