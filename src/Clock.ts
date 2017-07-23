enum ClockState {
    Gameplay,
    Results,
    Leaderboard
}

class Clock {
    State: ClockState;
    TimeRemaining: number;
    IsControllingGameState: boolean;
    phaserGame: Phaser.Game;
    private readonly gameplayDuration = 120000;
    private readonly resultsDuration = 15000;
    private readonly leaderboardDuration = 15000;

    constructor(phaserGame: Phaser.Game) {
        this.State = ClockState.Gameplay;
        this.TimeRemaining = this.gameplayDuration;
        this.phaserGame = phaserGame;
    }

    Update() {
        this.TimeRemaining -= this.phaserGame.time.elapsed;

        if(this.TimeRemaining <= 0) {
            switch(this.State) {
                case ClockState.Gameplay:
                    this.State = ClockState.Results;
                    this.TimeRemaining = this.resultsDuration;
                    break;

                case ClockState.Results:
                    this.State = ClockState.Leaderboard;
                    this.TimeRemaining = this.leaderboardDuration;
                    break;

                case ClockState.Leaderboard:
                    this.State = ClockState.Gameplay;
                    this.TimeRemaining = this.gameplayDuration;
                    break;
            }
        }
    }
}