class ResultsState extends Phaser.State {
    private background: Phaser.Image;
    private scoreboard: Scoreboard;
    private scoreText: Phaser.Text;
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private backButton: Phaser.Button;
    private request: XMLHttpRequest;

    init(clock: Clock, scoreboard: Scoreboard) {
        this.scoreboard = scoreboard;
        this.clock = clock;
    }

    create() {
        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);

        let style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = this.add.text(this.world.centerX, this.world.centerY, "Score: " + this.scoreboard.Score, style);
        this.scoreText.anchor.setTo(0.5, 0.5);

        this.clockRenderer = new ClockRenderer(this.clock, this.game);

        this.backButton = this.add.button(10, 10, "BackButton", this.OnBackButtonClick, this);

        this.request = new XMLHttpRequest();
        this.request.open("POST", "/api/gameresults", true);
        this.request.setRequestHeader("Content-type", "application/json");
        this.request.send(JSON.stringify({name: "Guest", score: this.scoreboard.Score}));
    }

    private OnBackButtonClick() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    }

    update() {
        this.clock.Update();

        switch(this.clock.State) {
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }

        this.clockRenderer.Update();
    }
}