###CS 398 final project###

We will be running a Team Fortress 2 game server that hooks into game events with a plugin that uses the modding framework SourceMod. This plugin will send data to our Node.js server which processes the data and pushes it out to clients. 

Clients will connect to the Node server to receive live pushed events in a simple web interface.

Server dependencies:  

* Node.js (make sure to run `npm install`)

Plugin dependencies:  

* [SourceMod](http://www.sourcemod.net/) (compiled against latest build of SourceMod 1.7, may work on lower versions)  
* [SMJansson](https://forums.alliedmods.net/showthread.php?t=184604)  
* [SMLib](https://www.sourcemodplugins.org/smlib/)  

###Running the project###
To run the project directly on a TF2 game server, start the Node server and follow the instructions in `plugin/README.md`.

For convenience, a testing interface that roughly mimics what the server would send has been provided in `test-interface.html`. Keep in mind that actions should follow the lifecycle diagram shown in `docs/lifecycle.png`, or unexpected results may occur.

Example testing flow:

* bootstrap  
* connect  
* join team  
* respawn  
* kill  
* score update  
* disconnect  
* round over

Sample videos:

[How to test](https://drive.google.com/file/d/0Bw6EJN31sy-RTG5tVTh3U1FraTA/view?usp=sharing)
server info is sent to defined as base_url in testScript.js

(Live video stream from game)(link when ready)

Technologies used:

* React
* Flux
* Sockets
* SourceMod
* Steam api
* javascript

Contributions:

* Eric: wrote plugin that goes into the game server and sends requests to the node server; hosted servers; designed project
* Michael: Found images on internet to represent classes
* Josh: Wrote scoreboard (components, actions, constants, team store, etc)
* Paul: Wrote web-testing interface; Made kill feed