class ScoreboardRenderer {
    private scoreboard: Scoreboard;
    private scoreText: Phaser.Text;

    constructor(scoreboard: Scoreboard, phaserGame: Phaser.Game) {
        this.scoreboard = scoreboard;

        let style = { font: "48px Arial", fill: "#ffffff" };
        this.scoreText = phaserGame.add.text(10, 150, "Score: 0", style);
    }

    Update() {
        this.scoreText.text = "Score: " + this.scoreboard.Score;
    }
}