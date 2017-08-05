class ResultsState extends Phaser.State {
    private clock: Clock;
    private scoreboard: Scoreboard;
    private name: string;
    private request: XMLHttpRequest;
    private backgroundImage: Phaser.Image;
    private scoreLabel: Phaser.Text;
    private scoreText: Phaser.Text;
    private clockText: Phaser.Text;
    private backButton: Phaser.Button;

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
        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }
        if(this.name == undefined) {
            this.name = "Guest";
        }

        this.backgroundImage = this.add.image(0, 0, "Background");

        this.scoreLabel = this.add.text(0, 0, "Final Score", { font: "70px Arial", fill: "#ffffff", align: "center" });
        this.scoreLabel.anchor.setTo(0.5, 0);

        this.scoreText = this.add.text(0, 0, this.scoreboard.Score.toLocaleString(), { font: "70px Arial", fill: "#ffffff", align: "center" });
        this.scoreText.anchor.setTo(0.5, 0);

        this.clockText = this.add.text(0, 0, "15", { font: "40px Arial", fill: "#ffffff", align: "right" });
        this.clockText.anchor.setTo(1, 0);

        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);

        this.request = new XMLHttpRequest();
        this.request.open("POST", "/api/gameresults", true);
        this.request.setRequestHeader("Content-type", "application/json");
        this.request.send(JSON.stringify({name: this.name, score: this.scoreboard.Score}));

        this.resize();
    }

    private OnBackButton_Click() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    }

    resize() {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;

        this.backButton.width = 40;
        this.backButton.height = 50;
        this.backButton.x = 10;
        this.backButton.y = 10;

        this.clockText.x = this.game.width - 10;
        this.clockText.y = 10;
        
        let shortDimension: number = Math.min(this.game.width, this.game.height);
        this.scoreText.fontSize = shortDimension * 0.1;
        this.scoreText.x = this.world.centerX;
        this.scoreText.y = this.world.centerY;

        this.scoreLabel.fontSize = shortDimension * 0.1;
        this.scoreLabel.x = this.world.centerX;
        this.scoreLabel.y = this.world.centerY - this.scoreText.height;
    }

    update() {
        this.clock.Update();
        
        switch(this.clock.State) {
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }
        
        this.clockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    }
}