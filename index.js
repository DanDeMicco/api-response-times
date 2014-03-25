var fs = require("fs");

exports = module.exports = function(filePath, regexUrl){
	//do some checking
	var errorStr = " is not a string";
	if(typeof filePath !== "string"){
		throw new Error("Paramater 1 (filePath) " + filePath + errorStr);
	}
	if(typeof regexUrl !== "string"){
		throw new Error("Paramater 2 (regexUrl) " + regexUrl+ errorStr);
	}
	var writeApiResponseTime = function(req, res, next){
		var regex = new RegExp(regexUrl);
		var matchingUrl = req.url.match(regex) || "";
		if(matchingUrl.length > 0){
		  	var start = process.hrtime();

		  	// event triggers when express is done sending response
			res.on("finish", function() {
			    var hrtime = process.hrtime(start);
			    var elapsed = parseFloat(hrtime[0] + (hrtime[1] / 1000000).toFixed(3), 10);
			    var date = new Date();

			    var responseStr = "\n" + date + " " + req.headers.host + req.url + " " + elapsed + "ms";
			    fs.appendFile(filePath, responseStr, function(err) {
				    if(err) {
				        throw new Error(err);
				    }
				});
			});
		}

		next();
	}

	return writeApiResponseTime;

}