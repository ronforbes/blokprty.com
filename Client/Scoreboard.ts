class Scoreboard {
    Score: number;
    static readonly MatchValue: number = 10;

    constructor(phaserGame: Phaser.Game) {
        this.Reset();
    }

    Reset() {
        this.Score = 0;
    }

    ScoreMatch() {
        this.Score += Scoreboard.MatchValue;
    }
}