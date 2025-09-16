import GameBoard from "../model/Board";
import CheckersGame from "../model/Game";
import Stats from "./Stats";

interface DOMBoard {
    boardElement: HTMLElement;
    render(gameBoard: GameBoard): void;
    clear(): void;
}

export default class BoardTemplate implements DOMBoard {
    boardElement: HTMLElement;
    stats: Stats;
    static instance: BoardTemplate;

    constructor(stats: Stats) {
        this.boardElement = document.getElementById("board")!;
        this.stats = stats;
        BoardTemplate.instance = this;
    }

    render(gameBoard: GameBoard): void {
        this.clear();
        gameBoard.calcBoard();
        // Renderuj statystyki po planszy
        this.stats.render(CheckersGame.instance);

        gameBoard.squares.forEach(row => {
            row.forEach(square => {
                const squareDiv = document.createElement("div");
                squareDiv.classList.add("square");
                squareDiv.dataset.x = square.x.toString();
                squareDiv.dataset.y = square.y.toString();

                // kolor pola
                squareDiv.classList.add(square.color === "light" ? "light" : "dark");

                // zaznaczenie pola


                // pionki
                if (square.player !== null) {
                    const pieceDiv = document.createElement("div");
                    pieceDiv.classList.add("piece");
                    pieceDiv.classList.add(square.player === 1 ? "player1" : "player2");
                    squareDiv.appendChild(pieceDiv);
                    if (square.selected) {
                        squareDiv.classList.add("selected");
                    }

                }
                if (square.canMove) {
                    squareDiv.classList.add("can-move");
                }
                if (square.canBeat && CheckersGame.instance.currentPlayer !== square.player) {
                    squareDiv.classList.add("can-beat");
                }
                if (square.player === CheckersGame.instance.currentPlayer) {
                    squareDiv.classList.add("current-player");
                }
                // kliknięcie w pole
                squareDiv.addEventListener("click", () => {
                    if (
                        CheckersGame.instance.state === "idle" ||
                        ((!square.canMove && !square.canBeat) &&
                            (!square.player || square.player === CheckersGame.instance.currentPlayer))
                    ) {
                        if (square.player !== CheckersGame.instance.currentPlayer) return;
                        if (square.selected) {
                            // odznacz kliknięty square
                            square.selected = false;
                            gameBoard.selectedSquare = null;
                        } else {
                            // odznacz wszystkie pozostałe squares
                            gameBoard.squares.flat().forEach(sq => sq.selected = false);

                            // zaznacz kliknięty square
                            square.selected = true;
                            gameBoard.selectedSquare = square;
                            CheckersGame.instance.state = "select";
                        }
                        // przerysuj planszę
                    } else if (CheckersGame.instance.state === "select") {
                        if (square.canMove || square.canBeat) {
                            if (gameBoard.selectedSquare) {
                                CheckersGame.instance.makeMove(gameBoard.selectedSquare, square);
                                gameBoard.selectedSquare.selected = false;
                                gameBoard.selectedSquare = null;
                            }
                        }
                    }
                    this.render(gameBoard);
                });

                this.boardElement.appendChild(squareDiv);
            });
        });
    }

    clear(): void {
        this.boardElement.innerHTML = "";
    }
}
