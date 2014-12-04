var request = require('request');

var headers = {
    'Content-Type':     'application/json'
};

var base_url = "http://localhost:8000"

// Configure the request
var options = {
    url: base_url + '/api/private/death',
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
                console.log(body);
            }
            else {
                console.log(error);
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

    setTimeout(function() {
        options.form = {};
        options.form.player = 'Eric';
        options.form.class = 'Programmer'
        options.url = base_url + '/api/private/respawn'
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
        
      },
      4000);
})();