class Sign {
    Text: string;
    X: number;
    Y: number;
    Color: number;
    Active: boolean;
    Elapsed: number;
    static readonly Duration: number = 1000;
    private renderer;

    constructor(game: Phaser.Game, group: Phaser.Group) {
        this.renderer = new SignRenderer(this, game, group);
    }

    Create(text: string, color: number) {
        this.Text = text;
        this.Color = color;
        this.Active = true;
        this.Elapsed = 0;
    }

    Update(elapsedGameTime: number) {
        if(this.Active) {
            this.Elapsed += elapsedGameTime;

            this.renderer.Update(elapsedGameTime);

            if(this.Elapsed >= Sign.Duration) {
                this.Active = false;
            }
        }
    }
}