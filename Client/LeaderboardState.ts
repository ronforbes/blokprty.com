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
    private scoreboard: Scoreboard;
    private name: string;
    private request: XMLHttpRequest;
    private backgroundImage: Phaser.Image;
    private clockText: Phaser.Text;
    private rankLabel: Phaser.Text;
    private rankText: Phaser.Text;
    private nameLabel: Phaser.Text;
    private nameText: Phaser.Text;
    private scoreLabel: Phaser.Text;
    private scoreText: Phaser.Text;
    private backButton: Phaser.Button;
    static LeaderboardResults: LeaderboardResult[];

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

        this.clockText = this.add.text(0, 0, "15", { font: "40px Arial", fill: "#ffffff", align: "right" });
        this.clockText.anchor.setTo(1, 0);

        this.rankLabel = this.add.text(0, 0, "Rank", { font: "bold 20px Arial", fill: "#ffffff", align: "left" });
        this.rankLabel.anchor.setTo(0, 0);

        let rankStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.rankText = this.add.text(0, 0, "Loading...", rankStyle);
        this.rankText.anchor.setTo(1, 0);

        this.nameLabel = this.add.text(0, 0, "Name", { font: "bold 20px Arial", fill: "#ffffff", align: "left" });
        this.nameLabel.anchor.setTo(0, 0);

        let nameStyle = { font: "20px Arial", fill: "#ffffff", align: "left" };
        this.nameText = this.add.text(0, 0, "Loading...", nameStyle);
        this.nameText.anchor.setTo(0, 0);

        this.scoreLabel = this.add.text(0, 0, "Score", { font: "bold 20px Arial", fill: "#ffffff", align: "right" });
        this.scoreLabel.anchor.setTo(1, 0);

        let scoreStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.scoreText = this.add.text(0, 0, "Loading...", scoreStyle);
        this.scoreText.anchor.setTo(1, 0);

        this.backButton = this.game.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);

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

        this.backButton.width = 40;
        this.backButton.height = 50;
        this.backButton.x = 10;
        this.backButton.y = 10;

        this.clockText.x = this.game.width - 10;
        this.clockText.y = 10;

        this.rankLabel.x = 10;
        this.rankLabel.y = this.clockText.y + this.clockText.height + 10;

        this.nameLabel.x = this.rankLabel.x + this.rankLabel.width + 10;
        this.nameLabel.y = this.rankLabel.y;

        this.scoreLabel.x = this.game.width - 10;
        this.scoreLabel.y = this.rankLabel.y;

        this.rankText.x = this.rankLabel.x + this.rankLabel.width;
        this.rankText.y = this.rankLabel.y + this.rankLabel.height;

        this.nameText.x = this.nameLabel.x;
        this.nameText.y = this.nameLabel.y + this.nameLabel.height;

        this.scoreText.x = this.scoreLabel.x;
        this.scoreText.y = this.scoreLabel.y + this.scoreLabel.height;
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
                this.scoreText.text += LeaderboardState.LeaderboardResults[n].score.toLocaleString() + "\n";
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
        
        this.clockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    }
}