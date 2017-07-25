class GameplayState extends Phaser.State {
    private background: Phaser.Image;
    private board: Board;
    private scoreboard: Scoreboard;
    private scoreboardRenderer: ScoreboardRenderer;
    private clock: Clock;
    private clockRenderer: ClockRenderer;
    private backButton: Phaser.Button;

    private horizontalMargin: number;
    private verticalMargin: number;
    

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

        if(this.clock == undefined) {
            this.clock = new Clock(this.game);
        }

        if(this.scoreboard == undefined) {
            this.scoreboard = new Scoreboard(this.game);
        }

        this.board = new Board(this.game, this.scoreboard);

        this.scoreboard.Reset();

        this.scoreboardRenderer = new ScoreboardRenderer(this.scoreboard, this.game);

        this.clockRenderer = new ClockRenderer(this.clock, this.game);

        this.backButton = this.add.button(0, 0, "BackButton", this.OnBackButtonClick, this);

        // Position the UI
        this.PositionUI();
    }

    PositionUI() {
        let isLandscape = this.game.height / this.game.width < 1.3 ? true : false;

        if(isLandscape) {
            let availableGridSpace: number = Math.min(this.game.width * 2 / 3, this.game.height);
            BlockRenderer.CalculatedSize = (availableGridSpace * 0.9) / Board.Rows;
            this.horizontalMargin = this.game.width * 0.95 - Board.Columns * BlockRenderer.CalculatedSize
            this.verticalMargin = (this.game.height - Board.Rows * BlockRenderer.CalculatedSize) / 2;

            this.board.Renderer.Group.x = this.horizontalMargin;
            this.board.Renderer.Group.y = this.verticalMargin;

            this.ScaleSprite(this.backButton, this.game.width / 3, this.game.height / 6, 50, 1, false);
            this.backButton.x = 0;
            this.backButton.y = this.verticalMargin;

            this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.game.height / 3, 50, 1, false);
            this.clockRenderer.ClockText.x = this.game.width / 6;
            this.clockRenderer.ClockText.y = this.verticalMargin + 200;
            
            this.ScaleSprite(this.scoreboardRenderer.ScoreText, this.game.width / 3, this.game.height / 3, 50, 1, false);
            this.scoreboardRenderer.ScoreText.x = this.game.width / 6;
            this.scoreboardRenderer.ScoreText.y = this.verticalMargin + 400;
        } else {
            let availableGridSpace: number = this.game.width;
            BlockRenderer.CalculatedSize = (availableGridSpace * 0.9) / Board.Columns;
            this.horizontalMargin = (this.game.width - Board.Columns * BlockRenderer.CalculatedSize) / 2;
            this.verticalMargin = (this.game.height - Board.Rows * BlockRenderer.CalculatedSize) / 2;

            this.board.Renderer.Group.x = this.horizontalMargin;
            this.board.Renderer.Group.y = this.verticalMargin;

            this.ScaleSprite(this.backButton, this.game.width / 3, this.verticalMargin, 10, 1, false);
            this.backButton.x = 0;
            this.backButton.y = 0;

            this.ScaleSprite(this.clockRenderer.ClockText, this.game.width / 3, this.verticalMargin, 10, 1, false);
            this.clockRenderer.ClockText.x = this.game.world.centerX;
            this.clockRenderer.ClockText.y = this.verticalMargin / 2;
            
            this.ScaleSprite(this.scoreboardRenderer.ScoreText, this.game.width / 3, this.verticalMargin, 10, 1, false);
            this.scoreboardRenderer.ScoreText.x = this.game.width - this.scoreboardRenderer.ScoreText.width / 2;
            this.scoreboardRenderer.ScoreText.y = this.verticalMargin / 2;
        }

        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                this.ScaleSprite(this.board.Blocks[x][y].Sprite, BlockRenderer.CalculatedSize, BlockRenderer.CalculatedSize, 0, 1, true);
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

    private OnBackButtonClick() {
        this.game.state.start("Menu", true, false, this.clock, this.scoreboard);
    }

    resize() {
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.PositionUI();
    }

    update() {
        this.board.Update();
        
        this.clock.Update();

        switch(this.clock.State) {
            case ClockState.Results:
                this.game.state.start("Results", true, false, this.clock, this.scoreboard);
                break;
            case ClockState.Leaderboard:
                this.game.state.start("Leaderboard", true, false, this.clock, this.scoreboard);
                break;
            default:
                break;
        }

        this.scoreboardRenderer.Update();
        this.clockRenderer.Update();
    }
}