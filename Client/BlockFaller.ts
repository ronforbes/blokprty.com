class BlockFaller {
    private block: Block;
    private delayElapsed: number;
    readonly delayDuration: number = 100;
    Elapsed: number;
    static readonly Duration: number = 100;
    Target: Block;
    JustFell: boolean;

    constructor(block: Block) {
        this.block = block;
    }

    Fall() {
        this.block.State = BlockState.WaitingToFall;

        this.delayElapsed = 0;
    }

    ContinueFalling() {
        this.FinishWaitingToFall();
    }

    private FinishWaitingToFall() {
        this.block.State = BlockState.Falling;

        this.Elapsed = 0;
    }

    Update(elapsedGameTime: number) {
        // to do: if the game isn't on, return immediately

        if(this.block.State == BlockState.WaitingToFall) {
            this.delayElapsed += elapsedGameTime;

            if(this.delayElapsed >= this.delayDuration) {
                this.FinishWaitingToFall();
            }
        }

        if(this.block.State == BlockState.Falling) {
            this.Elapsed += elapsedGameTime;

            if(this.Elapsed >= BlockFaller.Duration) {
                this.Target.State = BlockState.Falling;
                this.Target.Type = this.block.Type;

                this.Target.Faller.JustFell = true;

                this.block.State = BlockState.Empty;
                this.block.Type = -1;
            }
        }
    }
}