class Scoreboard {
    Score: number;
    private readonly matchValue: number = 10;
    private scoreboardRenderer: ScoreboardRenderer;

    constructor(phaserGame: Phaser.Game) {
        this.scoreboardRenderer = new ScoreboardRenderer(this, phaserGame);
        this.Reset();
    }

    Reset() {
        this.Score = 0;
    }

    ScoreMatch() {
        this.Score += this.matchValue;
    }

    Update() {
        this.scoreboardRenderer.Update();
    }
}