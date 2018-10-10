var express = require("express");
var app = express();
var request = require("request");
var authenticationHeader = "";
var BaseURL = "";
var jsoncontainer = {};

app.use(express.static("./html"));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set global
function SetAuth(Tempparam, TempBaseURL) {
    authenticationHeader = Tempparam;
    BaseURL = TempBaseURL;
}

app.post("/login", (req, res, next) => {
    var url = "https://login.eloqua.com/id";
    var authenticationHeader_1 = "Basic " + new Buffer(req.body.company + "\\" + req.body.userlogin + ":" + req.body.password).toString("base64");
    request({ url: url, method: "GET", headers: { authorization: authenticationHeader_1 } },
        function (error, responselogin, bodydata) {
            console.log(bodydata);
            if (bodydata == '"Not authenticated."') {
                console.log("Error, Cannot Authenticate");
                res.sendFile(__dirname+"/html/Error401.html");
            }

            else {

                SetAuth(authenticationHeader_1, url);
                res.sendFile(__dirname+"/html/Contacts.html");
              
                //res.status(responselogin.statusCode).send(bodydata);
            }

            login_status = responselogin.statusCode;
        }); // end of request_login authentication

})

app.get("/contacts",(req,res,next)=>{
 
  url = "https://secure.p01.eloqua.com/api/REST/1.0/data/contacts?search=*gmail.com*&page=1&count=50&depth=minimal";

  request({ url: url, method: "GET", headers: { authorization: authenticationHeader } },
      function (error, responselogin1, bodydata1) {
          console.log(bodydata1);

          if (responselogin1.statusCode == 200) {
              res.status(200).send(bodydata1);

          }
      });

})



app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
