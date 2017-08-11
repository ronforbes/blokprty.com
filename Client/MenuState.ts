class MenuState extends Phaser.State {
    private backgroundImage: Phaser.TileSprite;
    private logoImage: Phaser.Image;
    private playButton: Phaser.Button;
    private loginButton: Phaser.Button;
    private nameText: Phaser.Text;
    private facebookLabel: Phaser.Text;
    private facebookButton: Phaser.Button;
    private twitterLabel: Phaser.Text;
    private twitterButton: Phaser.Button;
    private instagramLabel: Phaser.Text;
    private instagramButton: Phaser.Button;
    private tumblrLabel: Phaser.Text;
    private tumblrButton: Phaser.Button;
    private feedbackLabel: Phaser.Text;
    private feedbackButton: Phaser.Button;
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

        let textStyle = { font: "20px Arial", fill: "#ffffff", align: "right" };
        this.facebookLabel = this.add.text(0, 0, "Facebook", textStyle);
        this.facebookLabel.anchor.setTo(1, 1);
        
        this.facebookButton = this.add.button(0, 0, "FacebookLogo", this.OnFacebookButton_Click, this);
        this.facebookButton.anchor.setTo(1, 1);

        this.twitterLabel = this.add.text(0, 0, "Twitter", textStyle);
        this.twitterLabel.anchor.setTo(1, 1);

        this.twitterButton = this.add.button(0, 0, "TwitterLogo", this.OnTwitterButton_Click, this);
        this.twitterButton.anchor.setTo(1, 1);

        this.instagramLabel = this.add.text(0, 0, "Instagram", textStyle);
        this.instagramLabel.anchor.setTo(1, 1);

        this.instagramButton = this.add.button(0, 0, "InstagramLogo", this.OnInstagramButton_Click, this);
        this.instagramButton.anchor.setTo(1, 1);

        this.tumblrLabel = this.add.text(0, 0, "Tumblr", textStyle);
        this.tumblrLabel.anchor.setTo(1, 1);

        this.tumblrButton = this.add.button(0, 0, "TumblrLogo", this.OnTumblrButton_Click, this);
        this.tumblrButton.anchor.setTo(1, 1);

        this.feedbackLabel = this.add.text(0, 0, "Feedback", textStyle);
        this.feedbackLabel.anchor.setTo(1, 1);

        this.feedbackButton = this.add.button(0, 0, "UseResponseLogo", this.OnFeedbackButton_Click, this);
        this.feedbackButton.anchor.setTo(1, 1);

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

    private OnFacebookButton_Click() {
        window.open("https://www.facebook.com/Blok-Prty-206750359857091/");
    }

    private OnTwitterButton_Click() {
        window.open("https://twitter.com/blokprtyllc");
    }

    private OnInstagramButton_Click() {
        window.open("https://www.instagram.com/blokprty/");
    }

    private OnTumblrButton_Click() {
        window.open("https://blokprty.tumblr.com/");
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

        this.feedbackLabel.x = this.game.width;
        this.feedbackLabel.y = this.game.height;

        this.feedbackButton.width = this.feedbackButton.height = this.feedbackLabel.height;
        this.feedbackButton.x = this.feedbackLabel.x - this.feedbackLabel.width;
        this.feedbackButton.y = this.feedbackLabel.y;

        this.tumblrLabel.x = this.game.width;
        this.tumblrLabel.y = this.feedbackLabel.y - this.feedbackLabel.height;

        this.tumblrButton.width = this.tumblrButton.height = this.tumblrLabel.height;
        this.tumblrButton.x = this.tumblrLabel.x - this.tumblrLabel.width;
        this.tumblrButton.y = this.tumblrLabel.y;

        this.instagramLabel.x = this.game.width;
        this.instagramLabel.y = this.tumblrLabel.y - this.tumblrLabel.height;

        this.instagramButton.width = this.instagramButton.height = this.instagramLabel.height;
        this.instagramButton.x = this.instagramLabel.x - this.instagramLabel.width;
        this.instagramButton.y = this.instagramLabel.y;

        this.twitterLabel.x = this.game.width;
        this.twitterLabel.y = this.instagramLabel.y - this.instagramLabel.height;

        this.twitterButton.width = this.twitterButton.height = this.twitterLabel.height;
        this.twitterButton.x = this.twitterLabel.x - this.twitterLabel.width;
        this.twitterButton.y = this.twitterLabel.y;

        this.facebookLabel.x = this.game.width;
        this.facebookLabel.y = this.twitterLabel.y - this.twitterLabel.height;

        this.facebookButton.width = this.facebookButton.height = this.facebookLabel.height;
        this.facebookButton.x = this.facebookLabel.x - this.facebookLabel.width;
        this.facebookButton.y = this.facebookLabel.y;
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