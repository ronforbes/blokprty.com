class ScoreboardRenderer {
    private scoreboard: Scoreboard;
    ScoreText: Phaser.Text;

    constructor(scoreboard: Scoreboard, state: Phaser.State) {
        this.scoreboard = scoreboard;

        let style = { font: "40px Arial", fill: "#ffffff" };
        this.ScoreText = state.add.text(0, 0, "Score: 0", style);
        this.ScoreText.anchor.setTo(0.5);
    }

    Update() {
        this.ScoreText.text = this.scoreboard.Score.toString();
    }
}