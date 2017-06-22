// Headers - start
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('mustache', mustacheExpress());

app.set('views', './views');
app.set('view engine', 'mustache');
//end

var jsonfile = require('jsonfile');
var file = 'data.json';

/* Write a blank array to Json File*/
let data = {
list : []
}
jsonfile.writeFile(file, data);

// Read the data from Json file
app.get("/", function (req, res){
  jsonfile.readFile(file, function(err, obj){
    if(err) {
      console.error("Error reading from Json file: "+ file);
      console.error(err.stack);
      process.exit(1);
    }
    res.render('index', obj);
  });
});

//Post Method - 1. writing the list 2. Modifying the completed flag
app.post("/", function (req, res){
  switch(req.body.action)
{
  case "todo" : // Add todo button
    let todo = {
       item: req.body.todo,
       marked:false,
       id:Math.floor(Math.random() * 50)
     };
   data.list.push(todo);
   jsonfile.writeFile(file,data);
   break;

  case "complete" : // Mark as complete
  
    let id = req.body.id_btn;
    for(var i in data.list){
      if(data.list[i].id == id){
        data.list[i].marked = true;
      }
    }
    jsonfile.writeFile(file, data);
    break;
}
    res.redirect('/');
 });


//Page ends
app.listen(3000, function(){
  console.log("App is running");
});
