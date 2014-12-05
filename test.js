var request = require('request');

var headers = {
    'Content-Type':     'application/json'
};

// Configure the request
var options = {
    url: 'http://localhost:8000/api/private/death',
    method: 'POST',
    headers: headers,
    form: {'killer': 'Paul', 'killed': ''}
};

// Start the request


(function() {
    setTimeout(function() {
        options.form.killed = 'one person';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })

      },
      1000);

    setTimeout(function() {
        options.form.killed = 'two people';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })

      },
      2000);

    setTimeout(function() {
        options.form.killed = 'all the people';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
        
      },
      3000);
})();