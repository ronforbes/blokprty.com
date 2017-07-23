class ClockRenderer {
    private clock: Clock;
    ClockText: Phaser.Text;

    constructor(clock: Clock, phaserGame: Phaser.Game) {
        this.clock = clock;

        let style = { font: "48px Arial", fill: "#ffffff", align: "right" };
        this.ClockText = phaserGame.add.text(0, 0, "Time: 10", style);
        this.ClockText.anchor.setTo(0.5);
    }

    Update() {
        this.ClockText.text = "Time: " + (this.clock.TimeRemaining / 1000).toFixed(0);
    }
}