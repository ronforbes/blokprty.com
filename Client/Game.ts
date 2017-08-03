class Game extends Phaser.Game {
    private game: Phaser.Game;

    constructor() {
        super("100%", "100%", Phaser.AUTO, 'game', null);

        this.state.add("Boot", BootState);
        this.state.add("Loading", LoadingState);
        this.state.add("Menu", MenuState);
        this.state.add("Gameplay", GameplayState);
        this.state.add("Results", ResultsState);
        this.state.add("Leaderboard", LeaderboardState);

        this.state.start("Boot");
    }
}

window.onload = () => {
    let game = new Game();
}