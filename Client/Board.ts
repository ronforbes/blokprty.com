class Board {
    Blocks: Block[][];
    static readonly Columns: number = 8;
    static readonly Rows: number = 9;
    private phaserGame: Phaser.Game;
    private controller: BoardController;
    MatchDetector: MatchDetector;
    private boardGravity: BoardGravity;
    private boardGroup: Phaser.Group;
    private signManager: SignManager;
    Renderer: BoardRenderer;

    constructor(phaserGame: Phaser.Game, scoreboard: Scoreboard) {
        this.phaserGame = phaserGame;

        this.MatchDetector = new MatchDetector(this);
        
        this.boardGroup = this.phaserGame.add.group();

        this.Renderer = new BoardRenderer(this, this.phaserGame, this.boardGroup);        

        this.signManager = new SignManager(phaserGame, this.boardGroup);
        
        this.Blocks = [];

        for(let x = 0; x < Board.Columns; x++) {
            this.Blocks[x] = [];

            for(let y = 0; y < Board.Rows; y++) {
                this.Blocks[x][y] = new Block(this, this.boardGroup, scoreboard, this.signManager);
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
                this.Blocks[x][y].Update(this.phaserGame.time.elapsed);
            }
        }

        this.controller.Update();

        this.MatchDetector.Update();

        this.boardGravity.Update();

        this.signManager.Update(this.phaserGame.time.elapsed);
    }
}