import './css/style.css';
import CheckersGame from './model/Game.js';
import BoardTemplate from './templates/Board.js';
import Stats from './templates/Stats.js';

const AppInit = (): void => {
  const game = CheckersGame.instance;
  const statsTemplate = new Stats();
  const boardTemplate = new BoardTemplate(statsTemplate);
  game.start();
  boardTemplate.render(game.board);
  statsTemplate.render(game);
}
document.addEventListener('DOMContentLoaded', AppInit);


