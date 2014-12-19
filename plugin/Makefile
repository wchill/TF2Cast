ROOT_DIR :=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

SOURCEMOD_DIR=/home/tf2server/serverfiles/tf/addons/sourcemod
SCRIPTING_DIR=$(SOURCEMOD_DIR)/scripting
COMPILER=$(SCRIPTING_DIR)/compile.sh
COMPILED_DIR=$(SCRIPTING_DIR)/compiled
PLUGIN_DIR=$(SOURCEMOD_DIR)/plugins

all: tf2cast.smx

tf2cast.smx: tf2cast.sp
	sudo -v
	sudo -u tf2server cp tf2cast.sp $(SCRIPTING_DIR)
	sudo -u tf2server $(COMPILER) tf2cast.sp
	sudo -u tf2server cp $(COMPILED_DIR)/tf2cast.smx $(PLUGIN_DIR)
	sudo -u tf2server cat $(COMPILED_DIR)/tf2cast.smx > tf2cast.smx
	sudo -u tf2server tmux send -t tf2-server "sm plugins unload_all" ENTER "sm plugins refresh" ENTER
