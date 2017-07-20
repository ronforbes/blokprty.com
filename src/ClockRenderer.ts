class ClockRenderer {
    private clock: Clock;
    private clockText: Phaser.Text;

    constructor(clock: Clock, phaserGame: Phaser.Game) {
        this.clock = clock;

        let style = { font: "48px Arial", fill: "#ffffff", align: "right" };
        this.clockText = phaserGame.add.text(phaserGame.width - 10, 10, "Time: 10", style);
        this.clockText.anchor.setTo(1, 0);
    }

    Update() {
        this.clockText.text = "Time: " + (this.clock.TimeRemaining / 1000).toFixed(0);
    }
}