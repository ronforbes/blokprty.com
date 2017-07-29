class LeaderboardResult {
    name: string;
    score: number;

    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }
}

class LeaderboardState extends Phaser.State {
    private clock: Clock;
    private nextGameCountdownLabel: Phaser.Image;
    private clockRenderer: ClockRenderer;
    private scoreboard: Scoreboard;
    private backgroundImage: Phaser.Image;
    private rankText: Phaser.Text;
    private nameText: Phaser.Text;
    private scoreText: Phaser.Text;
    private backButton: Phaser.Button;
    private request: XMLHttpRequest;
    private leaderboardLabel: Phaser.Image;
    static LeaderboardResults: LeaderboardResult[];
    private name: string;

    init(clock: Clock, scoreboard: Scoreboard, name: string) {
        if(clock != undefined) {
            this.clock = clock;
        }

        if(scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }

        if(name != undefined) {
            MenuState.Name = name;
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

        this.nextGameCountdownLabel = this.add.image(0, 0, "NextGameCountdownLabel");
        this.nextGameCountdownLabel.anchor.setTo(0.5);

        let rankStyle = { font: "20px Arial", fill: "#ffffff", align: "left" };
        this.rankText = this.add.text(0, 0, "Loading...", rankStyle);
        this.rankText.anchor.setTo(0, 0);

        let nameStyle = { font: "20px Arial", fill: "#ffffff", align: "center" };
        this.nameText = this.add.text(0, 0, "Loading...", nameStyle);
        this.nameText.anchor.setTo(0.5, 0);

        let scoreStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.scoreText = this.add.text(0, 0, "Loading...", scoreStyle);
        this.scoreText.anchor.setTo(1, 0);

        this.clockRenderer = new ClockRenderer(this.clock, this);

        this.backButton = this.game.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);

        this.leaderboardLabel = this.game.add.image(0, 0, "LeaderboardLabel");
        this.leaderboardLabel.anchor.setTo(0.5, 0);

        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = this.OnServerLeaderboardReceived;            
        this.request.open("GET", "/api/leaderboard", true);
        this.request.send();

        this.resize();
    }

    private OnBackButton_Click() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    }

    OnServerLeaderboardReceived(this: XMLHttpRequest, ev: Event) {
        if(this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));
                
            LeaderboardState.LeaderboardResults = JSON.parse(this.responseText);
        }
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

        this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 50, 1);
        this.clockRenderer.ClockText.x = this.game.width - this.nextGameCountdownLabel.width / 2;
        this.clockRenderer.ClockText.y = this.nextGameCountdownLabel.height / 2;

        this.ScaleSprite(this.leaderboardLabel, this.game.width, this.game.height / 3, 0, 1);
        this.leaderboardLabel.x = this.world.centerX;
        this.leaderboardLabel.y = this.nextGameCountdownLabel.height;

        this.ScaleSprite(this.rankText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.rankText.x = 0;
        this.rankText.y = this.nextGameCountdownLabel.height + this.leaderboardLabel.height;

        this.ScaleSprite(this.nameText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.nameText.x = this.world.centerX;
        this.nameText.y = this.nextGameCountdownLabel.height + this.leaderboardLabel.height;

        this.ScaleSprite(this.scoreText, this.game.width / 3, this.game.height / 3, 0, 1);
        this.scoreText.x = this.game.width;
        this.scoreText.y = this.nextGameCountdownLabel.height + this.leaderboardLabel.height;
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

    update() {
        this.clock.Update();

        if(LeaderboardState.LeaderboardResults != undefined) {
            this.rankText.text = "";
            this.nameText.text = "";
            this.scoreText.text = "";

            for(let n = 0; n < LeaderboardState.LeaderboardResults.length; n++) {
                this.rankText.text += (n + 1).toString() + "\n";
                this.nameText.text += LeaderboardState.LeaderboardResults[n].name + "\n";
                this.scoreText.text += LeaderboardState.LeaderboardResults[n].score + "\n";
            }
            
        }
        
        switch(this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }
        
        this.clockRenderer.Update();
    }
}