class GameplayState extends Phaser.State {
    private background: Phaser.Image;
    private board: Board;
    private scoreboard: Scoreboard;
    private clock: Clock;

    create() {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);

        this.scoreboard = new Scoreboard(this.game);
        this.board = new Board(this.game, this.scoreboard);
        this.clock = new Clock(this.game);
    }

    update() {
        this.board.Update();
        this.scoreboard.Update();
        this.clock.Update(this);
    }

    private StartMenu() {
        this.game.state.start("Menu");
    }

    StartResults() {
        this.game.state.start("Results", true, false, this.scoreboard);
    }
}