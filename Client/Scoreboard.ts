class Scoreboard {
    Score: number;
    static readonly MatchValue: number = 10;
    static readonly ComboValue: number = 100;
    static readonly ChainValue: number = 1000;

    constructor(phaserGame: Phaser.Game) {
        this.Reset();
    }

    Reset() {
        this.Score = 0;
    }

    ScoreMatch() {
        this.Score += Scoreboard.MatchValue;
    }

    ScoreCombo(length: number) {
        this.Score += length * Scoreboard.ComboValue;
    }

    ScoreChain(length: number) {
        this.Score += length * Scoreboard.ChainValue;
    }
}