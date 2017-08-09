class MenuState extends Phaser.State {
    private backgroundImage: Phaser.TileSprite;
    private logoImage: Phaser.Image;
    private playButton: Phaser.Button;
    private loginButton: Phaser.Button;
    private nameText: Phaser.Text;
    private feedbackButton: Phaser.Button;
    private feedbackLabel: Phaser.Text;
    private clock: Clock;
    private scoreboard: Scoreboard;
    static Name: string;
    static LoggedIn: boolean;

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
        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }

        if(MenuState.Name == "" || MenuState.Name == undefined) {
            MenuState.Name = "Guest";
        }

        this.backgroundImage = this.add.tileSprite(0, 0, 1600, 1600, "BlokPrtyBG");

        this.logoImage = this.add.image(0, 0, "BlokPrty-Fixed");
        this.logoImage.anchor.setTo(0.5, 0);

        this.playButton = this.add.button(0, 0, "PlayButton", this.OnPlayButton_Click, this);
        this.playButton.anchor.setTo(0.5, 0);

        this.loginButton = this.add.button(0, 0, "LoginButton", this.OnLoginButton_Click, this);
        this.loginButton.anchor.setTo(0.5, 0);

        let nameStyle = { font: "30px Arial", fill: "#ffffff", align: "center" };
        this.nameText = this.add.text(0, 0, "", nameStyle);
        this.nameText.anchor.setTo(0.5, 0);
        this.nameText.visible = false;

        this.feedbackButton = this.add.button(0, 0, "UseResponseLogo", this.OnFeedbackButton_Click, this);
        this.feedbackButton.anchor.setTo(0, 1);

        let feedbackStyle = { font: "20px Arial", fill: "#ffffff" };
        this.feedbackLabel = this.add.text(0, 0, "Feedback", feedbackStyle);
        this.feedbackLabel.anchor.setTo(0, 1);

        this.scale.onOrientationChange.add(this.resize);
        this.resize();

        MenuState.LoggedIn = false;

        FB.getLoginStatus(function(statusResponse) {
            if(statusResponse.status == "connected") {
                FB.api("/me", { fields: "first_name,last_name" }, function(apiResponse) {
                    let s: string = apiResponse.last_name;
                    let lastInitial: string = s.charAt(0);
                    MenuState.Name = apiResponse.first_name + " " + lastInitial + ".";
                });

                MenuState.LoggedIn = true;
            }
        });
    }

    private OnPlayButton_Click() {
        ga('send', 'event', 'Menu', 'Started Playing');

        switch(this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard, MenuState.Name);
                break;
            
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, MenuState.Name);
                break;

            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, MenuState.Name);
                break;
        }
    }

    private OnLoginButton_Click() {
        FB.getLoginStatus(function(response) {
            if(response.status != "connected") {
                FB.login(function(loginResponse) {
                });
            }

            FB.api("/me", { fields: "first_name,last_name" }, function(apiResponse) {
                let s: string = apiResponse.last_name;
                let lastInitial: string = s.charAt(0);
                MenuState.Name = apiResponse.first_name + " " + lastInitial + ".";
            });

            MenuState.LoggedIn = true;
        });

        ga('send', 'event', 'Menu', 'Logged In');
    }

    private OnFeedbackButton_Click() {
        window.open("https://blokprty.useresponse.com/");
    }

    resize() {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;

        this.logoImage.width = this.game.width * 0.5;
        this.logoImage.height = this.game.height * 0.5;
        this.logoImage.x = this.world.centerX;
        this.logoImage.y = this.game.height * 0.05;

        this.playButton.width = this.game.width * 0.5;
        this.playButton.height = this.game.height * 0.2;
        this.playButton.x = this.world.centerX;
        this.playButton.y = this.world.centerY + this.game.height * 0.05;

        this.loginButton.width = this.game.width * 0.5;
        this.loginButton.height = this.game.height * 0.2;
        this.loginButton.x = this.world.centerX;
        this.loginButton.y = this.playButton.y + this.playButton.height + this.game.height * 0.05;

        this.nameText.x = this.world.centerX;
        this.nameText.y = this.playButton.y + this.playButton.height + this.game.height * 0.05;

        this.feedbackLabel.width = this.game.width / 20;
        this.feedbackLabel.height = this.game.width / 40;
        this.feedbackLabel.x = this.game.width / 20;
        this.feedbackLabel.y = this.game.height;

        this.feedbackButton.width = this.game.width / 20;
        this.feedbackButton.height = this.game.width / 20;
        this.feedbackButton.x = this.game.width / 20;
        this.feedbackButton.y = this.game.height - this.feedbackLabel.height;
    }

    update() {
        this.backgroundImage.tilePosition.x += 1;
        this.backgroundImage.tilePosition.y += 1;

        this.clock.Update();

        if(MenuState.LoggedIn) {
            this.loginButton.visible = false;
            this.nameText.text = "Hello, " + MenuState.Name;
            this.nameText.addColor("#ff5817", 7);
            this.nameText.visible = true;
        }
    }
}