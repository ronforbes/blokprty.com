class BoardRenderer {
    private mask: Phaser.Graphics;
    private background: Phaser.Graphics;
    private position: Phaser.Point;

    constructor(board: Board, phaserGame: Phaser.Game, group: Phaser.Group) {
        this.position = new Phaser.Point(phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2, phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 - BlockRenderer.Height / 2);
        group.position = this.position;

        let scale = phaserGame.height / (BlockRenderer.Height * 11);
        group.scale.setTo(scale, scale);

        this.background = phaserGame.add.graphics(0, 0);
        group.addChild(this.background);

        this.background.beginFill(0x333333);
        this.background.drawRect(-10, 0, Board.Columns * BlockRenderer.Width + 20, Board.Rows * BlockRenderer.Height + 10);

        this.mask = phaserGame.add.graphics(0, 0);
        group.addChild(this.mask);

        this.mask.beginFill(0xffffff);
        this.mask.drawRect(-10, BlockRenderer.Height, Board.Columns * BlockRenderer.Width + 20, Board.Rows * BlockRenderer.Height - BlockRenderer.Height + 10);
        group.mask = this.mask;
    }

    Render(phaserGame: Phaser.Game) {
        phaserGame.debug.text("Game Width= " + phaserGame.width + ", Game Height=" + phaserGame.height, 0, 150, "#00ff00", "48px Arial");
        phaserGame.debug.text("Board Position=" + this.position.toString(), 0, 200, "#00ff00", "48px Arial");
    }
}