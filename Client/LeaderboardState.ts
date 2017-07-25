class LeaderboardResult {
    name: string;
    score: number;
}

class LeaderboardState extends Phaser.State {
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private scoreboard: Scoreboard;
    private background: Phaser.Image;
    private leaderboardText: Phaser.Text;
    private backButton: Phaser.Button;
    private request: XMLHttpRequest;
    static LeaderboardResults: LeaderboardResult[];

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
        this.leaderboardText = this.add.text(this.world.centerX, this.world.centerY, "Loading...", style);
        this.leaderboardText.anchor.setTo(0.5, 0.5);

        this.clockRenderer = new ClockRenderer(this.clock, this.game);

        this.backButton = this.game.add.button(0, 0, "BackButton", this.OnBackButtonClick, this);

        this.PositionUI();

        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = this.OnServerLeaderboardReceived;
            
        this.request.open("GET", "/api/leaderboard", true);
        this.request.send();
    }

    private OnBackButtonClick() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    }

    OnServerLeaderboardReceived(this: XMLHttpRequest, ev: Event) {
        if(this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));
                
            LeaderboardState.LeaderboardResults = JSON.parse(this.responseText);
        }
    }

    PositionUI() {
        this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 50, 1);
        this.clockRenderer.ClockText.x = this.game.width - this.clockRenderer.ClockText.width / 2;
        this.clockRenderer.ClockText.y = this.clockRenderer.ClockText.height / 2;

        this.ScaleSprite(this.backButton, this.game.width / 3, this.game.height / 6, 50, 1);
        this.backButton.x = 0;
        this.backButton.y = 0;
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
            this.leaderboardText.text = "";
            for(let n = 0; n < LeaderboardState.LeaderboardResults.length; n++) {
                this.leaderboardText.text += (n + 1).toString() + ". " + LeaderboardState.LeaderboardResults[n].name + ": " + LeaderboardState.LeaderboardResults[n].score + "\n";
            }
            
        }

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