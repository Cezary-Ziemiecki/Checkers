import GameBoard from "./Board";
import SingleSquare from "./Square";

export interface Game {
    board: GameBoard;
    currentPlayer: number;
    state: "idle" | "select";
    stats: {
        moves: number;
        player1: number;
        player2: number;
    };
    userPlayer: number;
    start(): void;
    makeMove(from: SingleSquare, to: SingleSquare): boolean;
}

export default class CheckersGame implements Game {
    static instance = new CheckersGame();
    board: GameBoard;
    currentPlayer: number;
    userPlayer: number;
    state: "idle" | "select";
    stats = {
        moves: 0,
        player1: 12,
        player2: 12
    };
    constructor(userPlayer: 1 | 2 = 1) {
        this.board = GameBoard.instance;
        this.currentPlayer = userPlayer;
        this.userPlayer = userPlayer;
        this.state = "idle";
    }
    start(): void {
        this.board.calcBoard();
    }
    makeMove(from: SingleSquare, to: SingleSquare): boolean {
        if (this.state === "idle") return false;
        this.state = "idle";
        if (from.player !== this.currentPlayer) return false;
        const toPreviousPlayer = to.player;
        if (!this.board.movePiece(from.x, from.y, to.x, to.y)) return false;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.board.calcBoard();
        this.stats.moves += 1;
        if (toPreviousPlayer !== null) {
            if (toPreviousPlayer === 1) {
                this.stats.player1 -= 1;
            } else {
                this.stats.player2 -= 1;
            }
        }

        return true;
    }
}
