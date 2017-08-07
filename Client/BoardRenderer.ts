class BoardRenderer {
    private mask: Phaser.Graphics;
    private background: Phaser.Graphics;
    private phaserGame: Phaser.Game;
    Group: Phaser.Group;

    constructor(board: Board, phaserGame: Phaser.Game, group: Phaser.Group) {
        this.phaserGame = phaserGame;
        this.Group = group;

        this.background = this.phaserGame.add.graphics(0, 0);
        this.Group.addChild(this.background);

        this.mask = this.phaserGame.add.graphics(0, 0);
        this.Group.addChild(this.mask);

        this.Resize();
    }

    Resize() {
        this.background.beginFill(0x333333);
        this.background.drawRect(0, BlockRenderer.Size, Board.Columns * BlockRenderer.Size, (Board.Rows - 1) * BlockRenderer.Size);

        this.mask.beginFill(0xffffff);
        this.mask.drawRect(0, BlockRenderer.Size, Board.Columns * BlockRenderer.Size, (Board.Rows - 1) * BlockRenderer.Size);
        this.Group.mask = this.mask;
    }
}