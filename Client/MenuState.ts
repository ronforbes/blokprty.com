class MenuState extends Phaser.State {
    private background: Phaser.Image;
    private logo: Phaser.Image;
    private playButton: Phaser.Button;
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
        this.background = this.add.image(0, 0, "Background");
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.logo = this.add.image(this.world.centerX, this.world.centerY - this.game.height / 3, "Logo");
        this.logo.anchor.setTo(0.5);
        this.ScaleSprite(this.logo, this.game.width, this.game.height / 3, 50, 1);

        this.playButton = this.add.button(this.world.centerX, this.world.centerY, "PlayButton", this.StartPlay, this);
        this.playButton.anchor.setTo(0.5);
        this.ScaleSprite(this.playButton, this.game.width, this.game.height / 3, 50, 1);

        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }
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
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.ScaleSprite(this.logo, this.game.width, this.game.height / 3, 50, 1);
        this.logo.x = this.world.centerX;
        this.logo.y = this.world.centerY - this.game.height / 3;

        this.ScaleSprite(this.playButton, this.game.width, this.game.height / 3, 50, 1);
        this.playButton.x = this.world.centerX;
        this.playButton.y = this.world.centerY;
    }

    private StartPlay() {
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

    update() {
        this.clock.Update();
    }
}