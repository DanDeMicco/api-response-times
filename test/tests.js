var request = require("supertest")
  , express = require("express")
  , expect = require("expect.js")
  , fs = require("fs");

/**
* Instantiate the middelware
*/
var app = express();
var fileName = "./api_response_test.txt";
var urlStr = "/api/"
var responseTimes = require("../index.js")(fileName, urlStr);

before(function(){
	/**
	* plug the middleware in
	*/
	app.use(responseTimes);

	/**
	* Some mock routes with set timeouts to simulate a large async function
	*/
	app.get('/api/user', function(req, res){
		setTimeout(function(){
			res.send(201, { name: 'tobi' });
		}, 1400);
	  	
	});

	app.get('/api/user2', function(req, res){
	  	setTimeout(function(){
			res.send(201, { name: 'tobi2' });
		}, 1500);
	});

	app.get('/user', function(req, res){
		setTimeout(function(){
			res.send(201, { name: 'tobi3' });
		}, 1000);
	});

});

/**
* The tests
*/
describe("GET /api/user", function(){
	var file;
	it("should write to the file", function(done){
		//get some info about the file
		file = fs.readFileSync(fileName, {encoding: "utf8"});
		//do the request
		request(app)
		  .get('/api/user')
		  .end(function(err, res){
		    if (err) throw err;
		    expect(res.statusCode).to.equal(201);
		    expect(res.body.name).to.equal("tobi");
		    done();
		  });
	});
	it("should have appended to the file", function(done){
		var file2 = fs.readFileSync(fileName, {encoding: "utf8"});
		expect(file.length).to.be.lessThan(file2.length);
		done();
	});
});

describe("GET /api/user2", function(){
	var file;
	it("should write to the file", function(done){
		//get some info about the file
		file = fs.readFileSync(fileName, {encoding: "utf8"});
		//do the request
		request(app)
		  .get('/api/user2')
		  .end(function(err, res){
		    if (err) throw err;
		    expect(res.statusCode).to.equal(201);
		    expect(res.body.name).to.equal("tobi2");
		    done();
		  });
	});
	it("should have appended to the file", function(done){
		var file2 = fs.readFileSync(fileName, {encoding: "utf8"});
		expect(file.length).to.be.lessThan(file2.length);
		done();
	});
});

describe("GET /user", function(){
	var file;
	it("should NOT write to the file", function(done){
		//get some info about the file
		file = fs.readFileSync(fileName, {encoding: "utf8"});
		//do the request
		request(app)
		  .get('/user')
		  .end(function(err, res){
		    if (err) throw err;
		    expect(res.statusCode).to.equal(201);
		    expect(res.body.name).to.equal("tobi3");
		    done();
		  });
	});
	it("should NOT have appended to the file", function(done){
		var file2 = fs.readFileSync(fileName, {encoding: "utf8"});
		expect(file.length).to.equal(file2.length);
		done();
	});
});

describe("failures", function(){
	it("should throw an err", function(){
		var fileName = {test: "./api_response_test.txt"};
		try{
			var test = require("../index.js")(fileName, urlStr);
		}
		catch(err){
			expect(err).to.be.ok();
		}
	});
	it("should throw an err", function(){
		var urlStr = { test : ""};
		try{
			require("../index.js")(fileName, urlStr);
		}
		catch(err){
			expect(err).to.be.ok();
		}
	});
	it("should NOT throw an err", function(){
		var test = require("../index.js")(fileName, urlStr);
		expect(test).to.be.a('function');
	});


});

describe("GET /api/user different regex", function(){
	/**
	* Overwrite the previous express
	*/
	var app = express();
	var file;
	var urlStr2 = ""; //matches all
	var responseTimes2 = require("../index.js")(fileName, urlStr2);


	before(function(){
		app.use(responseTimes2);

		/**
		* Some mock routes with set timeouts to simulate a large async function
		*/
		app.get('/api/user', function(req, res){
			setTimeout(function(){
				res.send(201, { name: 'tobi4' });
			}, 1400);
		  	
		});

		app.get('/user', function(req, res){
			setTimeout(function(){
				res.send(201, { name: 'tobi5' });
			}, 1000);
		});
	});


	it("should write to the file", function(done){
		//get some info about the file
		file = fs.readFileSync(fileName, {encoding: "utf8"});
		//do the request
		request(app)
		  .get('/api/user')
		  .end(function(err, res){
		    if (err) throw err;
		    expect(res.statusCode).to.equal(201);
		    expect(res.body.name).to.equal("tobi4");
		    done();
		  });
	});
	it("should have appended to the file", function(done){
		var file2 = fs.readFileSync(fileName, {encoding: "utf8"});
		expect(file.length).to.be.lessThan(file2.length);
		done();
	});
	it("should write to the file", function(done){
		//get some info about the file
		file = fs.readFileSync(fileName, {encoding: "utf8"});
		//do the request
		request(app)
		  .get('/user')
		  .end(function(err, res){
		    if (err) throw err;
		    expect(res.statusCode).to.equal(201);
		    expect(res.body.name).to.equal("tobi5");
		    done();
		  });
	});
	it("should have appended to the file", function(done){
		var file2 = fs.readFileSync(fileName, {encoding: "utf8"});
		expect(file.length).to.be.lessThan(file2.length);
		done();
	});
});

