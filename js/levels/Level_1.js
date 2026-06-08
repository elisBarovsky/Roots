import Level_2 from './Level_2.js';
import { soundManager } from '../Tools/SoundManager.js';

export default class Level1 {
    constructor(container) {
        this.container = container;
        this.isDown = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.buttonRevealed = false;
        this.hasStartedScrolling = false; 

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    init() {
        this.container.innerHTML = `
            <div class="level-wrapper">
                <div id="scroll-hint" class="scroll-hint">Scroll to the right ➔</div>

                <div id="game-viewport" class="viewport">
                    <div class="wide-level-content">
                        <img src="assets/images/Untitled_Artwork.png" alt="Level 1">
                    </div>
                </div>
                
                <button id="next-level-btn" class="game-btn">Continue</button>
            </div>
        `;
        this.viewport = document.getElementById('game-viewport');
        this.nextBtn = document.getElementById('next-level-btn');
        this.scrollHint = document.getElementById('scroll-hint'); 

        this.viewport.addEventListener('mousedown', this.onMouseDown);
        this.viewport.addEventListener('mouseleave', this.onMouseLeave);
        this.viewport.addEventListener('mouseup', this.onMouseUp);
        this.viewport.addEventListener('mousemove', this.onMouseMove);
        this.nextBtn.addEventListener('mouseenter', this.onHover);
        this.nextBtn.addEventListener('click', this.onNextClick);
    }

    onMouseDown(e) {
        this.isDown = true;
        this.viewport.classList.add('active');
        this.startX = e.pageX - this.viewport.offsetLeft;
        this.scrollLeft = this.viewport.scrollLeft;
    }

    onHover() {
        if (typeof soundManager !== 'undefined') {
            soundManager.play('hoverSound'); 
        }
    }

    onMouseLeave() {
        this.isDown = false;
        this.viewport.classList.remove('active');
    }

    onMouseUp() {
        this.isDown = false;
        this.viewport.classList.remove('active');
    }

    onMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.viewport.offsetLeft;
        const walk = (x - this.startX) * 1.5; 
        this.viewport.scrollLeft = this.scrollLeft - walk;

        if (!this.hasStartedScrolling && this.viewport.scrollLeft > 20) {
            this.hasStartedScrolling = true;
            if (this.scrollHint) {
                this.scrollHint.classList.add('hidden'); 
                
                setTimeout(() => {
                    if (this.scrollHint) this.scrollHint.remove();
                }, 500);
            }
        }

        this.checkEndReached();
    }

    checkEndReached() {
        if (this.buttonRevealed) return;

        const maxScrollLeft = this.viewport.scrollWidth - this.viewport.clientWidth;

        if (maxScrollLeft <= 0) return;

        const currentScroll = Math.ceil(this.viewport.scrollLeft);

        if (currentScroll >= maxScrollLeft - 2) {
            this.buttonRevealed = true;
            this.nextBtn.classList.add('visible');
        }
    }

    onNextClick() {
        this.container.classList.add('fade-out');

        setTimeout(() => {
            this.destroy();
            
            if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
            const level2 = new Level_2(this.container);
            level2.init();

        }, 1000);
    }

    destroy() {
        this.viewport.removeEventListener('mousedown', this.onMouseDown);
        this.viewport.removeEventListener('mouseleave', this.onMouseLeave);
        this.viewport.removeEventListener('mouseup', this.onMouseUp);
        this.viewport.removeEventListener('mousemove', this.onMouseMove);
        this.nextBtn.removeEventListener('click', this.onNextClick);
        this.nextBtn.removeEventListener('mouseenter', this.onHover);
        this.container.innerHTML = '';
    }
}