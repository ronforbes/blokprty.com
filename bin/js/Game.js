var Game = (function () {
    function Game() {
        this.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game', { preload: this.preload, create: this.create });
    }
    Game.prototype.preload = function () {
    };
    Game.prototype.create = function () {
    };
    return Game;
}());
window.onload = function () {
    var game = new Game();
};
