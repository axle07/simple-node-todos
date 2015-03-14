var express = require("express"),
		app = express(),
		bodyParser = require('body-parser'),
		errorHandler = require('errorhandler'),
		methodOverride = require('method-override'),
		hostname = process.env.HOSTNAME || 'localhost',
		port = parseInt(process.env.PORT, 10) || 4567;

app.get("/", function (req, res) {
	res.redirect("/index.html");
});

var db = require('mongoskin').db('mongodb://accountUser:password@localhost:27017/todo'); 


app.get("/addtodo", function (req, res) {
	var x = req.query;
	var callback = function(error, result){
		if (!error) {
			res.end("added");
		}
	}
	db.collection("todo").insert(x, callback)
	res.end("added");
});

app.get("/deletetodo", function (req, res) {
	var index = req.query.index;
	var callback = function(error, result){
		if(!error) {
			res.end("deleted");
		}
	}
	db.collection("todo").remove( { "todoid" : index.toString()  }, callback);
});

app.get("/edittodo", function(req, res) {
	var index = req.query.index;
	//console.log(index);
	var newData = req.query.newData;
	var callback = function(error, result){
		if(!error) {
			res.end("edited");
		}
	}
	db.todo.update( { todoid : "1425319886645" },     {        $set: {          newtodo: "newer  data"       }      }, callback      )
	/*
	db.todo.update( { todoid : index.toString() },
		{
			$set: {
				newtodo: newData
			}
		}
		)
		*/
});

app.get("/listtodos", function (req, res) {
	db.collection("todo").find().toArray(function(err, result) {
		if (result)
	{
		res.end(JSON.stringify(result));
	}
	});
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
	dumpExceptions: true,
	showStack: true
}));

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port, hostname);
