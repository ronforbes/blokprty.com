class SignManager {
    Signs: Sign[][];

    constructor(game: Phaser.Game, group: Phaser.Group) {
        this.Signs = [];

        for(let x = 0; x < Board.Columns; x++) {
            this.Signs[x] = [];

            for(let y = 0; y < Board.Rows; y++) {
                this.Signs[x][y] = new Sign(game, group);
                this.Signs[x][y].X = x;
                this.Signs[x][y].Y = y;
            }
        }
    }

    CreateSign(x: number, y: number, text: string, color: number) {
        this.Signs[x][y].Create(text, color);
    }

    Update(elapsedGameTime) {
        for(let x = 0; x < Board.Columns; x++) {
            for(let y = 0; y < Board.Rows; y++) {
                this.Signs[x][y].Update(elapsedGameTime);
            }
        }
    }
}