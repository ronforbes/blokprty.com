class Board {
    Blocks: Block[][];
    static readonly Columns: number = 6;
    static readonly Rows: number = 11;
    private phaserGame: Phaser.Game;
    private controller: BoardController;
    MatchDetector: MatchDetector;

    constructor(phaserGame: Phaser.Game) {
        this.phaserGame = phaserGame;

        this.MatchDetector = new MatchDetector(this);
        
        this.Blocks = [];

        for(let x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];

            for(let y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this.phaserGame, this);
                this.Blocks[x][y].X = x;
                this.Blocks[x][y].Y = y;

                let type;

                do {
                    type = this.phaserGame.rnd.integerInRange(0, Block.TypeCount - 1);
                } while((x != 0 && this.Blocks[x - 1][y].Type == type) || (y != 0 && this.Blocks[x][y - 1].Type == type));

                this.Blocks[x][y].Type = type;
                this.Blocks[x][y].State = BlockState.Idle;
            }
        }

        this.controller = new BoardController(this, this.phaserGame);;
    }

    Update() {
        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y].Update();
            }
        }

        this.controller.Update();

        this.MatchDetector.Update();
    }
}