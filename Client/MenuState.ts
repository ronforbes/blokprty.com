class MenuState extends Phaser.State {
    private backgroundImage: Phaser.Image;
    private logoImage: Phaser.Image;
    private playButton: Phaser.Button;
    private loginButton: Phaser.Button;
    private clock: Clock;
    private scoreboard: Scoreboard;

    init(clock: Clock, scoreboard: Scoreboard) {
        if(clock != undefined) {
            this.clock = clock;
        }

        if(scoreboard != undefined) {
            this.scoreboard = scoreboard;
        }
    }

    create() {
        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }

        this.backgroundImage = this.add.image(0, 0, "Background");

        this.logoImage = this.add.image(0, 0, "Logo");
        this.logoImage.anchor.setTo(0.5);

        this.playButton = this.add.button(0, 0, "PlayButton", this.OnPlayButton_Click, this);
        this.playButton.anchor.setTo(0.5);

        this.loginButton = this.add.button(0, 0, "LoginButton", this.OnLoginButton_Click, this);
        this.loginButton.anchor.setTo(0.5);

        this.resize();
    }

    private OnPlayButton_Click() {
        switch(this.clock.State) {
            case ClockState.Gameplay:
                this.game.state.start("Gameplay", true, false, this.clock, this.scoreboard);
                break;
            
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;

            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
        }
    }

    private OnLoginButton_Click() {

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
    }
}