class BootState extends Phaser.State {
    preload() {
        this.load.image("BlokPrtyLLCLogo", "assets/sprites/blokprtyllclogo.jpeg");
        this.load.image("LoadingBar", "assets/sprites/loadingbar.png");
    }

    create() {
        // Disable multi-touch
        this.input.maxPointers = 1;

        // Disable pausing when page loses focus
        this.stage.disableVisibilityChange = true;

        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.game.state.start("Loading");
    }
}