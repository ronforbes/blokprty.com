class BlockRenderer {
    private block: Block;
    static readonly Key: string = "block";
    static readonly Url: string = "assets/sprites/block.png";
    static CalculatedSize: number = 0;
    private readonly colors: number[] = [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xffff00,
        0xff00ff,
        0x00ffff
    ];
    private localScale: Phaser.Point;

    constructor(block: Block) {
        this.block = block;
        this.block.Sprite.anchor.setTo(0.5);
    }

    Update() {
        let timePercentage: number = 0;

        switch(this.block.State) {
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                //this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = false;
                break;

            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                //this.block.Sprite.scale.setTo(1, 1);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Sliding:
                let destination: number = 0;
                if(this.block.Slider.Direction == SlideDirection.Left) {
                    destination = -BlockRenderer.CalculatedSize;
                }

                if(this.block.Slider.Direction == SlideDirection.Right) {
                    destination = BlockRenderer.CalculatedSize;
                }

                timePercentage = this.block.Slider.Elapsed / BlockSlider.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2 + destination * timePercentage, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);

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
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Falling:
                timePercentage = this.block.Faller.Elapsed / BlockFaller.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2 + BlockRenderer.CalculatedSize * timePercentage);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = 0xffffff;
                this.localScale = new Phaser.Point(this.block.Sprite.scale.x, this.block.Sprite.scale.y);
                break;

            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];

                let alpha: number = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;

                let scale: number = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale * this.localScale.x, scale * this.localScale.y);
                
                break;

            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2, this.block.Y * BlockRenderer.CalculatedSize + BlockRenderer.CalculatedSize / 2);
                this.block.Sprite.scale = this.localScale;
                this.block.Sprite.visible = false;
        }
        
    }
}