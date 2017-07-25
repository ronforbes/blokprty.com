class Game extends Phaser.Game {
    private game: Phaser.Game;
    private readonly logicalWidth: number = 1920;
    private readonly logicalHeight: number = 1080;

    constructor() {
        super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game', null);// { preload: this.preload, create: this.create, update: this.update, render: this.render })

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