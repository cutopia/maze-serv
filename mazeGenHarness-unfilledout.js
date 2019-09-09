var my = {
    mazegen: {
        MazeGenerator: function() {
            this._mazeMap = [];
            this._mazeDim = 15;
            this._canvas = document.getElementById('myCanvas');
            console.log(this._canvas);
            this._ctx = this._canvas.getContext('2d');
            this._canvasWidth = this._canvas.width;
            this._canvasHeight = this._canvas.height;
            this._tileSize = Math.min(this._canvasWidth / this._mazeDim, this._canvasHeight / this._mazeDim);
        }
    }
};

my.mazegen.MazeGenerator.prototype.initializeMap = function() {
    for (var i = 0; i < this._mazeDim; i++) {
        this._mazeMap[i] = [];
        for (var j = 0; j < this._mazeDim; j++) {
            this._mazeMap[i][j] = { isWall: true, visited: false };
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

my.mazegen.MazeGenerator.prototype.displayMaze = function() {
    for (var i = 0; i < this._mazeDim; i++) {
        for (var j = 0; j < this._mazeDim; j++) {
            if (this._mazeMap[i][j].isWall === true) {
                this.drawBlock(i * this._tileSize, j * this._tileSize, "#00FF00");
            } else {
                this.drawBlock(i * this._tileSize, j * this._tileSize, "#FF0000");
            }
        }
    }
};

var gen = new my.mazegen.MazeGenerator();
gen.initializeMap();

// TODO call your maze generation function here.

gen.displayMaze();
