class BlockRenderer {
    private block: Block;
    private phaserGame: Phaser.Game;
    static readonly Key: string = "block";
    static readonly Url: string = "assets/sprites/pixel.png";
    static readonly Width: number = 50;
    static readonly Height: number = 50;
    private readonly colors: number[] = [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xffff00,
        0xff00ff,
        0x00ffff
    ];

    constructor(block: Block, phaserGame: Phaser.Game) {
        this.block = block;
        this.phaserGame = phaserGame;
        this.block.Sprite.anchor.setTo(0.5, 0.5);
        this.block.Sprite.scale.setTo(45, 45);
    }

    Update() {
        let timePercentage: number = 0;

        switch(this.block.State) {
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height);
                this.block.Sprite.scale.setTo(45, 45);
                this.block.Sprite.visible = false;
                break;

            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Sliding:
                let destination: number = 0;
                if(this.block.Slider.Direction == SlideDirection.Left) {
                    destination = -BlockRenderer.Width;
                }

                if(this.block.Slider.Direction == SlideDirection.Right) {
                    destination = BlockRenderer.Width;
                }

                timePercentage = this.block.Slider.Elapsed / BlockSlider.Duration;
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2 + destination * timePercentage, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);

                if(this.block.Type == -1) {
                    this.block.Sprite.visible = false;
                }
                else {
                    this.block.Sprite.visible = true;
                    this.block.Sprite.alpha = 1;
                    this.block.Sprite.tint = this.colors[this.block.Type];
                }
                break;

            case BlockState.WaitingToFall:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Falling:
                timePercentage = this.block.Faller.Elapsed / BlockFaller.Duration;
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2 + BlockRenderer.Height * timePercentage);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = 0xffffff;
                break;

            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];

                let alpha: number = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;

                let scale: number = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale * 45, scale * 45);
                break;

            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2 + this.block.X * BlockRenderer.Width + BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + this.block.Y * BlockRenderer.Height + BlockRenderer.Height / 2);
                this.block.Sprite.scale.setTo(45, 45);
                this.block.Sprite.visible = false;
        }
        
    }
}