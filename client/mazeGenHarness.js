// note the moving around the maze capabilities are not terribly secure / cheatproof.
var MazeGenerator = function(dim) {
    console.log(dim);
    this._mazeMap = [];
    this._mazeDim = dim;
    this._canvas = document.getElementById('myCanvas');
    console.log(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
    this._tileSize = Math.min(this._canvasWidth / this._mazeDim, this._canvasHeight / this._mazeDim);

    if (this._canvasWidth > this._canvasHeight) {
        this._viewportHeight = 15;
        this._tileSize = Math.ceil(this._canvasHeight / 15);
        this._viewportWidth = Math.ceil(this._canvasWidth / this._tileSize);
    } else {
        this._viewportWidth = 15;
        this._tileSize = Math.ceil(this._canvasWidth / 15);
        this._viewportHeight = Math.ceil(this._canvasHeight / this._tileSize);
    }

    this.playerRow = 1;
    this.playerCol = 1;
};

MazeGenerator.prototype.genMaze = function(row, col) {
    var validDirs = this.getValidDirections(row, col);
    this._mazeMap[row][col].visited = true;
    if (!this._mazeMap[row][col].forced) {
        this._mazeMap[row][col].isWall = false;
    }
    while (validDirs.length > 0) {
        var randomNumber = Math.floor(Math.random() * validDirs.length);
        var dir = validDirs[randomNumber];
        if (!this._mazeMap[row][col].forced) {
            var tmprow = (row + dir.row) * 0.5;
            var tmpcol = (col + dir.col) * 0.5;
            this._mazeMap[tmprow][tmpcol].isWall = false;
            this._mazeMap[tmprow][tmpcol].visited = true;
        }
        this.genMaze(dir.row, dir.col);
        validDirs = this.getValidDirections(row, col);
    }
};

MazeGenerator.prototype.getValidDirections = function(row, col) {
    var validDirs = [];
    if ((row - 2) >= 0) {
        if (!this._mazeMap[row - 2][col].visited) {
            validDirs.push({ row: (row - 2), col: col });
        }
    }
    if ((row + 2) < this._mazeDim) {
        if (!this._mazeMap[row + 2][col].visited) {
            validDirs.push({ row: (row + 2), col: col });
        }
    }
    if ((col - 2) >= 0) {
        if (!this._mazeMap[row][col - 2].visited) {
            validDirs.push({ row: row, col: (col - 2) });
        }
    }
    if ((col + 2) < this._mazeDim) {
        if (!this._mazeMap[row][col + 2].visited) {
            validDirs.push({ row: row, col: (col + 2) });
        }
    }
    return validDirs;
};

MazeGenerator.prototype.initializeMap = function() {
    for (var i = 0; i < this._mazeDim; i++) {
        this._mazeMap[i] = [];
        for (var j = 0; j < this._mazeDim; j++) {
            this._mazeMap[i][j] = { isWall: true, visited: false, isForced: false, occupied: false, occupantColor: null };
        }
    }
};

MazeGenerator.prototype.drawBlock = function(x, y, color) {
    this._ctx.fillStyle = color;
    this._ctx.fillRect(y,x,this._tileSize,this._tileSize);
};

// viewportHeight and viewportWidth are the number of maze tiles to show.
MazeGenerator.prototype.displayViewportMaze = function(row, col, viewportHeight, viewportWidth) {
    for (var i = 0; i < this._viewportWidth; i++) {
        for (var j = 0; j < this._viewportHeight; j++) {
            var drawRow = Math.floor(row - ((this._viewportHeight * 0.5) - 1) + i);
            var drawCol = Math.floor(col - ((this._viewportWidth * 0.5) - 1) + j);
            if (this.isValidTile(drawRow, drawCol)) {
                var mapTile = this._mazeMap[drawRow][drawCol];
                if (mapTile.isWall === true) {
                    this.drawBlock(i * this._tileSize, j * this._tileSize, "#000000");
                } else {
                    this.drawBlock(i * this._tileSize, j * this._tileSize, "#ffffff");
                }
                if (drawRow === row && drawCol === col) {
                    this.drawBlock(i * this._tileSize, j * this._tileSize, "#ff0000");
                } else if (mapTile.occupantColor !== null) {
                    var c = mapTile.occupantColor;
                    this.drawBlock(i * this._tileSize, j * this._tileSize, rgba(c.r, c.g, c.b, c.a));
                    if (!mapTile.occupied) {
                        c.a -= 0.1;
                        if (c.a < 0.1) {
                            mapTile.occupantColor = null;
                        }
                    }
                }
            } else {
                this.drawBlock(i * this._tileSize, j * this._tileSize, "#0000ff");
            }
        }
    }
};

MazeGenerator.prototype.isValidTile = function(row, col) {
    if (row >= 0) {
        if (col >= 0) {
            if (row < this._mazeDim) {
                if (col < this._mazeDim) {
                    return true;
                }
            }
        }
    }
    return false;
};

MazeGenerator.prototype.isOpenPathway = function(row, col) {
    if (row < 0) {
        return false;
    }
    if (col < 0) {
        return false;
    }
    if (row >= this._mazeDim) {
        return false;
    }
    if (col >= this._mazeDim) {
        return false;
    }
    if (this._mazeMap[row][col].isWall) {
        return false;
    }
    return true;
};

MazeGenerator.prototype.setOccupant = function(row, col) {
    if (this.isValidTile(row, col)) {
        this._mazeMap[row][col].occupied = true;
        this._mazeMap[row][col].occupantColor = {
            r: 255,
            g: 0,
            b: 255,
            a: 1.0
        };
    }
};

var socket = io();
socket.emit('i');
socket.on('i', function(data) {
    var gen = new MazeGenerator(data.dim);
    gen.initializeMap();
    gen.genMaze(1,1);
    gen.displayViewportMaze(data.row, data.col);
    gen.playerRow = data.row;
    gen.playerCol = data.col;

    gen._canvas.onmousedown = function(e) {
        var xDir = (Math.round(e.clientX / gen._canvasWidth) * 2) - 1;
        var yDir = (Math.round(e.clientY / gen._canvasHeight) * 2) - 1;
        // find the more emphasized of the directions.
        if (Math.abs(e.clientX - (gen._canvasWidth * 0.5)) > Math.abs(e.clientY - (gen._canvasHeight * 0.5))) {
            if (gen.isOpenPathway(gen.playerRow, gen.playerCol + xDir)) {
                gen.playerCol += xDir;
            }
        } else {
            if (gen.isOpenPathway(gen.playerRow + yDir, gen.playerCol)) {
                gen.playerRow += yDir;
            }
        }
        gen.displayViewportMaze(gen.playerRow, gen.playerCol);
    };
});

socket.on('update', function(data) {
    if (data) {
        if (data.players) {
            for (var i = 0; i < data.players.length; i++) {
                var p = data.players[i];
                gen.setOccupant(p.row, p.col);
//                gen.drawBlock(p.row * gen._tileSize, p.col * gen._tileSize, "#00ff00");
            }
        }
    }
});


