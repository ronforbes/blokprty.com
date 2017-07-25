class LoadingState extends Phaser.State {
    private loadingBar: Phaser.Sprite;

    preload() {
        // Setup the preload bar
        this.loadingBar = this.add.sprite(0, 0, "LoadingBar");
        this.loadingBar.anchor.setTo(0.5);
        this.loadingBar.position.setTo(this.world.centerX, this.world.centerY);
        this.load.setPreloadSprite(this.loadingBar);

        // Load game assets
        this.load.image("Background", "assets/sprites/background.png");
        this.load.image("Logo", "assets/sprites/logo.png");
        this.load.image("PlayButton", "assets/sprites/playbutton.png");
        this.load.image(BlockRenderer.Key, BlockRenderer.Url);
        this.load.image("BackButton", "assets/sprites/backbutton.png");
    }

    create() {
        let alphaTween = this.add.tween(this.loadingBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        alphaTween.onComplete.add(this.StartMenu, this);
    }

    private StartMenu() {
        this.game.state.start("Menu");
    }
}