# api-response-times
	
Records approximate api respoponse times to a file

## Example

See the test folder for a complete example. Basically just require the middleware and instantiate it with app.use where all your middlewares are. **Make sure you do this before your your routes.**

```node
var app = express();
var fileName = "./api_response_test.txt";
var urlStr = "/api/"
var responseTimes = require("api-response-times")(fileName, urlStr);
... fast forward to your middlwares
app.use(responseTimes);
...
```