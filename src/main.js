import Level1 from './levels/Level_1.js';

// תופסים את הקונטיינר הראשי
const gameContainer = document.getElementById('game-container');

// יוצרים מופע של השלב הראשון ומפעילים אותו
const level1 = new Level1(gameContainer);
level1.init();