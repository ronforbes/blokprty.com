class MenuState extends Phaser.State {
    private backgroundImage: Phaser.Image;
    private logoImage: Phaser.Image;
    private playButton: Phaser.Button;
    private loginButton: Phaser.Button;
    private clock: Clock;
    private scoreboard: Scoreboard;
    static Name: string;
    private nameText: Phaser.Text;
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

        this.backgroundImage = this.add.image(0, 0, "Background");

        this.logoImage = this.add.image(0, 0, "Logo");
        this.logoImage.anchor.setTo(0.5);

        this.playButton = this.add.button(0, 0, "PlayButton", this.OnPlayButton_Click, this);
        this.playButton.anchor.setTo(0.5);

        this.loginButton = this.add.button(0, 0, "LoginButton", this.OnLoginButton_Click, this);
        this.loginButton.anchor.setTo(0.5);

        let nameStyle = { font: "20px Arial", fill: "#ffffff", align: "center" };
        this.nameText = this.add.text(0, 0, "", nameStyle);
        this.nameText.anchor.setTo(0.5);
        this.nameText.visible = false;

        this.resize();

        MenuState.LoggedIn = false;

        FB.getLoginStatus(function(statusResponse) {
            if(statusResponse.status == "connected") {
                FB.api("/me", { fields: "first_name" }, function(apiResponse) {
                    MenuState.Name = apiResponse.first_name;
                });

                MenuState.LoggedIn = true;
            }
        });
    }

    private OnPlayButton_Click() {
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

            FB.api("/me", { fields: "first_name" }, function(apiResponse) {
                MenuState.Name = apiResponse.first_name;
            });

            MenuState.LoggedIn = true;
        });
    }

    resize() {
        // position the background
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;

        this.ScaleSprite(this.logoImage, this.game.width, this.game.height / 3, 0, 1);
        this.logoImage.x = this.world.centerX;
        this.logoImage.y = this.world.centerY - this.game.height / 3;

        this.ScaleSprite(this.playButton, this.game.width / 2, this.game.height / 3, 0, 1);
        this.playButton.x = this.world.centerX;
        this.playButton.y = this.world.centerY;

        this.ScaleSprite(this.loginButton, this.game.width / 2, this.game.height / 3, 0, 1);
        this.loginButton.x = this.world.centerX;
        this.loginButton.y = this.world.centerY + this.game.height / 3;

        this.ScaleSprite(this.nameText, this.game.width / 2, this.game.height / 3, 0, 1);
        this.nameText.x = this.world.centerX;
        this.nameText.y = this.world.centerY + this.game.height / 3;
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

        if(MenuState.LoggedIn) {
            this.loginButton.visible = false;
            this.nameText.text = "Hello, " + MenuState.Name;
            this.nameText.visible = true;
        }
        
    }
}