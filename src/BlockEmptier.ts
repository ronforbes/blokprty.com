class BlockEmptier {
    private block: Block;
    private phaserGame: Phaser.Game;
    private delayElapsed: number;
    static readonly DelayInterval: number = 250;
    DelayDuration: number;

    constructor(block: Block, phaserGame: Phaser.Game) {
        this.block = block;
        this.phaserGame = phaserGame;
    }

    Empty() {
        this.block.State = BlockState.WaitingToEmpty;

        this.delayElapsed = 0;
    }

    Update() {
        // todo: if the game hasn't started or has already endd, return immediately

        if(this.block.State == BlockState.WaitingToEmpty) {
            this.delayElapsed += this.phaserGame.time.elapsed;

            if(this.delayElapsed >= this.DelayDuration) {
                this.block.State = BlockState.Empty;
                this.block.Type = -1;
            }
        }
    }
}