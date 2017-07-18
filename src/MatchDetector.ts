class MatchDetection {
    Block: Block;

    constructor(block: Block) {
        this.Block = block;
    }
}

class MatchDetector {
    private matchDetections: MatchDetection[];
    private board: Board;
    static readonly MinimumMatchLength: number = 3;

    constructor(board: Board) {
        this.matchDetections = [];
        this.board = board;
    }

    RequestMatchDetection(block: Block) {
        this.matchDetections.push(new MatchDetection(block));
    }

    Update() {
        while(this.matchDetections.length > 0) {
            let detection: MatchDetection = this.matchDetections.shift();

            // ensure the block is still idle
            if(detection.Block.State == BlockState.Idle) {
                this.DetectMatch(detection.Block);
            }
        }
    }

    private DetectMatch(block: Block) {
        // look in four directions for matching blocks
        let left: number = block.X;
        while(left > 0 && this.board.Blocks[left - 1][block.Y].State == BlockState.Idle && this.board.Blocks[left - 1][block.Y].Type == block.Type) {
            left--;
        }

        let right: number = block.X + 1;
        while(right < Board.Columns && this.board.Blocks[right][block.Y].State == BlockState.Idle && this.board.Blocks[right][block.Y].Type == block.Type) {
            right++;
        }

        let bottom = block.Y;
        while(bottom > 0 && this.board.Blocks[block.X][bottom - 1].State == BlockState.Idle && this.board.Blocks[block.X][bottom - 1].Type == block.Type) {
            bottom--;
        }

        let top = block.Y + 1; // exclude the top row since it's for new incoming blocks
        while(top < Board.Rows - 1 && this.board.Blocks[block.X][top].State == BlockState.Idle && this.board.Blocks[block.X][top].Type == block.Type) {
            top++;
        }

        let width: number = right - left;
        let height: number = top - bottom;
        let matchedBlockCount: number = 0;
        let horizontalMatch: boolean = false;
        let verticalMatch: boolean = false;

        if(width >= MatchDetector.MinimumMatchLength) {
            horizontalMatch = true;
            matchedBlockCount += width;
        }

        if(height >= MatchDetector.MinimumMatchLength) {
            verticalMatch = true;
            matchedBlockCount += height;
        }

        if(!horizontalMatch && !verticalMatch) {
            return;
        }

        // if pattern matches both directions then remove the common block from the count
        if(horizontalMatch && verticalMatch) {
            matchedBlockCount--;
        }

        let delayCounter: number = matchedBlockCount;

        // kill the pattern's blocks
        if(horizontalMatch) {
            for(let x: number = left; x < right; x++) {
                this.board.Blocks[x][block.Y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;
            }
        }

        if(verticalMatch) {
            for(let y: number = top - 1; y >= bottom; y--) {
                this.board.Blocks[block.X][y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;
            }
        }
    }
}