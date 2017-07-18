enum SlideDirection {
    Left,
    Right,
    None
}

class BlockSlider {
    private block: Block;
    private phaserGame: Phaser.Game;
    private matchDetector: MatchDetector;
    //private matchDetector: MatchDetector;
    Direction: SlideDirection;
    TargetState: BlockState;
    TargetType: number;
    Elapsed: number;
    static readonly Duration: number = 100;

    constructor(block: Block, phaserGame: Phaser.Game, matchDetector: MatchDetector) {
        this.block = block;
        this.phaserGame = phaserGame;
        this.matchDetector = matchDetector;
    }

    Slide(direction: SlideDirection) {
        this.block.State = BlockState.Sliding;

        // Reset the sliding timer
        this.Elapsed = 0;

        this.Direction = direction;
    }

    Update() {
        if(this.block.State == BlockState.Sliding) {
            this.Elapsed += this.phaserGame.time.elapsed;

            if(this.Elapsed >= BlockSlider.Duration) {
                this.block.State = this.TargetState;
                this.block.Type = this.TargetType;

                this.Direction = SlideDirection.None;

                if(this.block.State == BlockState.Idle) {
                    this.matchDetector.RequestMatchDetection(this.block);
                }
            }
        }
    }
}