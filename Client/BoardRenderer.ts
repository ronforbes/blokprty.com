class BoardRenderer {
    private mask: Phaser.Graphics;
    //private background: Phaser.Graphics;
    //private position: Phaser.Point;
    private phaserGame: Phaser.Game;
    Group: Phaser.Group;

    constructor(board: Board, phaserGame: Phaser.Game, group: Phaser.Group) {
        this.phaserGame = phaserGame;
        this.Group = group;

        //this.background = this.phaserGame.add.graphics(0, 0);
        //this.Group.addChild(this.background);

        //this.background.beginFill(0x333333);
        //this.background.drawRect(0, 0, Board.Columns * BlockRenderer.Width, Board.Rows * BlockRenderer.Height);

        //this.mask = this.phaserGame.add.graphics(0, 0);
        //this.group.addChild(this.mask);

        //this.mask.beginFill(0xffffff);
        //this.mask.drawRect(-10, BlockRenderer.Height, Board.Columns * BlockRenderer.Width + 20, Board.Rows * BlockRenderer.Height - BlockRenderer.Height + 10);
        //this.group.mask = this.mask;
    }
}