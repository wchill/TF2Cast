var bignum = require('bignum');

var _API_KEY = '8FB18602A84F393E886D7E47F8FCF2D1';
var _ID64_BASE = bignum('76561197960265728');
var _ID3_RE = /^\[U:1:([\d]+)\]$/;

var Steam = {
  convertID3ToID64: function (id3) {
    var modifier = steamID3.substring(5, steamID3.length);
    return _ID64_BASE.add(modifier).toString();
  },

  isValidID3: function (id3) {
    return _ID3_RE.test(steamdID3);
  },

  getPlayerSummaryURL: function(playerid) {
    var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=';
    url += _API_KEY + '&steamids=' + playerid;

    return url;
  }
};

module.exports = Steam;
