var request = require('request');

var headers = {
    'Content-Type':     'application/json'
};

var base_url = "http://localhost:8000"

// Configure the request
var options = {
    url: '',
    method: 'POST',
    headers: headers,
    form: {}
};

// Start the request


(function() {
    setTimeout(function() {
        options.form = {
            attacker: 'Paul',
            victim: 'everyone',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked'
        }
        options.url = base_url + '/api/private/death';
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
      1000);

    setTimeout(function() {
        options.form = {
            player: 'Eric',
            class: 'Programmer'
        }
        options.url = base_url + '/api/private/respawn';
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
        options.form = {
            player: 'Josh'
        };
        options.url = base_url + '/api/private/connected';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
        
      },
      3000);

    setTimeout(function() {
        options.form = {
            player: 'Michael'
        };
        options.url = base_url + '/api/private/disconnected';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
        
      },
      4000);

    setTimeout(function() {
        options.form = {
            player: 'Bhuwan',
            team: 0
        };
        options.url = base_url + '/api/private/teamswitch';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
        
      },
      5000);

    setTimeout(function() {
        options.form = {
            red_score: 10,
            blue_score: 2,
            // Bhuwan too good
            winning_team: 0
        };
        options.url = base_url + '/api/private/roundover';
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
        })
        
      },
      6000);
})();