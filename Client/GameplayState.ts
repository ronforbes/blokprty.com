class GameplayState extends Phaser.State {
    private backgroundImage: Phaser.Image;
    private scoreText: Phaser.Text;
    private clockText: Phaser.Text;
    private board: Board;
    private scoreboard: Scoreboard;
    private clock: Clock;
    private backButton: Phaser.Button;
    private name: string;

    init(clock: Clock, scoreboard: Scoreboard, name: string) {
        if(clock != undefined) {
            this.clock = clock;
        }

        if(scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }

        if(name != undefined) {
            this.name = name;
        }
    }

    create() {
        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }

        if(this.name == undefined) {
            this.name = "Guest";
        }

        this.backgroundImage = this.add.image(0, 0, "Background");

        this.board = new Board(this.game, this.scoreboard);

        this.scoreboard.Reset();

        this.scoreText = this.add.text(0, 0, "0", { font: "70px Arial", fill: "#ffffff", align: "center" });
        this.scoreText.anchor.setTo(0.5, 0);

        this.clockText = this.add.text(0, 0, "120", { font: "40px Arial", fill: "#ffffff", align: "right" });
        this.clockText.anchor.setTo(1, 0);

        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);

        this.resize();
    }

    private OnBackButton_Click() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    }

    resize() {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;

        let shortDimension: number = Math.min(this.game.width, this.game.height);
        BlockRenderer.Size = shortDimension * 0.8 / (Board.Rows - 1);

        this.board.Renderer.Group.x = this.world.centerX - BlockRenderer.Size * Board.Columns / 2;
        this.board.Renderer.Group.y = this.world.centerY - BlockRenderer.Size * Board.Rows / 2;
        this.board.Renderer.Resize();

        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                this.board.Blocks[x][y].Sprite.width = BlockRenderer.Size;
                this.board.Blocks[x][y].Sprite.height = BlockRenderer.Size;
            }
        }

        this.backButton.width = 40;
        this.backButton.height = 50;
        this.backButton.x = 10;
        this.backButton.y = 10;

        this.scoreText.fontSize = shortDimension * 0.1;
        this.scoreText.x = this.world.centerX;
        this.scoreText.y = 0;

        this.clockText.x = this.game.width - 10;
        this.clockText.y = 10;
    }
    
    update() {
        this.board.Update();
        
        this.clock.Update();

        switch(this.clock.State) {
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }

        this.scoreText.text = this.scoreboard.Score.toLocaleString();

        this.clockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    }
}