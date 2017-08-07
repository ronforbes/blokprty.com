class SignRenderer {
    private sign: Sign;
    private text: Phaser.Text;
    private group: Phaser.Group;

    constructor(sign: Sign, game: Phaser.Game, group: Phaser.Group) {
        this.sign = sign;
        this.text = game.add.text(0, 0, "", { font: "bold 40px Arial" });
        this.text.anchor.setTo(0.5);
        this.group = group;
        this.group.addChild(this.text);
        this.group.bringToTop(this.text);
    }

    Update(elapsedGameTime: number) {
        if(this.sign.Active) {
            this.text.x = this.sign.X * BlockRenderer.Size + BlockRenderer.Size / 2;
            this.text.y = this.sign.Y * BlockRenderer.Size + BlockRenderer.Size / 2 - (this.sign.Elapsed / Sign.Duration) * BlockRenderer.Size;
            this.text.alpha = 1 - (this.sign.Elapsed / Sign.Duration);
            this.text.text = this.sign.Text;
            let colorString: string;
            switch(this.sign.Color) {
                case 0x0000ff:
                    colorString = "#0000ff";
                    break;
                case 0x00ff00:
                    colorString = "#00ff00";
                    break;
                case 0xff0000:
                    colorString = "#ff0000";
                    break;
                case 0x00ffff:
                    colorString = "#00ffff";
                    break;
                case 0xff00ff:
                    colorString = "#ff00ff";
                    break;
                case 0xffff00:
                    colorString = "#ffff00";
                    break;
                case 0xffffff:
                    colorString = "#ffffff";
                    break;
            }
            this.text.addColor(colorString, 0);
            this.group.bringToTop(this.text);
        }
    }
}