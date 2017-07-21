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

        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.scale.onSizeChange.add(this.OnSizeChange, this);

        if(this.game.device.desktop) {
            // desktop specific settings
            
        }
        else {
            // mobile specific settings

        }

        this.game.state.start("Preload");
    }

    private OnSizeChange() {
        this.game.width = window.innerWidth * window.devicePixelRatio;
        this.game.height = window.innerHeight * window.devicePixelRatio;
        console.log("GameWidth=" + this.game.width + ", GameHeight=" + this.game.height);
    }
}