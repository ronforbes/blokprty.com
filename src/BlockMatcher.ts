class BlockMatcher {
    private block: Block;
    private elapsed: number;
    private readonly duration: number = 1000;
    private phaserGame: Phaser.Game;

    constructor(block: Block, phaserGame: Phaser.Game) {
        this.block = block;
        this.phaserGame = phaserGame;
    }

    Match(matchedBlockCount: number, delayCounter: number) {
        this.block.State = BlockState.Matched;

        this.elapsed = 0;

        this.block.Clearer.DelayDuration = (matchedBlockCount - delayCounter) * BlockClearer.DelayInterval;
        this.block.Emptier.DelayDuration = delayCounter * BlockEmptier.DelayInterval;
    }

    Update() {
        // to do: return immediately if the game hasn't started or is over

        if(this.block.State == BlockState.Matched) {
            this.elapsed += this.phaserGame.time.elapsed;

            if(this.elapsed >= this.duration) {
                this.block.Clearer.Clear();
            }
        }
    }
}