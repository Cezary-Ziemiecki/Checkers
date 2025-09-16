import CheckersGame from "../model/Game";

interface DOMStats {
    statsElement: HTMLElement;
    render(game: CheckersGame): void;
    clear(): void;
}

export default class Stats implements DOMStats {
    statsElement: HTMLElement;

    constructor() {
        this.statsElement = document.getElementById("stats")!;
    }

    render(game: CheckersGame): void {
        this.statsElement.innerHTML = `Aktualny gracz: ${game.currentPlayer===game.userPlayer ? "Ty" : "Przeciwnik"}`;
        this.statsElement.innerHTML += `<br/>Ruchy: ${game.stats.moves}`;
        this.statsElement.innerHTML += `<br/>Twoje pionki: ${game.userPlayer===1 ? game.stats.player1 : game.stats.player2}`;
        this.statsElement.innerHTML += `<br/>Pionki przeciwnika: ${game.userPlayer===1 ? game.stats.player2 : game.stats.player1}`;
    }

    clear(): void {
        this.statsElement.innerHTML = "";
    }
}
