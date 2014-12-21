var bignum = require('browserify-bignum');

// Get an API key from here
// http://steamcommunity.com/dev/apikey
var _API_KEY = 'Replace with your own Steam API Key';
var _ID64_BASE = bignum('76561197960265728');
var _ID3_RE = /^\[U:1:([\d]+)\]$/;

// Verify the id is of the form [U:1:XXXXX] where XXXXX is a variable length
// number
var isValidID3 = function (id3) {
    return id3.length > 6 && _ID3_RE.test(id3);
};

var Steam = {
  // Convert from Steam's ID3 format to the newer ID64
  convertID3ToID64: function (id3) {
    var modifier = id3.substring(5, id3.length-1);
    return _ID64_BASE.add(modifier).toString();
  },

  isValidID3: function (id3) {
    return id3.length > 6 && id3[0] == '[' && _ID3_RE.test(id3);
  },

  areValidID3s: function(id3s) {
    var valid = true;
    id3s.forEach(function(id3) {
      if (!isValidID3(id3)) {
        valid = false;
      }
    });

    return valid;
  },

  // Used to retrieve a player's persona name and their avatar
  getPlayerSummaryURL: function(playerid) {
    var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=';
    url += _API_KEY + '&steamids=' + playerid;

    return url;
  }
};

module.exports = Steam;
