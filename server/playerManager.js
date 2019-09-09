// Manages the list of players connected to the server.
var mapManager = require('./mapManager');

var PlayerManager = function() {
    this.players = [];
    this.TICK = 1000;
    this.deletionsNeeded = false;
    this.updateNeeded = true;
    this.ticker = null;
};

PlayerManager.prototype.addPlayer = function(socket) {
    var player = function(socket) {
        this.row = mapManager.getRandomNum();
        this.col = mapManager.getRandomNum();
        this.id = Date.now() % 1000000;
        this.deleteMe = false;
        this.socket = socket;
        this.packagePlayerData = function() {
            return { row: this.row, col: this.col, id: this.id };
        };
    };
    var p = new player(socket);
    this.attachSocketListeners(p);
    this.players.push(p);
    this.updateNeeded = true;
};

PlayerManager.prototype.attachSocketListeners = function(player) {
    var socket = player.socket;
    socket.on('i', function() {
        socket.emit('i', { row: player.row, col: player.col, dim: mapManager.getMapDim(), id: player.id });
    });
    socket.on('move', function(data) {
        // TODO put in lots of validity checking
        player.col = data.col;
        player.row = data.row;
        this.updateNeeded = true;
    });
    socket.on('disconnect', function() {
        player.deleteMe = true;
        this.deletionsNeeded = true;
        this.updateNeeded = true;
        console.log('user disconnected');
    });
};

PlayerManager.prototype.updateTick = function() {
    console.log('TICK TOCK!');
    if (this.deletionsNeeded) {
        this.deletionsNeeded = false;
        var tmp = [];
        while (this.players.length > 0) {
            var p = this.players.pop();
            if (!p.deleteMe) {
                tmp.push(p);
            }
        }
        this.players = tmp;
    }
    if (this.updateNeeded) {
        console.log('an update was scheduled. executing now');
        this.updateNeeded = false;
        var playersData = players.map(function(p) {
            return p.packagePlayerData();
        });
        players.map(function(p) {
            if (p.socket) {
                console.log('Sending updated player data to ' + p.id);
                p.socket.emit('update', { players: playersData });
            }
        });
    }
};

PlayerManager.prototype.startUpdateTicker = function() {
    if (this.ticker === null) {
        console.log('update ticker started');
        this.ticker = setInterval(this.updateTick, this.TICK);
    }
};

module.exports = new PlayerManager();
