class BoardRenderer {
    private mask: Phaser.Graphics;

    constructor(board: Board, phaserGame: Phaser.Game, group: Phaser.Group) {
        let position: Phaser.Point = new Phaser.Point(phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2, phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 - BlockRenderer.Height / 2);
        group.position = position;

        let scale = phaserGame.height / (BlockRenderer.Height * 11);
        group.scale.setTo(scale, scale);

        this.mask = phaserGame.add.graphics(0, 0);
        group.addChild(this.mask);
        
        this.mask.beginFill(0xffffff);
        this.mask.drawRect(0, BlockRenderer.Height, Board.Columns * BlockRenderer.Width, Board.Rows * BlockRenderer.Height - BlockRenderer.Height);
        group.mask = this.mask;
    }
}