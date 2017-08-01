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
    static ServerState: ClockState;
    static ServerTimeRemaining: number;
    static CheckServerState: boolean;
    private readonly gameplayDuration = 120000;
    private readonly resultsDuration = 15000;
    private readonly leaderboardDuration = 15000;
    private request: XMLHttpRequest;

    constructor(phaserGame: Phaser.Game) {
        this.State = ClockState.Gameplay;
        this.TimeRemaining = this.gameplayDuration;
        this.phaserGame = phaserGame;

        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = this.OnServerClockReceived;
            
        this.request.open("GET", "/api/gameroom", true);
        this.request.send();
    }

    OnServerClockReceived(this: XMLHttpRequest, ev: Event) {
        if(this.readyState == 4 && this.status == 200) {
            let state: number = JSON.parse(this.responseText).state;               
            let time: number = JSON.parse(this.responseText).timeRemaining;
                
            Clock.ServerState = state as ClockState;
            Clock.ServerTimeRemaining = time;
            Clock.CheckServerState = true;
        }
    }

    Update() {
        this.TimeRemaining -= this.phaserGame.time.elapsed;

        if(Clock.CheckServerState) {
            this.State = Clock.ServerState;
            this.TimeRemaining = Clock.ServerTimeRemaining;
            Clock.CheckServerState = false;
        }

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