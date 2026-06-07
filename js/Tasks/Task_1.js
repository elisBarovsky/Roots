import Level_2 from '../levels/Level_2.js'; 
import Toolbox from '../Tools/Toolbox.js'; 
import { soundManager } from '../Tools/SoundManager.js';

export default class Task_1 {
    constructor(container) {
        this.container = container;

        this.isDraggingPot = false;
        this.isLightZone = false;
        this.growthStage = 0;
        this.wateringTimeout = null;
        this.dropInterval = null;

        this.potImages = {
            0: 'assets/images/Task_1/items/DryPot.png',
            1: 'assets/images/Task_1/items/SproutingPot.png',
            2: 'assets/images/Task_1/items/FloweringPot.png'
        };

        this.toggleHint = this.toggleHint.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onSceneClick = this.onSceneClick.bind(this);
        this.onBackClick = this.onBackClick.bind(this); 
    }

    init() {
        this.container.innerHTML = `
            <div class="task1-wrapper" id="task1-wrapper">
                <div class="shadow-overlay"></div>
                <button class="game-btn back-to-hub-btn" id="back-hub-btn" title="חזור לחצר">↩ Back</button>
                <img src="assets/images/HintBook.png" class="hint-icon" id="hint-btn">

                <div class="hint-overlay" id="hint-overlay">
                    <div class="hint-content-wrapper">
                        <span class="close-hint">&times;</span>
                        <img src="assets/images/Hints/Hint_1.png" class="hint-modal">
                    </div>
                </div>

                <img id="magic-item" class="draggable-item" src="${this.potImages[0]}" alt="Magic Item">
            </div>
        `;

        this.wrapper = document.getElementById('task1-wrapper');
        this.item = document.getElementById('magic-item');
        this.hintBtn = document.getElementById('hint-btn');
        this.hintOverlay = document.getElementById('hint-overlay');
        this.backHubBtn = document.getElementById('back-hub-btn'); 
        this.closeHintBtn = this.wrapper.querySelector('.close-hint'); 

        this.toolbox = new Toolbox(this.wrapper);
        this.toolbox.init();

        const playHoverSound = () => {
            if (typeof soundManager !== 'undefined') soundManager.play('hoverSound');
        };

        this.hintBtn.addEventListener('mouseenter', playHoverSound);
        this.backHubBtn.addEventListener('mouseenter', playHoverSound);
        if (this.closeHintBtn) {
            this.closeHintBtn.addEventListener('mouseenter', playHoverSound);
        }

        this.hintBtn.addEventListener('click', this.toggleHint);
        this.hintOverlay.addEventListener('click', this.toggleHint);
        this.item.addEventListener('pointerdown', this.onPointerDown);
        this.backHubBtn.addEventListener('click', this.onBackClick);
        this.wrapper.addEventListener('click', this.onSceneClick);
        
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);

        this.isLightZone = false; 
        this.growthStage = 0;
        this.item.src = this.potImages[0];
        setTimeout(() => {
            this.container.classList.remove('fade-out');

            this.growthStage = 0;
            this.item.src = this.potImages[0];
            
            const rect = this.wrapper.getBoundingClientRect();
            const potRect = this.item.getBoundingClientRect();
            const startX = potRect.left - rect.left + potRect.width / 2;
            const startY = potRect.top - rect.top + potRect.height / 2;
            this.checkDiagonalZone(startX, startY, rect.width, rect.height);
        }, 50);
    }

    showSuccessMessage() {
        const popup = document.createElement('div');
        popup.className = 'success-popup-overlay';
        
        popup.innerHTML = `
            <div class="success-popup-box">
                <div class="success-popup-text">.The mint spread beyond the edges of its pot </br>
                    .It never asked whether it was allowed to keep growing</br>
                    .It just did</div>
                <button class="game-btn close-popup-btn">Continue</button>
            </div>
        `;
        
        this.container.appendChild(popup);
        
        requestAnimationFrame(() => {
            popup.classList.add('show');
        });

        const closeBtn = popup.querySelector('.close-popup-btn');
        closeBtn.addEventListener('click', () => {
            if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 400); 
        });
    }

    onBackClick(e) {
        e.stopPropagation();
        
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        
        this.container.classList.add('fade-out');

        setTimeout(() => {
            this.destroy();
            const level2 = new Level_2(this.container);
            level2.init();
            this.container.classList.remove('fade-out');
        }, 1500);
    }

    onPointerDown(e) {
        if (this.toolbox.getActiveTool()) return;
        e.stopPropagation();
        this.isDraggingPot = true;
        e.preventDefault();
    }

    onPointerMove(e) {
        if (this.isDraggingPot) {
            this.hasMoved = true;
            const rect = this.wrapper.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;
            mouseX = Math.max(0, Math.min(mouseX, rect.width));
            mouseY = Math.max(0, Math.min(mouseY, rect.height));
            
            this.item.style.left = `${mouseX}px`;
            this.item.style.top = `${mouseY}px`;

            const potRect = this.item.getBoundingClientRect();
            this.checkDiagonalZone(mouseX + potRect.width / 2, mouseY + potRect.height / 2, rect.width, rect.height);
        }
    }

    onPointerUp(e) {
        if (this.isDraggingPot) {
            this.isDraggingPot = false;
            if (typeof soundManager !== 'undefined') {
                soundManager.play('potDrop');
            }
        } 
    }

    onSceneClick(e) {
        const toolType = this.toolbox.getActiveToolType();
        if (!toolType) return;

        if (toolType === 'watering_can') {
            const potRect = this.item.getBoundingClientRect();
            
            const paddingLeft = 120; 
            const paddingRight = 60;
            const paddingTop = 100;
            const paddingBottom = 40;

            const isOverPot = e.clientX >= (potRect.left - paddingLeft) &&
                e.clientX <= (potRect.right + paddingRight) &&
                e.clientY >= (potRect.top - paddingTop) &&
                e.clientY <= (potRect.bottom + paddingBottom);

            if (isOverPot) {
                this.triggerWateringPour(e.clientX, e.clientY);
                return;
            }
        }

        this.toolbox.resetActiveTool();
    }

    triggerWateringPour(clientX, clientY) {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);

        const activeTool = this.toolbox.getActiveTool();
        if (activeTool) {
            activeTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(45deg)`, 'important');
        }

        const spoutX = clientX + 80; 
        const spoutY = clientY + 10;

        if (typeof soundManager !== 'undefined') {
            soundManager.play('water');
        }

        if (!this.dropInterval) {
            this.dropInterval = setInterval(() => {
                this.toolbox.spawnParticle('water', spoutX, spoutY);
            }, 50);
        }


        if (this.isLightZone && this.growthStage === 1) {
            if (this.wateringProgress === undefined) {
                this.wateringProgress = 0;
            }

            this.wateringProgress += 25;

            if (this.wateringProgress >= 100) {
                this.wateringProgress = 0; 


                this.growthStage = 2;
                this.item.src = this.potImages[this.growthStage];

                this.spawnConfetti();
                
                if (typeof soundManager !== 'undefined') {
                    soundManager.play('stageComplete');
                }

                this.showSuccessMessage();
                this.stopWateringEffect();
                if (this.wateringTimeout) {
                    clearTimeout(this.wateringTimeout);
                    this.wateringTimeout = null;
                }

                const toolboxContainer = document.querySelector('.toolbox-container');
                if (toolboxContainer) {
                    toolboxContainer.classList.remove('expanded');

                    const toolboxIcon = toolboxContainer.querySelector('.toolbox-icon');
                    if (toolboxIcon) {
                        toolboxIcon.src = 'assets/images/Tools/toolbox_close.png'; 
                    }
                }

                if (this.toolbox && typeof this.toolbox.closeDrawer === 'function') {
                     this.toolbox.closeDrawer();
                }

                if (!window.gameState) window.gameState = {};
                window.gameState.task1_completed = true;
                window.gameState.task1_just_completed = true;
                this.toolbox.resetActiveTool();
            }
        }

        if (this.growthStage < 2) {
            this.wateringTimeout = setTimeout(() => {
                this.stopWateringEffect();
            }, 800);
        }
    }

    stopWateringEffect() {
        const activeTool = this.toolbox.getActiveTool();
        if (activeTool) {
            activeTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(0deg)`, 'important');
        }
        if (this.dropInterval) {
            clearInterval(this.dropInterval);
            this.dropInterval = null;

            if (typeof soundManager !== 'undefined') {
                soundManager.stop('water');
            }
        }
    }

    spawnConfetti() {
        for (let i = 0; i < 60; i++) { 
            const p = document.createElement('div');
            p.className = 'confetti';
            p.style.left = `${Math.random() * window.innerWidth}px`;
            p.style.top = `-20px`; 
            p.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            document.body.appendChild(p);
        
            p.animate([
                { transform: `translate(0, 0) scale(1)`, opacity: 1 },
                { transform: `translate(${(Math.random()-0.5)*200}px, ${window.innerHeight}px) scale(0)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'linear'
            });
            setTimeout(() => p.remove(), 3000);
        }
    }

   checkDiagonalZone(x, y, width, height) {

        const diagonalLineY = (1.94 * (height / width) * x) - (0.4067 * height);

        const newIsLight = y < diagonalLineY;
        
        if (!this.hasMoved) {
            this.isLightZone = newIsLight;
            return; 
        }

        const wasLightZone = this.isLightZone;
        this.isLightZone = newIsLight; 

        if (this.isLightZone && !wasLightZone) {
            if (this.growthStage === 0) {
                this.growthStage = 1;
                this.item.src = this.potImages[this.growthStage];
                this.wateringProgress = 0;
            }
        }
        else if (!this.isLightZone && wasLightZone) {
            if (this.growthStage === 1) {
                this.growthStage = 0;
                this.item.src = this.potImages[this.growthStage];
                this.wateringProgress = 0;
                
                if (window.gameState) {
                    window.gameState.task1_completed = false;
                }

                this.stopWateringEffect();
                if (this.wateringTimeout) {
                    clearTimeout(this.wateringTimeout);
                    this.wateringTimeout = null;
                }
            }
        }
    }

    toggleHint() {
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        this.hintOverlay.classList.toggle('active');
    }

    destroy() {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);
        if (this.dropInterval) clearInterval(this.dropInterval);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
        if (this.wrapper) this.wrapper.removeEventListener('click', this.onSceneClick);
        if (this.backHubBtn) this.backHubBtn.removeEventListener('click', this.onBackClick); 
        if (this.toolbox) this.toolbox.destroy();
        this.container.innerHTML = '';
    }
}