import Level_1 from './Level_1.js';

export default class Main_Menu {
    constructor(container) {
        this.container = container;
        this.onStartClick = this.onStartClick.bind(this);
    }

    init() {
        this.container.innerHTML = `
            <div class="main-menu-wrapper">
                <h1 class="game-title">שם המשחק שלכם</h1>
                <button id="start-game-btn" class="menu-btn">התחל משחק</button>
            </div>
        `;

        this.startBtn = document.getElementById('start-game-btn');
        this.startBtn.addEventListener('click', this.onStartClick);
    }

    onStartClick() {
        this.destroy(); 

        const level1 = new Level_1(this.container);
        level1.init();
    }

    destroy() {
        this.startBtn.removeEventListener('click', this.onStartClick);
        this.container.innerHTML = '';
    }
}