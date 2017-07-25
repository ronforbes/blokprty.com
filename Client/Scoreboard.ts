class Scoreboard {
    Score: number;
    private readonly matchValue: number = 10;

    constructor(phaserGame: Phaser.Game) {
        this.Reset();
    }

    Reset() {
        this.Score = 0;
    }

    ScoreMatch() {
        this.Score += this.matchValue;
    }
}