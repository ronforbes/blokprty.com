class BoardGravity {
    private board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    Update() {
        // todo: if the game hasn't started or has ended, return early

        for(let x = 0; x < Board.Columns; x++) {
            let emptyBlockDetected: boolean = false;

            for(let y = Board.Rows - 1; y >= 0; y--) {
                if(this.board.Blocks[x][y].State == BlockState.Empty) {
                    emptyBlockDetected = true;
                }

                if(this.board.Blocks[x][y].State == BlockState.Idle && emptyBlockDetected) {
                    this.board.Blocks[x][y].Faller.Target = this.board.Blocks[x][y + 1];
                    this.board.Blocks[x][y].Faller.Fall();
                }

                if(this.board.Blocks[x][y].Faller.JustFell) {
                    if(y < Board.Rows - 1 && (this.board.Blocks[x][y + 1].State == BlockState.Empty || this.board.Blocks[x][y + 1].State == BlockState.Falling)) {
                        this.board.Blocks[x][y].Faller.Target = this.board.Blocks[x][y + 1];
                        this.board.Blocks[x][y].Faller.ContinueFalling();
                    }
                    else {
                        this.board.Blocks[x][y].State = BlockState.Idle;
                        this.board.MatchDetector.RequestMatchDetection(this.board.Blocks[x][y]);
                    }

                    this.board.Blocks[x][y].Faller.JustFell = false;
                }
            }
        }

        // add new blocks on the top of the board
        for(let x = 0; x < Board.Columns; x++) {
            if(this.board.Blocks[x][0].State == BlockState.Empty) {
                let type: number = this.board.GetRandomBlockType(x, 0);

                this.board.Blocks[x][0].Type = type;

                if(this.board.Blocks[x][1].State == BlockState.Idle) {
                    this.board.Blocks[x][0].State = BlockState.Idle;
                }

                if(this.board.Blocks[x][1].State == BlockState.Empty || this.board.Blocks[x][1].State == BlockState.Falling) {
                    this.board.Blocks[x][0].Faller.Target = this.board.Blocks[x][1];
                    this.board.Blocks[x][0].Faller.ContinueFalling(); // Should this just be Fall?
                }
            }
        }
    }
}