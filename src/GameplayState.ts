class GameplayState extends Phaser.State {
    private background: Phaser.Image;
    private board: Board;
    private scoreboard: Scoreboard;
    private scoreboardRenderer: ScoreboardRenderer;
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private backButton: Phaser.Button;

    init(clock: Clock, scoreboard: Scoreboard) {
        this.clock = clock;
        this.scoreboard = scoreboard;
    }

    create() {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);

        this.board = new Board(this.game, this.scoreboard);

        this.scoreboard.Reset();

        this.scoreboardRenderer = new ScoreboardRenderer(this.scoreboard, this.game);

        this.clockRenderer = new ClockRenderer(this.clock, this.game);

        this.backButton = this.add.button(10, 10, "BackButton", this.OnBackButtonClick, this);

        this.scale.onSizeChange.add(this.OnSizeChange, this);
    }

    private OnSizeChange() {
        console.log("OnSizeChange: GameplayState");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);
    }

    private OnBackButtonClick() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    }

    update() {
        this.board.Update();
        
        this.clock.Update();

        switch(this.clock.State) {
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }

        this.scoreboardRenderer.Update();
        this.clockRenderer.Update();
    }
}