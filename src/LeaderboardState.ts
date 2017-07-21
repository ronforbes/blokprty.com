class LeaderboardState extends Phaser.State {
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private scoreboard: Scoreboard;
    private background: Phaser.Image;
    private leaderboardText: Phaser.Text;
    private backButton: Phaser.Button;

    init(clock: Clock, scoreboard: Scoreboard) {
        this.scoreboard = scoreboard;
        this.clock = clock;
    }

    create() {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);

        let style = { font: "48px Arial", fill: "#ffffff" };
        this.leaderboardText = this.add.text(this.world.centerX, this.world.centerY, "Leaderboards coming soon!", style);
        this.leaderboardText.anchor.setTo(0.5, 0.5);

        this.clockRenderer = new ClockRenderer(this.clock, this.game);

        this.backButton = this.game.add.button(10, 10, "BackButton", this.OnBackButtonClick, this);
    }

    private OnBackButtonClick() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    }

    update() {
        this.clock.Update();

        switch(this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }

        this.clockRenderer.Update();
    }
}