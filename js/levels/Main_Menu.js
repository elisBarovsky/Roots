import Level_1 from './Level_1.js';
import { soundManager } from '../Tools/SoundManager.js';

export default class Main_Menu {
    constructor(container) {
        this.container = container;
        this.onStartClick = this.onStartClick.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    init() {

        this.container.innerHTML = `
            <div class="main-menu-wrapper">
                <h1 class="game-title">Roots</h1>
                <button id="start-game-btn" class="game-btn">Start Game</button>
            </div>
        `;

        this.startBtn = document.getElementById('start-game-btn');
        this.startBtn.addEventListener('mouseenter', this.onHover);
        this.startBtn.addEventListener('click', this.onStartClick);
    }

    onStartClick() {
        this.container.classList.add('fade-out');
        setTimeout(() => {
            this.destroy();

            if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
            const level1 = new Level_1(this.container);
            level1.init();
            this.container.classList.remove('fade-out');
        }, 1000);
    }

    onHover() {
        if (typeof soundManager !== 'undefined') {
            soundManager.play('hoverSound'); 
        }
    }

    destroy() {
        this.startBtn.removeEventListener('click', this.onStartClick);
        this.startBtn.removeEventListener('mouseenter', this.onHover);
        this.container.innerHTML = '';
    }
}