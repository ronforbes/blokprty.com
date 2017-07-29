class GameplayState extends Phaser.State {
    private backgroundImage: Phaser.Image;
    private board: Board;
    private scoreboard: Scoreboard;
    private scoreboardRenderer: ScoreboardRenderer;
    private scoreLabel: Phaser.Image;
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private timeLabel: Phaser.Image;
    private backButton: Phaser.Button;
    private horizontalMargin: number;
    private verticalMargin: number;
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
        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }

        if(this.name == undefined) {
            this.name = "Guest";
        }

        this.backgroundImage = this.add.image(0, 0, "Background");

        this.board = new Board(this.game, this.scoreboard);

        this.scoreboard.Reset();

        this.scoreLabel = this.add.image(0, 0, "ScoreLabel");
        this.scoreLabel.anchor.setTo(0.5);

        this.scoreboardRenderer = new ScoreboardRenderer(this.scoreboard, this);

        this.timeLabel = this.add.image(0, 0, "TimeLabel");
        this.timeLabel.anchor.setTo(0.5);

        this.clockRenderer = new ClockRenderer(this.clock, this);

        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButton_Click, this);

        this.resize();
    }

    private OnBackButton_Click() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard, this.name);
    }

    resize() {
        this.backgroundImage.width = this.game.width;
        this.backgroundImage.height = this.game.height;

        let isLandscape = this.game.height / this.game.width < 1.3 ? true : false;

        if(isLandscape) {
            let availableGridSpace: number = Math.min(this.game.width * 2 / 3, this.game.height);
            BlockRenderer.Size = (availableGridSpace * 0.9) / Board.Rows;
            this.horizontalMargin = this.game.width * 0.95 - Board.Columns * BlockRenderer.Size
            this.verticalMargin = (this.game.height - Board.Rows * BlockRenderer.Size) / 2;

            this.board.Renderer.Group.x = this.horizontalMargin;
            this.board.Renderer.Group.y = this.verticalMargin;

            this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1, false);
            this.backButton.x = 0;
            this.backButton.y = 0;

            this.ScaleSprite(this.timeLabel, this.game.width / 3, this.game.height / 3, 0, 1, false);
            this.timeLabel.x = this.horizontalMargin / 2;
            this.timeLabel.y = this.world.centerY - this.game.height / 3;

            this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 50, 1, false);
            this.clockRenderer.ClockText.x = this.horizontalMargin / 2;
            this.clockRenderer.ClockText.y = this.world.centerY - this.game.height / 3 + this.timeLabel.height / 4;
            
            this.ScaleSprite(this.scoreLabel, this.game.width / 3, this.game.height / 3, 0, 1, false);
            this.scoreLabel.x = this.horizontalMargin / 2;
            this.scoreLabel.y = this.world.centerY;
            
            this.ScaleSprite(this.scoreboardRenderer.ScoreText, this.game.width / 3, this.game.height / 3, 50, 1, false);
            this.scoreboardRenderer.ScoreText.x = this.horizontalMargin / 2;
            this.scoreboardRenderer.ScoreText.y = this.world.centerY + this.scoreLabel.height / 4;
        } else {
            let availableGridSpace: number = this.game.width;
            BlockRenderer.Size = (availableGridSpace * 0.9) / Board.Columns;
            this.horizontalMargin = (this.game.width - Board.Columns * BlockRenderer.Size) / 2;
            this.verticalMargin = (this.game.height - Board.Rows * BlockRenderer.Size) / 2;

            this.board.Renderer.Group.x = this.horizontalMargin;
            this.board.Renderer.Group.y = this.verticalMargin;

            this.ScaleSprite(this.backButton, this.game.width / 10, this.game.height / 10, 0, 1, false);
            this.backButton.x = 0;
            this.backButton.y = 0;

            this.ScaleSprite(this.timeLabel, this.game.width / 3, this.verticalMargin, 0, 1, false);
            this.timeLabel.x = this.game.world.centerX - this.game.width / 3 + this.horizontalMargin;
            this.timeLabel.y = this.verticalMargin / 2;

            this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.verticalMargin, 0, 0.5, false);
            this.clockRenderer.ClockText.x = this.game.world.centerX - this.game.width / 3 + this.horizontalMargin;
            this.clockRenderer.ClockText.y = this.verticalMargin / 2 + this.timeLabel.height / 4;
            
            this.ScaleSprite(this.scoreLabel, this.game.width / 3, this.verticalMargin, 0, 1, false);
            this.scoreLabel.x = this.game.world.centerX + this.game.width / 3 - this.horizontalMargin;
            this.scoreLabel.y = this.verticalMargin / 2;

            this.ScaleSprite(this.scoreboardRenderer.ScoreText, this.game.width / 3, this.verticalMargin, 10, 0.5, false);
            this.scoreboardRenderer.ScoreText.x = this.game.world.centerX + this.game.width / 3 - this.horizontalMargin;
            this.scoreboardRenderer.ScoreText.y = this.verticalMargin / 2 + this.scoreLabel.height / 4;
        }

        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                this.ScaleSprite(this.board.Blocks[x][y].Sprite, BlockRenderer.Size, BlockRenderer.Size, 0, 1, true);
            }
        }
    }

    ScaleSprite(sprite, availableSpaceWidth: number, availableSpaceHeight: number, padding: number, scaleMultiplier: number, isFullScale) {
        let scale: number = this.GetSpriteScale(sprite.width, sprite.height, availableSpaceWidth, availableSpaceHeight, padding, isFullScale);
        sprite.scale.x = scale * scaleMultiplier;
        sprite.scale.y = scale * scaleMultiplier;
    }

    GetSpriteScale(spriteWidth: number, spriteHeight: number, availableSpaceWidth: number, availableSpaceHeight: number, minimumPadding: number, isFullScale: boolean): number {
        let ratio: number = 1;
        let devicePixelRatio = window.devicePixelRatio;

        // Sprite needs to fit in either width or height
        let widthRatio = (spriteWidth * devicePixelRatio + 2 * minimumPadding) / availableSpaceWidth;
        let heightRatio = (spriteHeight * devicePixelRatio + 2 * minimumPadding) / availableSpaceHeight;

        if(widthRatio > 1 || heightRatio > 1 || isFullScale) {
            ratio = 1 / Math.max(widthRatio, heightRatio);
        }

        return ratio * devicePixelRatio;
    }
    
    update() {
        this.board.Update();
        
        this.clock.Update();

        switch(this.clock.State) {
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard, this.name);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard, this.name);
                break;
            default:
                break;
        }

        this.scoreboardRenderer.Update();
        this.clockRenderer.Update();
    }
}