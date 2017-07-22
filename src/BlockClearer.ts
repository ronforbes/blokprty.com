class BlockClearer {
    private block: Block;
    private delayElapsed: number;
    DelayDuration: number;
    static readonly DelayInterval: number = 250;
    Elapsed: number;
    static readonly Duration: number = 250;
    private scoreboard: Scoreboard;

    constructor(block: Block, scoreboard: Scoreboard) {
        this.block = block;
        this.scoreboard = scoreboard;
    }

    Clear() {
        this.block.State = BlockState.WaitingToClear;

        this.delayElapsed = 0;
    }

    Update(elapsedGameTime: number) {
        // if the game hasn't started or has finished, return immediately

        if(this.block.State == BlockState.WaitingToClear) {
            this.delayElapsed += elapsedGameTime;

            if(this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Clearing;

                this.Elapsed = 0;

                this.scoreboard.ScoreMatch();
            }
        }

        if(this.block.State == BlockState.Clearing) {
            this.Elapsed += elapsedGameTime;

            if(this.Elapsed >= BlockClearer.Duration) {
                this.block.Emptier.Empty();
            }
        }
    }
}