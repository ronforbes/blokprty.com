class BootState extends Phaser.State {
    preload() {
        this.load.image("LoadingBar", "assets/sprites/loadingbar.png");
    }

    create() {
        // Disable multi-touch
        this.input.maxPointers = 1;

        // Disable pausing when page loses focus
        this.stage.disableVisibilityChange = true;

        // Enable advanced timing to track fps
        this.game.time.advancedTiming = true;

        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        if(this.game.device.desktop) {
            // desktop specific settings
            
        }
        else {
            // mobile specific settings

        }

        this.game.state.start("Loading");
    }
}