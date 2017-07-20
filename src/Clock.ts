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
    private readonly gameplayDuration = 10000;
    private readonly resultsDuration = 10000;
    private readonly leaderboardDuration = 10000;
    private renderer: ClockRenderer;

    constructor(phaserGame: Phaser.Game) {
        this.State = ClockState.Gameplay;
        this.TimeRemaining = 10000;
        this.phaserGame = phaserGame;
        this.renderer = new ClockRenderer(this, this.phaserGame);
    }

    Update(state: GameplayState) {
        this.TimeRemaining -= this.phaserGame.time.elapsed;

        this.renderer.Update();

        if(this.TimeRemaining <= 0) {
            switch(this.State) {
                case ClockState.Gameplay:
                    this.State = ClockState.Results;
                    this.TimeRemaining = this.resultsDuration;

                    if(this.IsControllingGameState) {
                        state.StartResults();
                    }
                    break;

                case ClockState.Results:
                    this.State = ClockState.Leaderboard;
                    this.TimeRemaining = this.leaderboardDuration;

                    if(this.IsControllingGameState) {
                        //state.StartLeaderboard();
                    }
                    break;

                case ClockState.Leaderboard:
                    this.State = ClockState.Gameplay;
                    this.TimeRemaining = this.gameplayDuration;

                    if(this.IsControllingGameState) {
                        //state.StartGameplay();
                    }
                    break;
            }
        }
    }
}