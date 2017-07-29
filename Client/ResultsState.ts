class ResultsState extends Phaser.State {
    private backgroundImage: Phaser.Image;
    private scoreboard: Scoreboard;
    private scoreText: Phaser.Text;
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private backButton: Phaser.Button;
    private nextGameCountdownLabel: Phaser.Image;
    private totalScoreLabel: Phaser.Image;
    private request: XMLHttpRequest;
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

        this.totalScoreLabel = this.add.image(0, 0, "TotalScoreLabel");
        this.totalScoreLabel.anchor.setTo(0.5);

        let style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = this.add.text(0, 0, this.scoreboard.Score.toString(), style);
        this.scoreText.anchor.setTo(0.5, 0.5);

        this.nextGameCountdownLabel = this.add.image(0, 0, "NextGameCountdownLabel");
        this.nextGameCountdownLabel.anchor.setTo(0.5);

        this.clockRenderer = new ClockRenderer(this.clock, this);

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

    ScaleSprite(sprite, availableSpaceWidth: number, availableSpaceHeight: number, padding: number, scaleMultiplier: number) {
        let scale: number = this.GetSpriteScale(sprite.width, sprite.height, availableSpaceWidth, availableSpaceHeight, padding);
        sprite.scale.x = scale * scaleMultiplier;
        sprite.scale.y = scale * scaleMultiplier;
    }

    GetSpriteScale(spriteWidth: number, spriteHeight: number, availableSpaceWidth: number, availableSpaceHeight: number, minimumPadding: number): number {
        let ratio: number = 1;
        let devicePixelRatio = window.devicePixelRatio;

        // sprite needs to fit in either width or height
        let widthRatio = (spriteWidth * devicePixelRatio + 2 * minimumPadding) / availableSpaceWidth;
        let heightRatio = (spriteHeight * devicePixelRatio + 2 * minimumPadding) / availableSpaceHeight;

        if(widthRatio > 1 || heightRatio > 1) {
            ratio = 1 / Math.max(widthRatio, heightRatio);
        }

        return ratio * devicePixelRatio;
    }

    resize() {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;

        this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1);
        this.backButton.x = 0;
        this.backButton.y = 0;

        this.ScaleSprite(this.nextGameCountdownLabel, this.game.width / 3, this.game.height / 3, 0, 1);
        this.nextGameCountdownLabel.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.nextGameCountdownLabel.y = this.nextGameCountdownLabel.height / 4;

        this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.clockRenderer.ClockText.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.clockRenderer.ClockText.y = this.nextGameCountdownLabel.height / 2;

        // position the score
        this.ScaleSprite(this.totalScoreLabel, this.game.width / 2, this.game.height / 3, 0, 1);
        this.totalScoreLabel.x = this.world.centerX;
        this.totalScoreLabel.y = this.world.centerY;
        
        this.ScaleSprite(this.scoreText, this.game.width / 2, this.game.height / 3, 0, 1);
        this.scoreText.x = this.world.centerX;
        this.scoreText.y = this.world.centerY + this.totalScoreLabel.height / 4;
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
        
        this.clockRenderer.Update();
    }
}