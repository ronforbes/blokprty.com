class MenuState extends Phaser.State {
    private background: Phaser.Image;
    private logo: Phaser.Image;

    create() {
        this.background = this.add.image(0, 0, "Background");
        this.background.scale.setTo(this.game.width / this.background.width, this.game.height / this.background.height);
        this.background.alpha = 0;

        this.logo = this.add.image(0, -600, "Logo");
        this.logo.scale.setTo(this.game.width / this.logo.width, this.game.height / this.logo.height);

        this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
        this.add.tween(this.logo).to({ y: 0}, 2000, Phaser.Easing.Elastic.Out, true, 2000);

        this.input.onDown.addOnce(this.FadeOut, this);
    }

    FadeOut() {
        this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        let tween = this.add.tween(this.logo).to({ y: this.game.height }, 2000, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(this.StartGameplay, this);
    }

    StartGameplay() {
        this.game.state.start("Gameplay");
    }
}