var my = {
    mazegen: {
        MazeGenerator: function() {
            this._mazeMap = [];
            this._mazeDim = 55;
            this._canvas = document.getElementById('myCanvas');
            console.log(this._canvas);
            this._ctx = this._canvas.getContext('2d');
            this._canvasWidth = this._canvas.width;
            this._canvasHeight = this._canvas.height;
            this._tileSize = Math.min(this._canvasWidth / this._mazeDim, this._canvasHeight / this._mazeDim);
        }
    }
};

my.mazegen.MazeGenerator.prototype.genMaze = function(row, col) {
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

my.mazegen.MazeGenerator.prototype.getValidDirections = function(row, col) {
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

my.mazegen.MazeGenerator.prototype.initializeMap = function() {
    for (var i = 0; i < this._mazeDim; i++) {
        this._mazeMap[i] = [];
        for (var j = 0; j < this._mazeDim; j++) {
            this._mazeMap[i][j] = { isWall: true, visited: false, isForced: false };
            // if (j % 2 === 0) {
            //     this._mazeMap[i][j].isWall = false;
            // }
        }
    }
};

my.mazegen.MazeGenerator.prototype.drawBlock = function(x, y, color) {
    this._ctx.fillStyle = color;
    this._ctx.fillRect(x,y,this._tileSize,this._tileSize);
};

my.mazegen.MazeGenerator.prototype.displayMaze = function(receiveInput) {
    for (var i = 0; i < this._mazeDim; i++) {
        for (var j = 0; j < this._mazeDim; j++) {
            if (this._mazeMap[i][j].isWall === true) {
                this.drawBlock(i * this._tileSize, j * this._tileSize, "#000000");
            } else {
                this.drawBlock(i * this._tileSize, j * this._tileSize, "#ffffff");
            }
        }
    }
    if (receiveInput) {
        this._canvas.mouseup(function() {

        });
    }
};

var gen = new my.mazegen.MazeGenerator();
gen.initializeMap();
gen.displayMaze();


// TODO call your maze generation function here.
gen.genMaze(1,1);

gen.displayMaze();
