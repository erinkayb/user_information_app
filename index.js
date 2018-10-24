const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))


// GET A LIST OF ALL USERS
app.get("/", (req, res) => {
    fs.readFile('./users.json', function(err, data) {
        if (err) { throw err };
        var obj = JSON.parse(data);
        res.render("index", { user: obj });
    })
})

// SEARCH FOR A USER
app.get('/search', function (req, res){
	res.render('search')
})

app.post('/search', function (req, res){
  fs.readFile('./users.json', function(err, data) {
      if (err) { throw err };
      var obj = JSON.parse(data);
      res.render('searchresults', { data:req.body, users:obj });
       // loop through obj and find searchbar item
  })
})

app.post('/ajax', (req, res) => {
  fs.readFile('./users.json', function(err, data) {
      if (err) { throw err };
      var obj = JSON.parse(data);
      var searchresults = [];
      var searchedItem = req.body.searchbar;
      for (let i = 0; i < obj.length; i++) {
        if(obj[i].firstname.toLowerCase().indexOf(searchedItem.toLowerCase()) > -1 || obj[i].lastname.toLowerCase().indexOf(searchedItem.toLowerCase()) > -1 ){
           searchresults.push(obj[i]);
        }
      }
      res.send( searchresults );
      console.log(searchresults);
  console.log(req.query.input);
})
})



// ADD A NEW USER
app.get('/newuser', function (req, res){
	res.render('newuser')
})

app.post('/newuser', function (req, res){
  let newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  }
  fs.readFile('./users.json', function(err, data) {
      if (err) { throw err };
      var obj = JSON.parse(data);
      obj.push(newUser);
      var stringifyData = JSON.stringify(obj);

  fs.writeFile('./users.json', stringifyData, (err, data) => {
      if (err) { throw err };
      console.log('Data was written');
  })
})
res.redirect('/')
})


// LISTENING PORT
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
