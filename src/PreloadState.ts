class PreloadState extends Phaser.State {
    private preloadBar: Phaser.Sprite;

    preload() {
        // Setup the preload bar
        this.preloadBar = this.add.sprite(0, 0, "PreloadBar");
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.preloadBar.position.setTo(this.world.centerX, this.world.centerY);
        this.load.setPreloadSprite(this.preloadBar);

        // Load game assets
        this.load.image("Background", "assets/sprites/background.png");
        this.load.image("Logo", "assets/sprites/logo.png");
        this.load.image(BlockRenderer.Key, BlockRenderer.Url);
    }

    create() {
        let alphaTween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        alphaTween.onComplete.add(this.StartMenu, this);
    }

    private StartMenu() {
        this.game.state.start("Menu");
    }
}