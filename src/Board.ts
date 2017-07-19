class Board {
    Blocks: Block[][];
    static readonly Columns: number = 6;
    static readonly Rows: number = 11;
    private phaserGame: Phaser.Game;
    private controller: BoardController;
    MatchDetector: MatchDetector;
    private boardGravity: BoardGravity;
    private blockGroup: Phaser.Group;
    private mask: Phaser.Graphics;

    constructor(phaserGame: Phaser.Game) {
        this.phaserGame = phaserGame;

        this.MatchDetector = new MatchDetector(this);
        
        this.blockGroup = this.phaserGame.add.group();

        this.mask = this.phaserGame.add.graphics(0, 0);
        this.mask.beginFill(0xffffff);
        this.mask.drawRect(this.phaserGame.width / 2 - Board.Columns * BlockRenderer.Width / 2, this.phaserGame.height / 2 - Board.Rows * BlockRenderer.Height / 2 + BlockRenderer.Height, Board.Columns * BlockRenderer.Width, Board.Rows * BlockRenderer.Height - BlockRenderer.Height);
        this.blockGroup.mask = this.mask;

        this.Blocks = [];

        for(let x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];

            for(let y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this.phaserGame, this, this.blockGroup);
                this.Blocks[x][y].X = x;
                this.Blocks[x][y].Y = y;

                let type = this.GetRandomBlockType(x, y);

                this.Blocks[x][y].Type = type;
                this.Blocks[x][y].State = BlockState.Idle;
            }
        }

        this.controller = new BoardController(this, this.phaserGame);

        this.boardGravity = new BoardGravity(this);
    }

    GetRandomBlockType(x: number, y: number): number {
        let type: number;

        do {
            type = this.phaserGame.rnd.integerInRange(0, Block.TypeCount - 1);
        } while((x != 0 && this.Blocks[x - 1][y].Type == type) || (y != 0 && this.Blocks[x][y - 1].Type == type));

        return type;
    }

    Update() {
        for(let x = 0; x < Board.Columns; x++) {
            for(let y = Board.Rows - 1; y >= 0; y--) {
                this.Blocks[x][y].Update();
            }
        }

        this.controller.Update();

        this.MatchDetector.Update();

        this.boardGravity.Update();
    }
}