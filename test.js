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
            victim: 'Michael',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 0,
            attacker_team: 1,
            spectator_team: 2
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
            attacker: 'Eric',
            victim: 'Michael',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 0,
            attacker_team: 1,
            spectator_team: 2
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
      1500);
    setTimeout(function() {
        options.form = {
            attacker: 'Josh',
            victim: 'Eric',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 1,
            attacker_team: 0,
            spectator_team: 2
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
      2000);
    setTimeout(function() {
        options.form = {
            attacker: 'Bhuwan',
            victim: 'Josh',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 1,
            attacker_team: 0,
            spectator_team: 2
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
      2500);
    setTimeout(function() {
        options.form = {
            attacker: 'Jose',
            victim: 'Peanut',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 0,
            attacker_team: 1,
            spectator_team: 2
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
      3000);
    setTimeout(function() {
        options.form = {
            attacker: 'Josh',
            victim: 'Michael',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 1,
            attacker_team: 0,
            spectator_team: 2
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
      3500);
    setTimeout(function() {
        options.form = {
            attacker: 'Eric',
            victim: 'Eric',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 0,
            attacker_team: 1,
            spectator_team: 2
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
      4000);
    setTimeout(function() {
        options.form = {
            attacker: 'Micahel',
            victim: 'Paul',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 0,
            attacker_team: 1,
            spectator_team: 2
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
      4500);
    setTimeout(function() {
        options.form = {
            attacker: 'Josh',
            victim: 'Bhuwan',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 0,
            attacker_team: 1,
            spectator_team: 2
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
      5000);
    setTimeout(function() {
        options.form = {
            attacker: 'Paul',
            victim: 'Everyone',
            assister: 'nobody',
            weapon: 'code',
            death_type: 'hacked',
            victim_team: 1,
            attacker_team: 0,
            spectator_team: 2
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
      6000);

    /*
    setTimeout(function() {
        options.form = {
            player: 'Eric',
            class: 'Programmer',
            team: 1
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
            player: 'Josh',
            team: 1
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
            player: 'Michael',
            team: 2
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
    */
})();