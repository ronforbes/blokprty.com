class Game {
    private game: Phaser.Game;
    private testBlock: Block;
    private board: Board;

    constructor() {
        this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'game', { preload: this.preload, create: this.create, update: this.update });
    }

    preload() {
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.load.image(BlockRenderer.Key, BlockRenderer.Url);
    }

    create() {
        this.board = new Board(this.game);
    }

    update() {
        this.board.Update();
    }
}

window.onload = () => {
    let game = new Game();
}