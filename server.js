const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => {
    // Parse the body of the request as JSON if Content-Type header is
      // application/json
    if(req.headers('Content-Type') === 'application/json' && reqBody) {
      req.body = JSON.parse(reqBody);

      // Parse the body of the request as x-www-form-urlencoded if Content-Type
      // header is x-www-form-urlencoded
    } else if(req.headers('Content-Type') === 'x-www-form-urlencoded' && reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Log the body of the request to the terminal
      console.log(req.body);
    }

    const resBody = {
      "Hello": "World!"
    };

    // Return the `resBody` object as JSON in the body of the response
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resBody));
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
