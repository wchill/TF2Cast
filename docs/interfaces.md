# Interfaces

### POST /api/private/bootstrap

Bootstrap the Node server with an initial state, such as when a new map is loaded.

#### Request Parameters

Request body data | Value type | Value
---|---|---
map_name | dictionary | The name of the map currently being played
map_time | int | The amount of time left for this map in seconds, or -1 if no time limit is set
red_wins | int | The number of wins by the RED team
blu_wins | int | The number of wins by the BLU team
red_players | array | A JSON array containing the list of players on the RED team
blu_players | array | A JSON array containing the list of players on the BLU team
spectators | array | A JSON array containing the list of players spectating

### POST /api/private/death

Notify the server of a player death.

#### Request Parameters

Request body data | Value type | Value
---|---|---
victim | string | The Steam ID of the player killed
attacker | string | The Steam ID of the player who made the kill
assister | string | The Steam ID of the player who assisted in the kill, if any, or an empty string if there was no assist
weapon | string | The name of the weapon used to kill
death_type | int | An integer identifying the type of death
victim_team | int | team the player who died was on (0 for RED, 1 for BLU, 2 for spectator)
attacker_team | int | team the player was who attacked was on (0 for RED, 1 for BLU, 2 for spectator)
assister_team | int | team the player was who assisted was on (0 for RED, 1 for BLU, 2 for spectator)

### POST /api/private/respawn

Notify the server of a player respawn.

#### Request parameters

Request body data | Value type | Value
---|---|---
player | string | The Steam ID of the respawned player
team | int | team the player was on (0 for RED, 1 for BLU, 2 for spectator)
class | string | The name of the player's new class

### POST /api/private/connected

Notify the server of a player connect.

#### Request Parameters

Request body data | Value type | Value
---|---|---
player | string | The Steam ID of the player who connected
team | int | team the player was on (0 for RED, 1 for BLU, 2 for spectator)

### POST /api/private/disconnected

Notify the server of a player disconnect.

#### Request Parameters

Request body data | Value type | Value
---|---|---
player | string | The Steam ID of the player who disconnected
team | int | team the player was on (0 for RED, 1 for BLU, 2 for spectator)

### POST /api/private/teamswitch

Notify the server of a player switching teams.

#### Request parameters

Request body data | Value type | Value
---|---|---
player | string | The Steam ID of the player who switched teams
team | int | An int representing the player's new team (0 for RED, 1 for BLU, 2 for spectator)

### POST /api/private/playerscores

Notify the server of newly updated player scores.

#### Request parameters

Request body data | Value type | Value
---|---|---
red_players | array | A JSON array containing RED players' Steam IDs and their corresponding scores
blu_players | array | A JSON array containing BLU players' Steam IDs and their corresponding scores

### POST /api/private/roundover

Notify the server of a finished round and the new scores.

#### Request parameters

Request body data | Value type | Value
---|---|---
winning_team | int | 0 if RED won, 1 if BLU won, or -1 if the game was a tie
red_score | int | RED's new score
blu_score | int | BLU's new score
