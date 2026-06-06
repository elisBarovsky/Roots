import Level_2 from '../levels/Level_2.js'; 
import Toolbox from '../Tools/Toolbox.js'; 
import { soundManager } from '../Tools/SoundManager.js';

export default class Task_3 {
    constructor(container) {
        this.container = container;
        this.growthStage = 0;
        this.wateringTimeout = null;
        this.dropInterval = null;
        
        this.potImages = {
            0: 'assets/images/Task_3/items/First_Pot.png',
            1: 'assets/images/Task_3/items/Second_Pot.png',
            2: 'assets/images/Task_3/items/Third_Pot.png'
        };

        this.toggleHint = this.toggleHint.bind(this); 
        this.onBackClick = this.onBackClick.bind(this); 
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onSceneClick = this.onSceneClick.bind(this);
    }

    init() {
        this.container.innerHTML = `
            <div class="task3-wrapper" id="task3-wrapper">
                <button class="back-to-hub-btn" id="back-hub-btn" title="חזור לחצר">↩ חזרה</button>
                <img src="assets/images/HintBook.png" class="hint-icon" id="hint-btn">

                <div class="hint-overlay" id="hint-overlay">
                    <div class="hint-content-wrapper">
                        <span class="close-hint">&times;</span>
                        <img src="assets/images/Hints/Hint_3.png" class="hint-modal">
                    </div>
                </div>

                <div id="pot-assembly-container" class="task3-pot-zone">
                    <img id="magic-item" class="task3-pot-element" src="${this.potImages[0]}" alt="Magic Item">
                    <div id="leaves-container"></div>
                    <div id="bugs-container"></div>
                </div>
            </div>
        `;

        this.wrapper = document.getElementById('task3-wrapper');
        this.potContainer = document.getElementById('pot-assembly-container'); 
        this.item = document.getElementById('magic-item');
        this.hintBtn = document.getElementById('hint-btn');
        this.hintOverlay = document.getElementById('hint-overlay');
        this.backHubBtn = document.getElementById('back-hub-btn'); 

        this.toolbox = new Toolbox(this.wrapper);
        this.toolbox.init();

        this.hintBtn.addEventListener('click', this.toggleHint);
        this.hintOverlay.addEventListener('click', this.toggleHint);
        this.backHubBtn.addEventListener('click', this.onBackClick);

        this.wrapper.addEventListener('click', this.onSceneClick);
        window.addEventListener('pointerdown', this.onPointerDown); 

        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 50);

        this.spawnLeaves();
    }

    spawnLeaves() {
        const leavesContainer = document.getElementById('leaves-container');
        if (!leavesContainer) return;

        const maxLeaves = 12;
        const minDistance = 15; 
        const placedPositions = [];

        for (let i = 0; i < maxLeaves; i++) {
            let randomX, randomY;
            let isValidPosition = false;
            let attempts = 0;

            while (!isValidPosition && attempts < 50) {
                randomX = Math.floor(Math.random() * 55) + 15; 
                randomY = Math.floor(Math.random() * 70) + 5;  

                isValidPosition = true;

                for (const pos of placedPositions) {
                    const dx = randomX - pos.x;
                    const dy = randomY - pos.y;
                    const distance = Math.hypot(dx, dy); 

                    if (distance < minDistance) {
                        isValidPosition = false;
                        break;
                    }
                }
                attempts++;
            }

            if (isValidPosition) {
                placedPositions.push({ x: randomX, y: randomY });

                const leaf = document.createElement('img');
                const isEaten = Math.random() > 0.5;
                
                const randomVariation = Math.floor(Math.random() * 3) + 1; 
                const leafType = isEaten ? `EatenLeaf${randomVariation}` : `Leaf${randomVariation}`;
                
                leaf.src = `assets/images/Task_3/items/${leafType}.png`;
                leaf.className = `leaf-element ${isEaten ? 'eaten-leaf' : 'healthy-leaf'}`;

                const randomRotation = Math.floor(Math.random() * 360);

                leaf.style.left = `${randomX}%`;
                leaf.style.top = `${randomY}%`;
                leaf.style.transform = `rotate(${randomRotation}deg)`;

                if (!this.activeLeaves) this.activeLeaves = [];
                this.activeLeaves.push(leaf);

                leavesContainer.appendChild(leaf);
            }
        }
    }

    spawnBugs() {
        const bugsContainer = document.getElementById('bugs-container');
        if (!bugsContainer) return;

        const bugFrames = [
            'assets/images/Task_3/items/Bug_1.png',
            'assets/images/Task_3/items/Bug_2.png',
            'assets/images/Task_3/items/Bug_3.png'
        ];

        for (let i = 0; i < 10; i++) {
            const bug = document.createElement('img');
            
            const startFrame = Math.floor(Math.random() * bugFrames.length);
            
            bug.src = bugFrames[startFrame];
            bug.className = 'bug-element';
            bug.dataset.currentFrame = startFrame; 
            bug.dataset.isDead = "false"; 
            
            const randomX = Math.floor(Math.random() * 80) + 10;
            const randomY = Math.floor(Math.random() * 65);

            bug.style.left = `${randomX}%`;
            bug.style.top = `${randomY}%`;
            bug.style.animationDelay = `${Math.random() * 2}s`;

            if (!this.activeBugs) this.activeBugs = [];
            this.activeBugs.push(bug);

            bugsContainer.appendChild(bug);
        }

        if (this.bugsAnimInterval) clearInterval(this.bugsAnimInterval);
        
        this.bugsAnimInterval = setInterval(() => {

            if (typeof soundManager !== 'undefined') {
                soundManager.playLoop('bugCrawl');
            }
            const allBugs = document.querySelectorAll('.bug-element');
            
            allBugs.forEach(bug => {
                if (bug.dataset.isDead === "true") return; 

                let frame = parseInt(bug.dataset.currentFrame);
                frame = (frame + 1) % bugFrames.length; 
                
                bug.dataset.currentFrame = frame;
                bug.src = bugFrames[frame];
            });
        }, 100); 

        if (this.bugsAnimInterval) clearInterval(this.bugsAnimInterval);
        
        this.bugsAnimInterval = setInterval(() => {
            const allBugs = document.querySelectorAll('.bug-element');
            
            allBugs.forEach(bug => {
                if (bug.dataset.isDead === "true") return; 

                let frame = parseInt(bug.dataset.currentFrame);
                frame = (frame + 1) % bugFrames.length; 
                
                bug.dataset.currentFrame = frame;
                bug.src = bugFrames[frame];
            });
        }, 100); 
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

    onPointerDown(e) {
        this.isPointerDown = true;
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

    onSceneClick(e) {
        const toolType = this.toolbox.getActiveToolType();
        if (!toolType) return;

        const target = e.target;
        this.toolbox.playToolAnimation(); 

        if (toolType === 'Scissors') {
            if (target.classList.contains('eaten-leaf')) {
                target.classList.add('falling-leaf');
                target.style.pointerEvents = 'none'; 
                setTimeout(() => target.remove(), 1000); 
            }
            return; 
        }

        if (toolType === 'spray') {
            const nozzleX = e.clientX + 15; 
            const nozzleY = e.clientY - 65; 
            
            for(let i = 0; i < 4; i++) {
                this.toolbox.spawnParticle('spray', nozzleX, nozzleY);
            }

            if (target.classList.contains('bug-element')) {
                if (target.dataset.isDead === "true") return; 

                target.src = 'assets/images/Task_3/items/DeadBug.png';
                target.dataset.isDead = "true"; 
                target.style.pointerEvents = 'none';
                
                target.style.animation = 'none'; 

                target.animate([
                    { transform: 'translateY(0) scale(1)', opacity: 1 },
                    { transform: 'translateY(300px) scale(0.8)', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-in',
                    fill: 'forwards'
                });
                                
                target.style.animation = 'none'; 

                target.animate([
                    { transform: 'translateY(0) scale(1)', opacity: 1 },
                    { transform: 'translateY(300px) scale(0.8)', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-in',
                    fill: 'forwards'
                });

                setTimeout(() => {
                    target.remove();
                    const remainingBugs = document.querySelectorAll('.bug-element').length;
                    if (remainingBugs === 0) {
                        this.toolbox.resetActiveTool();
                        if (typeof soundManager !== 'undefined') {
                            soundManager.stop('bugCrawl');
                        }
                    }
                }, 1000);
            }
            return;
        }

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
                if (typeof this.isLightZone !== 'undefined' && !this.isLightZone) return; 
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

        if (!this.dropInterval) {

            if (typeof soundManager !== 'undefined') {
                soundManager.play('water');
            }
            this.dropInterval = setInterval(() => {
                this.toolbox.spawnParticle('water', spoutX, spoutY);
            }, 50);
        }

        const eatenLeavesCount = document.querySelectorAll('.eaten-leaf').length;
        const bugsCount = document.querySelectorAll('.bug-element').length;

        let stageTransitioned = false; 

        if (this.growthStage === 0 && eatenLeavesCount > 0) {

        } else if (this.growthStage === 1 && bugsCount > 0) {

        } else {
            if (this.wateringProgress === undefined) {
                this.wateringProgress = 0;
            }

            this.wateringProgress += 25;

            if (this.wateringProgress >= 100) {
                this.wateringProgress = 0; 
                stageTransitioned = true; 
                stageTransitioned = true;

                if (this.growthStage < 2) {
                    this.growthStage++;
                    
                    if (this.potImages[this.growthStage]) {
                        this.item.src = this.potImages[this.growthStage];
                    }
                    
                    if (this.growthStage === 1) {
                        const leavesContainer = document.getElementById('leaves-container');
                        if (leavesContainer) leavesContainer.innerHTML = '';
                        
                        this.stopWateringEffect();
                        if (this.wateringTimeout) {
                            clearTimeout(this.wateringTimeout);
                            this.wateringTimeout = null;
                        }
                        this.toolbox.resetActiveTool();
                        
                        this.spawnBugs();
                    }
                    
                if (this.growthStage === 2) {
                        this.spawnConfetti(); 

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
                        window.gameState.task3_completed = true;
                        window.gameState.task3_just_completed = true; 
                        this.toolbox.resetActiveTool();
                    }
                }
            }
        }

        if (!stageTransitioned) {
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

    toggleHint() {
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        this.hintOverlay.classList.toggle('active');
    }

    destroy() {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);
        if (this.dropInterval) clearInterval(this.dropInterval);
        if (this.bugsAnimInterval) clearInterval(this.bugsAnimInterval);
        window.removeEventListener('pointerdown', this.onPointerDown);
        if (this.wrapper) this.wrapper.removeEventListener('click', this.onSceneClick);
        if (this.backHubBtn) this.backHubBtn.removeEventListener('click', this.onBackClick); 
        if (this.toolbox) this.toolbox.destroy();
        this.container.innerHTML = '';
    }
}