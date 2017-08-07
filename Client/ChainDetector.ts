class ChainDetector {
    ChainLength: number;
    private board: Board;
    private scoreboard: Scoreboard;

    constructor(board: Board, scoreboard: Scoreboard) {
        this.board = board;
        this.scoreboard = scoreboard;
    }

    IncrementChain() {
        this.ChainLength++;
        this.scoreboard.ScoreChain(this.ChainLength);
    }

    Update() {
        let stopChain: boolean = true;

        // detect blocks that are eligible to participate in chains
        for(let x = 0; x < Board.Columns; x++) {
            for(let y = Board.Rows - 1; y >= 0; y--) {
                if(this.board.Blocks[x][y].Chainer.JustEmptied) {
                    for(let chainEligibleRow = y - 1; chainEligibleRow >= 0; chainEligibleRow--) {
                        if(this.board.Blocks[x][chainEligibleRow].State == BlockState.Idle) {
                            this.board.Blocks[x][chainEligibleRow].Chainer.ChainEligible = true;
                            stopChain = false;
                        }
                    }
                }

                this.board.Blocks[x][y].Chainer.JustEmptied = false;
            }
        }

        // stop the current chain if all of the blocks are idle or empty
        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                let state = this.board.Blocks[x][y].State;
                if(state != BlockState.Idle &&
                   state != BlockState.Empty &&
                   state != BlockState.Sliding) {
                       stopChain = false;
                   }
            }
        }

        if(stopChain) {
            for(let x = 0; x < Board.Columns; x++) {
                for(let y = 0; y < Board.Rows; y++) {
                    this.board.Blocks[x][y].Chainer.ChainEligible = false;
                }
            }

            if(this.ChainLength > 1) {
                // TODO: Play fanfare
            }

            this.ChainLength = 1;
        }
    }
}