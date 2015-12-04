var express = require('express');
var app = express();
var bodyParser = require('body-parser');	

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://lululululu.cloudapp.net:27017/test';
var mongoose = require('mongoose');

app.post('/',function(req,res) 
{
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error :('));

	db.once('open', function (callback) 
	{
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err)
		{
       		if (err) 
       		{
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
       		//return json object here
			res.status(200).json({message: 'Insert done', id: r._id});
    	});
    });
});

app.delete('/restaurant_id/:id',function(req,res) 
{
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error:('));
	db.once('open', function (callback) 
	{
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id}).remove(function(err) 
		{
       		if (err) 
       		{
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', id: req.params.id});
    	});
    });
});

app.delete('/:field/:data',function(req,res) 
{
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error:('));
	db.once('open', function (callback) 
	{
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({req.params.field: req.params.data}).remove(function(err) 
		{
       		if (err) 
       		{
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', req.params.field: req.params.data});
    	});
    });
});

app.get('/restaurant_id/:id', function(req,res) 
{
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error:('));
	db.once('open', function (callback) 
	{
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results)
		{
       		if (err) 
       		{
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) 
			{
				res.status(200).json(results);
			}
			else 
			{
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});

app.get('/:field/:data', function(req,res) 
{
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error:('));
	db.once('open', function (callback) 
	{
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({req.params.field: req.params.data},function(err,results)
		{
       		if (err) 
       		{
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) 
			{
				res.status(200).json(results);
			}
			else 
			{
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});


//get data by --data : update by gradae
app.put('/restaurant_id/:id/grade',function(req,res)
{
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error:('));
	db.once('open', function (callback) 
	{
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results)
		{
       		if (err) 
       		{
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) 
			{	
				results.grades.date=req.body.date;
				results.grades.grade=req.body.grade;
				results.grades.score=req.body.score;


				res.status(200).json(results);
			}
			else 
			{
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});


app.listen(process.env.PORT || 8099);
