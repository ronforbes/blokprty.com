class BlockEmptier {
    private block: Block;
    private delayElapsed: number;
    static readonly DelayInterval: number = 250;
    DelayDuration: number;

    constructor(block: Block) {
        this.block = block;
    }

    Empty() {
        this.block.State = BlockState.WaitingToEmpty;

        this.delayElapsed = 0;
    }

    Update(elapsedGameTime: number) {
        // todo: if the game hasn't started or has already endd, return immediately

        if(this.block.State == BlockState.WaitingToEmpty) {
            this.delayElapsed += elapsedGameTime;

            if(this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Empty;
                this.block.Type = -1;
            }
        }
    }
}