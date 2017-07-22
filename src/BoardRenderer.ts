class BoardRenderer {
    private mask: Phaser.Graphics;
    //private background: Phaser.Graphics;
    //private position: Phaser.Point;
    private phaserGame: Phaser.Game;
    Group: Phaser.Group;

    constructor(board: Board, phaserGame: Phaser.Game, group: Phaser.Group) {
        this.phaserGame = phaserGame;
        this.Group = group;

        //console.log("World centerX=" + this.phaserGame.world.centerX)
        //this.position = new Phaser.Point(this.phaserGame.world.centerX - Board.Columns * BlockRenderer.Width / 2, this.phaserGame.world.centerY - (Board.Rows - 1) * BlockRenderer.Height / 2);
        //this.position = new Phaser.Point(this.phaserGame.world.centerX - Board.Columns * BlockRenderer.Width / 2, this.p);
        //this.Group.position = this.position;

        //let scale = this.phaserGame.height / (BlockRenderer.Height * 10) / window.devicePixelRatio;
    
        
        //this.group.scale.setTo(this.phaserGame.width / (BlockRenderer.Width * Board.Columns) / window.devicePixelRatio, 10 / (BlockRenderer.Height * 10) / window.devicePixelRatio);

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