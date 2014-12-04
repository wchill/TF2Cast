To build plugin:

* Set up a TF2 server ([you can use this script to do this quickly](http://danielgibbs.co.uk/lgsm/tf2server/)). Make sure the server is running under the user `tf2server` (this is done for security reasons). You can start the server using the command `~/tf2server start`  
* Install SourceMod and MetaMod on the TF2 server instance.  
* Copy SMJansson to `/home/tf2server/serverfiles/tf/addons/sourcemod/` - `smjansson.ext.so` goes in `extensions` while `smjansson.inc` goes in `scripting/include`.  
* Make sure your user has `sudo` access  
* Run `make` in the `plugin` directory, the plugin will be compiled using the SourcePawn compiler included in SourceMod and loaded automatically into the running server instance.

For convenience, `manage.sh` will allow you to easily control the TF2 server (same as running `~/tf2server` while logged in as `tf2server`), and `tf2-tmux.sh` will allow you to operate the TF2 server console.