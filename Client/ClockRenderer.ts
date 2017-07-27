class ClockRenderer {
    private clock: Clock;
    ClockText: Phaser.Text;

    constructor(clock: Clock, state: Phaser.State) {
        this.clock = clock;

        let style = { font: "40px Arial", fill: "#ffffff", align: "right" };
        this.ClockText = state.add.text(0, 0, "Time: 10", style);
        this.ClockText.anchor.setTo(0.5);
    }

    Update() {
        this.ClockText.text = (this.clock.TimeRemaining / 1000).toFixed(0);
    }
}