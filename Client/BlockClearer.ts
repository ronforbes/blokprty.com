class BlockClearer {
    private block: Block;
    private delayElapsed: number;
    DelayDuration: number;
    static readonly DelayInterval: number = 250;
    Elapsed: number;
    static readonly Duration: number = 250;
    private scoreboard: Scoreboard;
    private signManager: SignManager;

    constructor(block: Block, scoreboard: Scoreboard, signManager: SignManager) {
        this.block = block;
        this.scoreboard = scoreboard;
        this.signManager = signManager;
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
                
                this.signManager.CreateSign(this.block.X, this.block.Y, Scoreboard.MatchValue.toString(), BlockRenderer.Colors[this.block.Type]);
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