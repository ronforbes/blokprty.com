class LeaderboardState extends Phaser.State {
    private StartMenu() {
        this.game.state.start("Menu");
    }
    
    StartGameplay() {
        this.game.state.start("Gameplay");
    }
}