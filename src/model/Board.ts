import SingleSquare from "./Square";

interface Board {
    squares: SingleSquare[][];
    selectedSquare: SingleSquare | null;
    calcBoard(): void;
    resetBoard(): void;
    getSquare(x: number, y: number): SingleSquare | null;
    movePiece(fromX: number, fromY: number, toX: number, toY: number): boolean;
}

export default class GameBoard implements Board {
    static instance = new GameBoard();
    public squares: SingleSquare[][];
    selectedSquare: SingleSquare | null = null;
    userPlayer: 1 | 2;
    constructor() {
        this.userPlayer = Math.random() < 0.5 ? 1 : 2; // Default user player
        this.squares = [];
        for (let y = 0; y < 8; y++) {
            const row: SingleSquare[] = [];
            for (let x = 0; x < 8; x++) {
                const color = (x + y) % 2 === 0 ? "light" : "dark";
                const square: SingleSquare = new SingleSquare(x, y, color);
                if (y < 3 && color === "dark") {
                    square.player = this.userPlayer; // Player 1 pieces
                } else if (y > 4 && color === "dark") {
                    square.player = <1 | 2>(3 - this.userPlayer); // Player 2 pieces
                }
                row.push(square);
            }
            this.squares.push(row);
        }
    }
    getSquare(x: number, y: number): SingleSquare | null {
        if (x < 0 || x >= 8 || y < 0 || y >= 8) return null;
        return this.squares[y][x];
    }
    calcBoard(): void {
        this.resetBoard()
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const square: SingleSquare = this.getSquare(x, y)!;
                if (square?.player !== null) {
                    for (let dy = -1; dy <= 1; dy += 1) {
                        for (let dx = -1; dx <= 1; dx += 1) {
                            const target = this.getSquare(x + dx, y + dy);
                            if (dx === 0 && dy === 0) continue;
                                                        if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
                                if (
                                    square.selected &&
                                    (
                                        (square.player === this.userPlayer && dy === 1) ||
                                        (square.player === (3 - this.userPlayer) && dy === -1)
                                    )
                                ) {
                                    if (target && target.player === null) {
                                        target.canMove = true;
                                    }
                                }
                            } else if (dy !== 0) {
                                if (target && target.player !== null && target.player !== square.player) {
                                    const jumpX = x + dx * 2;
                                    const jumpY = y + dy * 2;
                                    const landingSquare = this.getSquare(jumpX, jumpY);
                                    if (landingSquare && landingSquare.player === null) {
                                        target.canBeat = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    resetBoard(): void {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const square: SingleSquare = this.getSquare(x, y)!;
                square.canMove = false;
                square.canBeat = false;
                square.canBePromoted = false;
            }
        }
        // this.selectedSquare = null;
    }
    movePiece(fromX: number, fromY: number, toX: number, toY: number): boolean {
        const fromSquare = this.getSquare(fromX, fromY);
        let toSquare = this.getSquare(toX, toY);
        if (Math.abs(fromY - toY) !== 1) return false;
        if (!fromSquare || !toSquare) return false;
        if (fromSquare.player === null) return false;
        if (toSquare.player === fromSquare.player) return false;
        if (!toSquare.canMove && !toSquare.canBeat) return false;
        if (toSquare.player !== null) {
            if (toSquare.x === 0 || toSquare.x === 7 || toSquare.y === 0 || toSquare.y === 7) {
                return false;
            }
            const moveX: number = toSquare.x - fromSquare.x;
            const moveY: number = toSquare.y - fromSquare.y;
            const beatenSquare = toSquare;
            toSquare = this.getSquare(toSquare.x + moveX, toSquare.y + moveY)!;
            if (toSquare.player !== null) return false;
            beatenSquare.player = null;
        }
        // Move the piece
        toSquare.player = fromSquare.player;
        fromSquare.player = null;
        this.resetBoard();
        return true;
    }

}