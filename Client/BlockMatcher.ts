class BlockMatcher {
    private block: Block;
    Elapsed: number;
    private readonly duration: number = 1000;

    constructor(block: Block) {
        this.block = block;
    }

    Match(matchedBlockCount: number, delayCounter: number) {
        this.block.State = BlockState.Matched;

        this.Elapsed = 0;

        this.block.Clearer.DelayDuration = (matchedBlockCount - delayCounter) * BlockClearer.DelayInterval;
        this.block.Emptier.DelayDuration = delayCounter * BlockEmptier.DelayInterval;
    }

    Update(elapsedGameTime: number) {
        // to do: return immediately if the game hasn't started or is over

        if(this.block.State == BlockState.Matched) {
            this.Elapsed += elapsedGameTime;

            if(this.Elapsed >= this.duration) {
                this.block.Clearer.Clear();
            }
        }
    }
}