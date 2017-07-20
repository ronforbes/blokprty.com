class Game extends Phaser.Game {
    private game: Phaser.Game;

    constructor() {
        super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game', null);// { preload: this.preload, create: this.create, update: this.update, render: this.render })

        this.state.add("Boot", BootState);
        this.state.add("Preload", PreloadState);
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