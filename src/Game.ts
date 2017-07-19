class Game {
    private game: Phaser.Game;
    private board: Board;

    constructor() {
        this.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }

    preload() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = this.game.scale.pageAlignVertically = true;
        this.game.load.image(BlockRenderer.Key, BlockRenderer.Url);
    }

    create() {
        this.game.time.advancedTiming = true;
        this.board = new Board(this.game);
    }

    update() {
        this.board.Update();
    }

    render() {
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
    }
}

window.onload = () => {
    let game = new Game();
}