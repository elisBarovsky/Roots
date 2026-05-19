import Main_Menu from './levels/Main_Menu.js';

const gameContainer = document.getElementById('game-container');

const mainMenu = new Main_Menu(gameContainer);
mainMenu.init();