#pragma semicolon 1
#include <sourcemod>
#include <steamtools>
#include <smjansson>

public Plugin:myinfo = {
    name = "TF2 Live Cast",
    author = "wchill",
    description = "Broadcasts TF2 game events to a web server",
    version = "1.0.0.0",
    url = "http://tf2.intense.io"
};

public OnPluginStart() {
    HookEvent("teamplay_round_start", Event_RoundStart, EventHookMode_PostNoCopy);
    HookEvent("player_connect", Event_PlayerConnect, EventHookMode_Post);
    HookEvent("player_disconnect", Event_PlayerDisconnect, EventHookMode_Pre);
    HookEvent("player_death", Event_PlayerDeath, EventHookMode_Post);
    HookEvent("player_spawn", Event_PlayerSpawn, EventHookMode_Post);
    HookEvent("player_changeclass", Event_PlayerChangeClass, EventHookMode_Post);
    HookEvent("player_team", Event_PlayerChangeTeam, EventHookMode_Post);
}

PostRequest(const String:endpoint, const String:data) {
    decl String:url[255];
    Format(url, sizeof(url), "http://tf2.intense.io/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request
    Steam_SetHTTPRequestGetOrPostParameter(request, "herp", "derp"); // Set post param "herp" value to "derp"
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_RoundStart(Handle:event, const String:name[], bool:dontBroadcast) {
    PrintToServer("[DEBUG] Round has started");
}

public Action:Event_PlayerConnect(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    decl String:networkid[64];
    GetEventString(event, "name", playername, sizeof(playername));
    GetEventString(event, "networkid", networkid, sizeof(networkid));
    new bot;
    GetEventInt(event, "bot", bot); 
    PrintToServer("[DEBUG] Player %s connected (%s, %d)", playername, networkid, bot);

    decl String:url[255];
    decl String:endpoint[] = "connected";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request
    if(StrEqual(networkid, "BOT")) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", playername);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", networkid);
    }
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_PlayerDeath(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:attacker[64];
    decl String:assister[64];
    decl String:victim[64];
    decl String:weapon[64];
    new victimid = GetEventInt(event, "userid");
    new attackerid = GetEventInt(event, "attacker");
    new assisterid = GetEventInt(event, "assister");
    GetClientName(GetClientOfUserId(victimid), victim, sizeof(victim));
    GetClientName(GetClientOfUserId(attackerid), attacker, sizeof(attacker));
    if(assisterid == -1) {
        GetEventString(event, "assister_fallback", assister, sizeof(assister));
    } else {
        GetClientName(GetClientOfUserId(assisterid), assister, sizeof(assister));
    }
    GetEventString(event, "weapon_logclassname", weapon, sizeof(weapon));
    PrintToServer("[DEBUG] Player %s killed %s with %s (assist %s)", attacker, victim, weapon, assister);
}

public Action:Event_PlayerSpawn(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    new playerid = GetEventInt(event, "userid");
    new teamid = GetEventInt(event, "team");
    new classid = GetEventInt(event, "class");
    GetClientName(GetClientOfUserId(playerid), playername, sizeof(playername));
    PrintToServer("[DEBUG] Player %s respawned on team %d as class %d", playername, teamid, classid);
}

public Action:Event_PlayerChangeClass(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    new playerid = GetEventInt(event, "userid");
    GetClientName(GetClientOfUserId(playerid), playername, sizeof(playername));
    new classid = GetEventInt(event, "class");
    PrintToServer("[DEBUG] Player %s changed class to %d", playername, classid);
}

public Action:Event_PlayerDisconnect(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    decl String:networkid[64];
    GetEventString(event, "name", playername, sizeof(playername));
    GetEventString(event, "networkid", networkid, sizeof(networkid));
    new bot = GetEventInt(event, "bot"); 
    PrintToServer("[DEBUG] Player %s disconnected (%s, %d)", playername, networkid, bot);

    decl String:url[255];
    decl String:endpoint[] = "disconnected";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request
    if(StrEqual(networkid, "BOT")) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", playername);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", networkid);
    }
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_PlayerChangeTeam(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    new bool:disconnect = GetEventBool(event, "disconnect");
    if(disconnect) return;
    new playerid = GetEventInt(event, "userid");
    GetClientName(GetClientOfUserId(playerid), playername, sizeof(playername));
    new newTeam = GetEventInt(event, "team");
    new oldTeam = GetEventInt(event, "oldteam");
    PrintToServer("[DEBUG] Player %s switched teams from %d to %d", playername, oldTeam, newTeam);
}

public OnRequestComplete(HTTPRequestHandle:request, bool:successful, HTTPStatusCode:status) {
    decl String:response[1024];
    Steam_GetHTTPResponseBodyData(request, response, sizeof(response)); // Get the response from the server
    Steam_ReleaseHTTPRequest(request); // Close the handle
}  
