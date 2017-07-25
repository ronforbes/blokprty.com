class ScoreboardRenderer {
    private scoreboard: Scoreboard;
    ScoreText: Phaser.Text;

    constructor(scoreboard: Scoreboard, phaserGame: Phaser.Game) {
        this.scoreboard = scoreboard;

        let style = { font: "48px Arial", fill: "#ffffff" };
        this.ScoreText = phaserGame.add.text(0, 0, "Score: 0", style);
        this.ScoreText.anchor.setTo(0.5);
    }

    Update() {
        this.ScoreText.text = "Score: " + this.scoreboard.Score;
    }
}