class ResultsState extends Phaser.State {
    private background: Phaser.Image;
    private scoreboard: Scoreboard;
    private scoreText: Phaser.Text;

    init(scoreboard: Scoreboard) {
        this.scoreboard = scoreboard;
    }

    create() {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);

        let style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = this.add.text(this.world.centerX, this.world.centerY, "Score: " + this.scoreboard.Score, style);
        this.scoreText.anchor.setTo(0.5, 0.5);
    }

    private StartMenu() {
        this.game.state.start("Menu");
    }

    StartLeaderboard() {
        this.game.state.start("Leaderboard");
    }
}