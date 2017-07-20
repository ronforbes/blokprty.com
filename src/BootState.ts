class BootState extends Phaser.State {
    preload() {
        this.load.image("PreloadBar", "assets/sprites/preloadbar.png");
    }

    create() {
        // Disable multi-touch
        this.input.maxPointers = 1;

        // Disable pausing when page loses focus
        this.stage.disableVisibilityChange = true;

        // Enable advanced timing to track fps
        this.game.time.advancedTiming = true;
        
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = this.game.scale.pageAlignVertically = true;

        if(this.game.device.desktop) {
            // desktop specific settings
            
        }
        else {
            // mobile specific settings

        }

        this.game.state.start("Preload");
    }
}