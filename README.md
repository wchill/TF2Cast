CS 398 final project

We will be running a Team Fortress 2 game server that hooks into game events with a plugin that uses the modding framework SourceMod. This plugin will send data to our Node.js server which processes the data and pushes it out to clients. 

Clients will connect to the Node server to receive live pushed events in a simple web interface.

Requires:

* Node.js  
* Socket.io (npm install socket.io)  
* [SourceMod](http://www.sourcemod.net/) (compiled against latest build of SourceMod 1.7, may work on lower versions)  
* [cURL for SourceMod](https://github.com/wchill/sm-ext-socket)  
