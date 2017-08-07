class MatchDetection {
    Block: Block;

    constructor(block: Block) {
        this.Block = block;
    }
}

class MatchDetector {
    private matchDetections: MatchDetection[];
    private board: Board;
    private scoreboard: Scoreboard;
    private signManager: SignManager;
    private chainDetector: ChainDetector;
    static readonly MinimumMatchLength: number = 3;

    constructor(board: Board, scoreboard: Scoreboard, signManager: SignManager, chainDetector: ChainDetector) {
        this.matchDetections = [];
        this.board = board;
        this.scoreboard = scoreboard;
        this.signManager = signManager;
        this.chainDetector = chainDetector;
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
        let incrementChain: boolean = false;

        // look in four directions for matching blocks
        let left: number = block.X;
        while(left > 0 && this.board.Blocks[left - 1][block.Y].State == BlockState.Idle && this.board.Blocks[left - 1][block.Y].Type == block.Type) {
            left--;
        }

        let right: number = block.X + 1;
        while(right < Board.Columns && this.board.Blocks[right][block.Y].State == BlockState.Idle && this.board.Blocks[right][block.Y].Type == block.Type) {
            right++;
        }

        let top = block.Y; // exclude the top row since it's for new incoming blocks
        while(top > 1 && this.board.Blocks[block.X][top - 1].State == BlockState.Idle && this.board.Blocks[block.X][top - 1].Type == block.Type) {
            top--;
        }

        let bottom = block.Y + 1; 
        while(bottom < Board.Rows && this.board.Blocks[block.X][bottom].State == BlockState.Idle && this.board.Blocks[block.X][bottom].Type == block.Type) {
            bottom++;
        }

        let width: number = right - left;
        let height: number = bottom - top;
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

                if(this.board.Blocks[x][block.Y].Chainer.ChainEligible) {
                    incrementChain = true;
                }
            }
        }

        if(verticalMatch) {
            for(let y: number = top; y < bottom; y++) {
                this.board.Blocks[block.X][y].Matcher.Match(matchedBlockCount, delayCounter);
                delayCounter--;

                if(this.board.Blocks[block.X][y].Chainer.ChainEligible) {
                    incrementChain = true;
                }
            }
        }

        if(matchedBlockCount > MatchDetector.MinimumMatchLength) {
            this.scoreboard.ScoreCombo(matchedBlockCount);
            this.signManager.CreateSign(block.X, block.Y, matchedBlockCount.toString(), 0xffffff);
        }

        if(incrementChain) {
            this.chainDetector.IncrementChain();
            this.signManager.CreateSign(block.X, block.Y, this.chainDetector.ChainLength.toString() + "x", 0xffffff);
        }
    }
}