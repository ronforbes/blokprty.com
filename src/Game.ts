class Game {
    game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game', { preload: this.preload, create: this.create });
    }

    preload() {

    }

    create() {

    }
}

window.onload = () => {
    var game = new Game();
}