class BlockRenderer {
    private block: Block;
    static Size: number = 0;
    private readonly colors: number[] = [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xffff00,
        0xff00ff,
        0x00ffff
    ];
    private localScale: Phaser.Point;
    static StarEmitter: Phaser.Particles.Arcade.Emitter;
    static CircleEmitter: Phaser.Particles.Arcade.Emitter;

    constructor(block: Block) {
        this.block = block;
        this.block.Sprite.anchor.setTo(0.5);
        if(BlockRenderer.StarEmitter == undefined) {
            BlockRenderer.StarEmitter = this.block.Sprite.game.add.emitter(-100, -100, 10 * Board.Columns * Board.Rows);
            BlockRenderer.StarEmitter.makeParticles("StarParticle");
            BlockRenderer.StarEmitter.gravity = 0;
            BlockRenderer.StarEmitter.minParticleScale = BlockRenderer.StarEmitter.maxParticleScale = 0.25;
            BlockRenderer.StarEmitter.setAlpha(1, 0, 2000);
            BlockRenderer.StarEmitter.setScale(0.25, 0, 0.25, 0, 2000);
            BlockRenderer.StarEmitter.setXSpeed(-50, 50);
            BlockRenderer.StarEmitter.setYSpeed(-50, 50);
        } 
        
        if(BlockRenderer.CircleEmitter == undefined) {
            BlockRenderer.CircleEmitter = this.block.Sprite.game.add.emitter(0, 0, Board.Columns * Board.Rows);
            BlockRenderer.CircleEmitter.makeParticles("CircleParticle");
            BlockRenderer.CircleEmitter.gravity = 0;
            BlockRenderer.CircleEmitter.minParticleScale = BlockRenderer.StarEmitter.maxParticleScale = 0.5;
            BlockRenderer.CircleEmitter.setAlpha(1, 0, 1500);
            BlockRenderer.CircleEmitter.setScale(0, 1, 0, 1, 2000);
            BlockRenderer.CircleEmitter.setXSpeed(0, 0);
            BlockRenderer.CircleEmitter.setYSpeed(0, 0);
        }
    }

    Update() {
        let timePercentage: number = 0;

        switch(this.block.State) {
            case BlockState.Empty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = false;
                break;

            case BlockState.Idle:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Sliding:
                let destination: number = 0;
                if(this.block.Slider.Direction == SlideDirection.Left) {
                    destination = -BlockRenderer.Size;
                }

                if(this.block.Slider.Direction == SlideDirection.Right) {
                    destination = BlockRenderer.Size;
                }

                timePercentage = this.block.Slider.Elapsed / BlockSlider.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2 + destination * timePercentage, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);

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
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Falling:
                timePercentage = this.block.Faller.Elapsed / BlockFaller.Duration;
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2 + BlockRenderer.Size * timePercentage);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Matched:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.block.Matcher.Elapsed % 20 < 10 ? 0xffffff : this.colors[this.block.Type];
                this.localScale = new Phaser.Point(this.block.Sprite.scale.x, this.block.Sprite.scale.y);
                break;

            case BlockState.WaitingToClear:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.alpha = 1;
                this.block.Sprite.tint = this.colors[this.block.Type];
                break;
            
            case BlockState.Clearing:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.visible = true;
                this.block.Sprite.tint = this.colors[this.block.Type];

                let alpha: number = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.alpha = alpha;

                let scale: number = 1.0 - this.block.Clearer.Elapsed / BlockClearer.Duration;
                this.block.Sprite.scale.setTo(scale * this.localScale.x, scale * this.localScale.y);
                
                if(this.block.Clearer.Elapsed < BlockClearer.Duration * 0.1) {
                    BlockRenderer.StarEmitter.x = this.block.Sprite.worldPosition.x;
                    BlockRenderer.StarEmitter.y = this.block.Sprite.worldPosition.y;
                    BlockRenderer.StarEmitter.start(true, 2000, null, 10);

                    BlockRenderer.CircleEmitter.x = this.block.Sprite.worldPosition.x;
                    BlockRenderer.CircleEmitter.y = this.block.Sprite.worldPosition.y;
                    BlockRenderer.CircleEmitter.start(true, 2000, null, 1);
                }
                

                break;

            case BlockState.WaitingToEmpty:
                this.block.Sprite.position.setTo(this.block.X * BlockRenderer.Size + BlockRenderer.Size / 2, this.block.Y * BlockRenderer.Size + BlockRenderer.Size / 2);
                this.block.Sprite.scale = this.localScale;
                this.block.Sprite.visible = false;
        }
        
    }
}