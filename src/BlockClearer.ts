class BlockClearer {
    private block: Block;
    private phaserGame: Phaser.Game;
    private delayElapsed: number;
    static readonly DelayInterval: number = 250;
    DelayDuration: number;
    Elapsed: number;
    static readonly Duration: number = 250;

    constructor(block: Block, phaserGame: Phaser.Game) {
        this.block = block;
        this.phaserGame = phaserGame;
    }

    Clear() {
        this.block.State = BlockState.WaitingToClear;

        this.delayElapsed = 0;
    }

    Update() {
        // if the game hasn't started or has finished, return immediately

        if(this.block.State == BlockState.WaitingToClear) {
            this.delayElapsed += this.phaserGame.time.elapsed;

            if(this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Clearing;

                this.Elapsed = 0;
            }
        }

        if(this.block.State == BlockState.Clearing) {
            this.Elapsed += this.phaserGame.time.elapsed;

            if(this.Elapsed >= BlockClearer.Duration) {
                this.block.Emptier.Empty();
            }
        }
    }
}