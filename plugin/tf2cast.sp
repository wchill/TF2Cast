#pragma semicolon 1
#include <sourcemod>
#include <steamtools>
#include <smjansson>
#include <smlib>
#include <tf2_stocks>

public Plugin:myinfo = {
    name = "TF2 Live Cast",
    author = "wchill",
    description = "Broadcasts TF2 game events to a web server",
    version = "1.0.0.0",
    url = "http://tf2.intense.io"
};

new isTimerRunning = 0;

public OnPluginStart() {
    HookEvent("teamplay_round_active", Event_RoundStart, EventHookMode_PostNoCopy);
//    HookEvent("player_connect", Event_PlayerConnect, EventHookMode_Post);
    HookEvent("player_disconnect", Event_PlayerDisconnect, EventHookMode_Pre);
    HookEvent("player_death", Event_PlayerDeath, EventHookMode_Post);
    HookEvent("player_spawn", Event_PlayerSpawn, EventHookMode_Post);
    HookEvent("player_changeclass", Event_PlayerChangeClass, EventHookMode_Post);
    HookEvent("player_team", Event_PlayerChangeTeam, EventHookMode_Post);
    HookEvent("teamplay_round_win", Event_RoundOver, EventHookMode_Post);
    RegAdminCmd("sm_bootstrap", Command_Bootstrap, ADMFLAG_SLAY, "Bootstraps the Node server");
}

public Action:Command_Bootstrap(client, args) {
    PrintToServer("Bootstrapping Node");
    decl String:url[255];
    decl String:endpoint[] = "bootstrap";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url);

    decl String:mapname[64];
    GetCurrentMap(mapname, sizeof(mapname));
    Steam_SetHTTPRequestGetOrPostParameter(request, "map_name", mapname);

    new timeleft;
    GetMapTimeLeft(timeleft);
    decl String:maptimestr[32];
    Format(maptimestr, sizeof(maptimestr), "%d", timeleft);
    Steam_SetHTTPRequestGetOrPostParameter(request, "map_time", maptimestr); 
    
    new redteamscore = GetTeamScore(2);
    decl String:redscorestr[32];
    Format(redscorestr, sizeof(redscorestr), "%d", redteamscore);
    Steam_SetHTTPRequestGetOrPostParameter(request, "red_wins", redscorestr);

    new bluteamscore = GetTeamScore(3);
    decl String:bluscorestr[32];
    Format(bluscorestr, sizeof(bluscorestr), "%d", bluteamscore);
    Steam_SetHTTPRequestGetOrPostParameter(request, "blu_wins", bluscorestr);

    new offset = FindSendPropOffs("CTFPlayerResource", "m_iTotalScore");
    new resourceent = FindResourceObject();

    new Handle:redteam = json_array();
    new Handle:bluteam = json_array();
    new Handle:specteam = json_array();

    for(new i = 1; i <= MaxClients; i++) {
        if(!Client_MatchesFilter(i, CLIENTFILTER_INGAME)) {
            continue;
        }
        new Handle:player = json_object();
        new String:networkid[64];
        GetClientAuthId(i, AuthId_Steam3, networkid, sizeof(networkid));
        if(strlen(networkid) < 7) {
            Format(networkid, sizeof(networkid), "%N", i);
        }
        decl String:classname[64];
        new TFClassType:class = TF2_GetPlayerClass(i);
        if(class == TFClass_Scout) {
            strcopy(classname, sizeof(classname), "Scout");
        } else if(class == TFClass_Sniper) {
            strcopy(classname, sizeof(classname), "Sniper");
        } else if(class == TFClass_Soldier) {
            strcopy(classname, sizeof(classname), "Soldier");
        } else if(class == TFClass_DemoMan) {
            strcopy(classname, sizeof(classname), "Demoman");
        } else if(class == TFClass_Medic) {
            strcopy(classname, sizeof(classname), "Medic");
        } else if(class == TFClass_Heavy) {
            strcopy(classname, sizeof(classname), "Heavy");
        } else if(class == TFClass_Pyro) {
            strcopy(classname, sizeof(classname), "Pyro");
        } else if(class == TFClass_Spy) {
            strcopy(classname, sizeof(classname), "Spy");
        } else if(class == TFClass_Engineer) {
            strcopy(classname, sizeof(classname), "Engineer");
        } else {
            strcopy(classname, sizeof(classname), "Unknown");
        }
        json_object_set_new(player, "player", json_string(networkid));
        json_object_set_new(player, "score", json_integer(GetEntData(resourceent, offset + (i * 4), 4)));
        json_object_set_new(player, "charClass", json_string(classname));
        decl String:playerjson[4096];
        json_dump(player, playerjson, sizeof(playerjson));
        PrintToServer(playerjson);
        new team = GetClientTeam(i);
        if(team == 1) {
            json_array_append_new(specteam, player);
        } else if(team == 2) {
            json_array_append_new(redteam, player);
        } else if(team == 3) {
            json_array_append_new(bluteam, player);
        } else {
            CloseHandle(player);
        }
    }
    new String:redjson[4096];
    new String:blujson[4096];
    new String:specjson[4096];
    json_dump(redteam, redjson, sizeof(redjson));
    json_dump(bluteam, blujson, sizeof(blujson));
    json_dump(specteam, specjson, sizeof(specjson));

    Steam_SetHTTPRequestGetOrPostParameter(request, "red_players", redjson);
    Steam_SetHTTPRequestGetOrPostParameter(request, "blu_players", blujson);
    Steam_SetHTTPRequestGetOrPostParameter(request, "spectators", specjson);
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
    CloseHandle(redteam);
    CloseHandle(bluteam);
    CloseHandle(specteam);
    if(!isTimerRunning) {
        isTimerRunning = 1;
        CreateTimer(5.0, Timer_UpdateScores, _, TIMER_REPEAT);
    }
}

public Action:Event_RoundStart(Handle:event, const String:name[], bool:dontBroadcast) {
    PrintToServer("[DEBUG] Round has started");
    PrintToChatAll("[DEBUG] Round has started");
    Command_Bootstrap(0, 0);
}

public Action:Timer_UpdateScores(Handle:timer) {
    if(!isTimerRunning) return Plugin_Stop;
    decl String:url[255];
    decl String:endpoint[] = "playerscores";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url);

    new offset = FindSendPropOffs("CTFPlayerResource", "m_iTotalScore");
    new resourceent = FindResourceObject();

    new Handle:redteam = json_array();
    new Handle:bluteam = json_array();
    new Handle:specteam = json_array();

    for(new client = 1; client <= MaxClients; client++) {
        if(!Client_MatchesFilter(client, CLIENTFILTER_INGAME)) {
            continue;
        }
        new Handle:player = json_object();
        new String:networkid[64];
        GetClientAuthId(client, AuthId_Steam3, networkid, sizeof(networkid));
        if(strlen(networkid) < 7) {
            Format(networkid, sizeof(networkid), "%N", client);
        }
        decl String:classname[64];
        new TFClassType:class = TF2_GetPlayerClass(client);
        if(class == TFClass_Scout) {
            strcopy(classname, sizeof(classname), "Scout");
        } else if(class == TFClass_Sniper) {
            strcopy(classname, sizeof(classname), "Sniper");
        } else if(class == TFClass_Soldier) {
            strcopy(classname, sizeof(classname), "Soldier");
        } else if(class == TFClass_DemoMan) {
            strcopy(classname, sizeof(classname), "Demoman");
        } else if(class == TFClass_Medic) {
            strcopy(classname, sizeof(classname), "Medic");
        } else if(class == TFClass_Heavy) {
            strcopy(classname, sizeof(classname), "Heavy");
        } else if(class == TFClass_Pyro) {
            strcopy(classname, sizeof(classname), "Pyro");
        } else if(class == TFClass_Spy) {
            strcopy(classname, sizeof(classname), "Spy");
        } else if(class == TFClass_Engineer) {
            strcopy(classname, sizeof(classname), "Engineer");
        } else {
            strcopy(classname, sizeof(classname), "Unknown");
        }
        json_object_set_new(player, "player", json_string(networkid));
        json_object_set_new(player, "score", json_integer(GetEntData(resourceent, offset + (client * 4), 4)));
        json_object_set_new(player, "charClass", json_string(classname));
        new team = GetClientTeam(client);
        if(team == 1) {
            json_array_append_new(specteam, player);
        } else if(team == 2) {
            json_array_append_new(redteam, player);
        } else if(team == 3) {
            json_array_append_new(bluteam, player);
        }
    }
    new String:redjson[2048];
    new String:blujson[2048];
    new String:specjson[2048];
    json_dump(redteam, redjson, sizeof(redjson));
    json_dump(bluteam, blujson, sizeof(blujson));
    json_dump(specteam, specjson, sizeof(specjson));

    Steam_SetHTTPRequestGetOrPostParameter(request, "red_players", redjson);
    Steam_SetHTTPRequestGetOrPostParameter(request, "blu_players", blujson);
    Steam_SetHTTPRequestGetOrPostParameter(request, "spectators", specjson);
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
    CloseHandle(redteam);
    CloseHandle(bluteam);
    CloseHandle(specteam);
    return Plugin_Continue;
}

public OnClientPostAdminCheck(client) {
    decl String:networkid[64];
    GetClientAuthId(client, AuthId_Steam3, networkid, sizeof(networkid));
    decl String:playername[64];
    Format(playername, sizeof(playername), "%N", client);
    PrintToServer("[DEBUG] Player %s connected (%s)", playername, networkid);
    PrintToChatAll("[DEBUG] Player %s connected (%s)", playername, networkid);

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
    new victimid = GetClientOfUserId(GetEventInt(event, "userid"));
    new attackerid = GetClientOfUserId(GetEventInt(event, "attacker"));
    new assisterid = GetEventInt(event, "assister");
    if(assisterid != -1) {
        assisterid = GetClientOfUserId(assisterid);
    }
    GetClientName(victimid, victim, sizeof(victim));
    GetClientName(attackerid, attacker, sizeof(attacker));
    if(assisterid == -1) {
        GetEventString(event, "assister_fallback", assister, sizeof(assister));
    } else {
        GetClientName(assisterid, assister, sizeof(assister));
    }
    GetEventString(event, "weapon_logclassname", weapon, sizeof(weapon));
    PrintToServer("[DEBUG] Player %s killed %s with %s (assist %s)", attacker, victim, weapon, assister);
    PrintToChatAll("[DEBUG] Player %s killed %s with %s (assist %s)", attacker, victim, weapon, assister);

    decl String:url[255];
    decl String:endpoint[] = "death";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request

    decl String:victimnetworkid[64];
    GetClientAuthId(victimid, AuthId_Steam3, victimnetworkid, sizeof(victimnetworkid));

    decl String:attackernetworkid[64];
    GetClientAuthId(attackerid, AuthId_Steam3, attackernetworkid, sizeof(attackernetworkid));

    decl String:assisternetworkid[64];
    if(assisterid != -1) {
        GetClientAuthId(assisterid, AuthId_Steam3, assisternetworkid, sizeof(assisternetworkid));
    } else {
        GetEventString(event, "assister_fallback", assisternetworkid, sizeof(assisternetworkid));
    }

    //PrintToServer("Victim (%s)(%s)(%d)", victim, victimnetworkid, victimid);
    if(strlen(victimnetworkid) < 7) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "victim", victim);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "victim", victimnetworkid);
    }

    if(strlen(attackernetworkid) < 7) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "attacker", attacker);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "attacker", attackernetworkid);
    }

    if(strlen(assisternetworkid) < 7) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "assister", assister);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "assister", assisternetworkid);
    }

    decl String:tmp1[4];
    Format(tmp1, sizeof(tmp1), "%d", GetClientTeam(victimid) - 2);
    decl String:tmp2[4];
    Format(tmp2, sizeof(tmp2), "%d", GetClientTeam(attackerid) - 2);
    decl String:tmp3[4];
    if(assisterid != -1) {
        Format(tmp3, sizeof(tmp3), "%d", GetClientTeam(assisterid) - 2);
    } else {
        tmp3[0] = 0;
    }
    decl String:tmp4[4];
    Format(tmp4, sizeof(tmp4), "%d", GetEventInt(event, "death_flags"));
    Steam_SetHTTPRequestGetOrPostParameter(request, "victim_team", tmp1);
    Steam_SetHTTPRequestGetOrPostParameter(request, "attacker_team", tmp2);
    Steam_SetHTTPRequestGetOrPostParameter(request, "assister_team", tmp3);
    Steam_SetHTTPRequestGetOrPostParameter(request, "weapon", weapon);
    Steam_SetHTTPRequestGetOrPostParameter(request, "death_type", tmp4);
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_PlayerSpawn(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    new playerid = GetEventInt(event, "userid");
    new teamid = GetEventInt(event, "team") - 2;
    new classid = GetEventInt(event, "class");
    GetClientName(GetClientOfUserId(playerid), playername, sizeof(playername));
    PrintToServer("[DEBUG] Player %s respawned on team %d as class %d", playername, teamid, classid);
    PrintToChatAll("[DEBUG] Player %s respawned on team %d as class %d", playername, teamid, classid);

    decl String:classname[64];
    if(classid == 1) {
        strcopy(classname, sizeof(classname), "Scout");
    } else if(classid == 2) {
        strcopy(classname, sizeof(classname), "Sniper");
    } else if(classid == 3) {
        strcopy(classname, sizeof(classname), "Soldier");
    } else if(classid == 4) {
        strcopy(classname, sizeof(classname), "Demoman");
    } else if(classid == 5) {
        strcopy(classname, sizeof(classname), "Medic");
    } else if(classid == 6) {
        strcopy(classname, sizeof(classname), "Heavy");
    } else if(classid == 7) {
        strcopy(classname, sizeof(classname), "Pyro");
    } else if(classid == 8) {
        strcopy(classname, sizeof(classname), "Spy");
    } else if(classid == 9) {
        strcopy(classname, sizeof(classname), "Engineer");
    } else {
        strcopy(classname, sizeof(classname), "Unknown");
    }

    decl String:networkid[64];
    new clientid = GetClientOfUserId(playerid);
    GetClientAuthId(clientid, AuthId_Steam3, networkid, sizeof(networkid));

    decl String:url[255];
    decl String:endpoint[] = "respawn";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request
    if(strlen(networkid) < 7) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", playername);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", networkid);
    }
    decl String:tmp[4];
    Format(tmp, sizeof(tmp), "%d", teamid);
    Steam_SetHTTPRequestGetOrPostParameter(request, "team", tmp);
    Steam_SetHTTPRequestGetOrPostParameter(request, "charClass", classname); 
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_PlayerChangeClass(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    new playerid = GetEventInt(event, "userid");
    new clientid = GetClientOfUserId(playerid);
    GetClientName(clientid, playername, sizeof(playername));
    decl String:networkid[64];
    GetClientAuthId(clientid, AuthId_Steam3, networkid, sizeof(networkid));
    new class = GetEventInt(event, "class");
    decl String:classname[64];
    if(class == 1) {
        strcopy(classname, sizeof(classname), "Scout");
    } else if(class == 2) {
        strcopy(classname, sizeof(classname), "Sniper");
    } else if(class == 3) {
        strcopy(classname, sizeof(classname), "Soldier");
    } else if(class == 4) {
        strcopy(classname, sizeof(classname), "Demoman");
    } else if(class == 5) {
        strcopy(classname, sizeof(classname), "Medic");
    } else if(class == 6) {
        strcopy(classname, sizeof(classname), "Heavy");
    } else if(class == 7) {
        strcopy(classname, sizeof(classname), "Pyro");
    } else if(class == 8) {
        strcopy(classname, sizeof(classname), "Spy");
    } else if(class == 9) {
        strcopy(classname, sizeof(classname), "Engineer");
    } else {
        strcopy(classname, sizeof(classname), "Unknown");
    }
    PrintToServer("[DEBUG] Player %s changed class to %s", playername, classname);
    PrintToChatAll("[DEBUG] Player %s changed class to %s", playername, classname);

    decl String:url[255];
    decl String:endpoint[] = "disconnected";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request
    if(StrEqual(networkid, "BOT")) {
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", playername);
    } else {
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", playername);
    }
    Steam_SetHTTPRequestGetOrPostParameter(request, "charClass", classname);
    Steam_SetHTTPRequestGetOrPostParameter(request, "team", "-1");
//    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_PlayerDisconnect(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:playername[64];
    decl String:networkid[64];
    GetEventString(event, "name", playername, sizeof(playername));
    new clientid = GetClientOfUserId(GetEventInt(event, "userid"));
    GetClientAuthId(clientid, AuthId_Steam3, networkid, sizeof(networkid));
    new bot = GetEventInt(event, "bot"); 
    PrintToServer("[DEBUG] Player %s disconnected (%s, %d)", playername, networkid, bot);
    PrintToChatAll("[DEBUG] Player %s disconnected (%s, %d)", playername, networkid, bot);

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
    if(oldTeam > 1)
        oldTeam -= 2;
    else if(oldTeam == 1)
        oldTeam = 2;
    if(newTeam > 1)
        newTeam -= 2;
    else if(newTeam == 1)
        newTeam = 2;
    PrintToServer("[DEBUG] Player %s switched teams from %d to %d", playername, oldTeam, newTeam);
    PrintToChatAll("[DEBUG] Player %s switched teams from %d to %d", playername, oldTeam, newTeam);

    decl String:networkid[64];
    new clientid = GetClientOfUserId(playerid);
    GetClientAuthId(clientid, AuthId_Steam3, networkid, sizeof(networkid));

    decl String:url[255];
    decl String:endpoint[] = "teamswitch";
    Format(url, sizeof(url), "http://tf2.intense.io:8000/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url); // Create the HTTP request
    if(StrEqual(networkid, "BOT")) {
        // bots don't have a Steam ID, so just send their name
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", playername);
    } else {
        // Send the player's Steam ID
        Steam_SetHTTPRequestGetOrPostParameter(request, "player", networkid);
    }
    decl String:tmp[4];
    Format(tmp, sizeof(tmp), "%d", newTeam);
    Steam_SetHTTPRequestGetOrPostParameter(request, "team", tmp);
    Steam_SendHTTPRequest(request, OnRequestComplete); // Send the request
}

public Action:Event_RoundOver(Handle:event, const String:name[], bool:dontBroadcast) {
    decl String:url[255];
    decl String:endpoint[] = "roundover";
    Format(url, sizeof(url), "http://tf2.intense.io/api/private/%s", endpoint);
    new HTTPRequestHandle:request = Steam_CreateHTTPRequest(HTTPMethod_POST, url);

    new winner = GetEventInt(event, "team") - 2;
    decl String:winnerstr[32];
    Format(winnerstr, sizeof(winnerstr), "%d", winner);
    Steam_SetHTTPRequestGetOrPostParameter(request, "winning_team", winnerstr);

    new redteamscore = GetTeamScore(2);
    decl String:redscorestr[32];
    Format(redscorestr, sizeof(redscorestr), "%d", redteamscore);
    Steam_SetHTTPRequestGetOrPostParameter(request, "red_wins", redscorestr);

    new bluteamscore = GetTeamScore(3);
    decl String:bluscorestr[32];
    Format(bluscorestr, sizeof(bluscorestr), "%d", bluteamscore);
    Steam_SetHTTPRequestGetOrPostParameter(request, "blu_wins", bluscorestr);
    Steam_SendHTTPRequest(request, OnRequestComplete);
}

public OnRequestComplete(HTTPRequestHandle:request, bool:successful, HTTPStatusCode:status) {
//    decl String:response[1024];
//    Steam_GetHTTPResponseBodyData(request, response, sizeof(response)); // Get the response from the server
    Steam_ReleaseHTTPRequest(request); // Close the handle
}  

stock FindResourceObject(){
    new i, String:classname[64];
    
    for(i = GetMaxClients(); i <= GetMaxEntities(); i++){
        if(IsValidEntity(i)){
            GetEntityNetClass(i, classname, 64);
            if(StrEqual(classname, "CTFPlayerResource")){
                    return i;
            }
        }
    }
    return 0;
}
