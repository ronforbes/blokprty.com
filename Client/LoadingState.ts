class LoadingState extends Phaser.State {
    private logoText: Phaser.Text;
    private presentsText: Phaser.Text;
    private loadingBar: Phaser.Sprite;

    preload() {
        // Setup the Blok Prty logo
        this.logoText = this.add.text(0, 0, "Blok Prty LLC", { font: "40px Arial", fill: "#ffffff" });
        this.logoText.anchor.setTo(0.5);
        this.logoText.x = this.world.centerX;
        this.logoText.y = this.game.height / 3;

        // Set the "Presents" text
        this.presentsText = this.add.text(0, 0, "Presents...", { font: "20px Arial", fill: "#ffffff" });
        this.presentsText.anchor.setTo(0.5);
        this.presentsText.x = this.world.centerX;
        this.presentsText.y = this.game.height / 3 + this.logoText.height;

        // Setup the preload bar
        this.loadingBar = this.add.sprite(0, 0, "LoadingBar");
        this.loadingBar.anchor.setTo(0.5);
        this.loadingBar.position.setTo(this.world.centerX, this.world.centerY);
        this.load.setPreloadSprite(this.loadingBar);

        // Load game assets
        this.load.image("Background", "assets/sprites/background.png?v=2");
        this.load.image("BlokPrtyBG", "assets/sprites/blokprtybg.png?v=2");
        this.load.image("BlokPrty-Fixed", "assets/sprites/blokprty-fixed.png?v=2");
        this.load.image("PlayButton", "assets/sprites/playbutton.png?v=2"); 
        this.load.image("LoginButton", "assets/sprites/loginbutton.png?v=2");
        this.load.image("FacebookLogo", "assets/sprites/facebooklogo.png?v=2");
        this.load.image("TwitterLogo", "assets/sprites/twitterlogo.png?v=2");
        this.load.image("InstagramLogo", "assets/sprites/instagramlogo.png?v=2");
        this.load.image("TumblrLogo", "assets/sprites/tumblrlogo.png?v=2");
        this.load.image("UseResponseLogo", "assets/sprites/useresponselogo.png?v=2");
        this.load.image("Block", "assets/sprites/block.png?v=2");
        this.load.image("BackButton", "assets/sprites/backbutton.png?v=2");
        this.load.image("StarParticle", "assets/sprites/starparticle.png?v=2");
        this.load.image("CircleParticle", "assets/sprites/circleparticle.png?v=2");
    }

    create() {
        let alphaTween = this.add.tween(this.loadingBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        alphaTween.onComplete.add(this.StartMenu, this);
    }

    private StartMenu() {
        this.game.state.start("Menu");
    }
}