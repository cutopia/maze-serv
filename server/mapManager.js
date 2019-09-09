var MapManager = function() {
    this.MAZEDIM = 55;
    this.SEED = 444;
};

MapManager.prototype.getMapDim = function() {
    return this.MAZEDIM;
};

MapManager.prototype.getRandomNum = function() {
    var randomNum = Math.floor(Math.random() * this.MAZEDIM);
    if (randomNum % 2 === 0) {
        randomNum++;
        if (randomNum === this.MAZEDIM) {
            randomNum -= 2;
        }
    }
    return randomNum;
};

MapManager.prototype.getSeed = function() {

};

module.exports = new MapManager();
