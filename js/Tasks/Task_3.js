import Level_2 from '../levels/Level_2.js'; 

export default class Task_3 {
    constructor(container) {
        this.container = container;
        this.activeDraggedTool = null;
        this.toolPlaceholder = null;
        this.growthStage = 0;
        this.wateringTimeout = null;
        
        this.potImages = {
            0: 'assets/images/Task_3/items/First_Pot.png',
            1: 'assets/images/Task_3/items/Second_Pot.png'
            // 2: 'assets/images/Task_3/items/FloweringPot.png' 
        };

        this.toggleHint = this.toggleHint.bind(this); 
        this.onBackClick = this.onBackClick.bind(this); 
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
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

                <div class="toolbox-container" id="toolbox-container">
                    <img src="assets/images/toolbox_close.jpg" class="toolbox-icon" id="toolbox-toggle">
                    <div class="toolbox-panel" id="toolbox-panel">
                        <img src="assets/images/Task_1/Tools/flashlight.png" class="tool-item" data-tool="flashlight" title="פנס">
                        <img src="assets/images/Tools/watering_can.jpg" class="tool-item" data-tool="watering_can" title="משפך">
                        <img src="assets/images/Task_3/Tools/Thread.png" class="tool-item" data-tool="Thread" title="סליל">
                        <img src="assets/images/Task_3/Tools/Spray.png" class="tool-item" data-tool="spray" title="תרסיס">
                        <img src="assets/images/Task_3/Tools/Open_Scissors.png" class="tool-item" data-tool="Scissors" title="מספריים">
                    </div>
                </div>

                <div id="pot-assembly-container" class="task3-pot-zone">
                    <img id="magic-item" class="task3-pot-element" src="${this.potImages[0]}" alt="Magic Item">
                    <div id="leaves-container"></div>
                    <div id="bugs-container"></div>
                </div>

                <div id="water-effect" class="water-animation"></div>
                <div id="spray-effect" class="spray-animation"></div> </div>
            </div>
        `;

        this.wrapper = document.getElementById('task3-wrapper');
        this.potContainer = document.getElementById('pot-assembly-container'); 
        this.item = document.getElementById('magic-item');
        this.hintBtn = document.getElementById('hint-btn');
        this.hintOverlay = document.getElementById('hint-overlay');
        this.toolboxContainer = document.getElementById('toolbox-container');
        this.toolboxToggle = document.getElementById('toolbox-toggle');
        this.waterEffect = document.getElementById('water-effect');
        this.backHubBtn = document.getElementById('back-hub-btn'); 
        this.sprayEffect = document.getElementById('spray-effect');

        this.hintBtn.addEventListener('click', this.toggleHint);
        this.hintOverlay.addEventListener('click', this.toggleHint);
        this.backHubBtn.addEventListener('click', this.onBackClick);

        this.toolboxToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.activeDraggedTool) {
                this.resetActiveTool();
            } else {
                this.toolboxContainer.classList.toggle('expanded');
            }
        });

        this.toolboxContainer.addEventListener('click', (e) => {
            if (this.activeDraggedTool) {
                e.stopPropagation();
                this.resetActiveTool();
            }
        });

        const tools = this.container.querySelectorAll('.tool-item');
        tools.forEach(tool => {
            tool.addEventListener('click', (e) => this.selectTool(e, tool));
        });

        this.wrapper.addEventListener('click', this.onSceneClick);
        window.addEventListener('pointerdown', this.onPointerDown); 
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);

        window.addEventListener('contextmenu', (e) => {
            if (this.activeDraggedTool) {
                e.preventDefault();
                this.resetActiveTool();
            }
        });

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
                const leafType = isEaten ? 'EatenLeaf' : 'Leaf';
                
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

        for (let i = 0; i < 10; i++) {
            const bug = document.createElement('img');
            
            const randomBugType = Math.random() > 0.5 ? 1 : 2;
            bug.src = `assets/images/Task_3/items/Bug_${randomBugType}.png`;
            bug.className = 'bug-element';
            
            const randomX = Math.floor(Math.random() * 80) + 10;
            const randomY = Math.floor(Math.random() * 65);

            bug.style.left = `${randomX}%`;
            bug.style.top = `${randomY}%`;
            bug.style.animationDelay = `${Math.random() * 2}s`;

            if (!this.activeBugs) this.activeBugs = [];
            this.activeBugs.push(bug);

            bugsContainer.appendChild(bug);
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

    selectTool(e, tool) {
        e.preventDefault();
        e.stopPropagation();

        if (this.activeDraggedTool) {
            this.resetActiveTool();
        }

        this.activeDraggedTool = tool;

        this.toolPlaceholder = document.createElement('div');
        this.toolPlaceholder.style.width = '50px';
        this.toolPlaceholder.style.height = '50px';
        this.toolPlaceholder.style.display = 'inline-block';
        tool.parentNode.insertBefore(this.toolPlaceholder, tool);

        this.activeDraggedTool.style.position = 'fixed';
        this.activeDraggedTool.style.zIndex = '9999';
        this.activeDraggedTool.style.pointerEvents = 'none';
        
        this.toolRotation = 0;
        this.activeDraggedTool.classList.add('dragging');
        this.activeDraggedTool.style.setProperty('transform', 'translate(-50%, -50%) scale(1.5)', 'important');

        document.body.appendChild(this.activeDraggedTool);
        this.updateToolPosition(e.clientX, e.clientY);
    }

    onPointerDown(e) {
        this.isPointerDown = true;
    }

    onPointerMove(e) {
        if (this.activeDraggedTool) {
            this.updateToolPosition(e.clientX, e.clientY);
        }
    }

    onPointerUp(e) {
        this.isPointerDown = false; 
    }

    onBackClick(e) {
        e.stopPropagation();
        this.container.classList.add('fade-out');

        setTimeout(() => {
            this.destroy();
            const level2 = new Level_2(this.container);
            level2.init();
            this.container.classList.remove('fade-out');
        }, 1500);
    }

    updateToolPosition(clientX, clientY) {
        if (!this.activeDraggedTool) return;
        this.activeDraggedTool.style.left = `${clientX}px`;
        this.activeDraggedTool.style.top = `${clientY}px`;
        this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(${this.toolRotation}deg)`, 'important');
    }

    onSceneClick(e) {
        if (!this.activeDraggedTool) return;

        const toolType = this.activeDraggedTool.getAttribute('data-tool');
        const target = e.target;

        if (toolType === 'Scissors') {
            this.activeDraggedTool.src = 'assets/images/Task_3/Tools/Close_Scissors.png';
            
            setTimeout(() => {
                if (this.activeDraggedTool && this.activeDraggedTool.getAttribute('data-tool') === 'Scissors') {
                    this.activeDraggedTool.src = 'assets/images/Task_3/Tools/Open_Scissors.png';
                }
            }, 200);
            
            if (target.classList.contains('eaten-leaf')) {
                target.classList.add('falling-leaf');
                target.style.pointerEvents = 'none'; 
                setTimeout(() => target.remove(), 1000); 
            }
            return; 
        }

        if (toolType === 'spray') {
            this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(-20deg)`, 'important');
            setTimeout(() => {
                if (this.activeDraggedTool && this.activeDraggedTool.getAttribute('data-tool') === 'spray') {
                    this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(0deg)`, 'important');
                }
            }, 200);

            if (this.sprayEffect) {
                const rect = this.wrapper.getBoundingClientRect();

                const nozzleOffsetX = 15; 
                const nozzleOffsetY = -65; 
                
                this.sprayEffect.style.left = `${e.clientX - rect.left + nozzleOffsetX}px`;
                this.sprayEffect.style.top = `${e.clientY - rect.top + nozzleOffsetY}px`;
                
                this.sprayEffect.classList.remove('active');
                void this.sprayEffect.offsetWidth; 
                this.sprayEffect.classList.add('active');
            }

            if (target.classList.contains('bug-element')) {
                target.style.transition = 'transform 0.4s, opacity 0.4s';
                target.style.transform = 'scale(0) rotate(180deg)';
                target.style.opacity = '0';
                target.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    target.remove();
                    
                    const remainingBugs = document.querySelectorAll('.bug-element').length;
                    
                    if (remainingBugs === 0) {
                        this.spawnConfetti();
                        this.resetActiveTool();

                        if (!window.gameState) window.gameState = {};
                        window.gameState.task3_completed = true; 
                        window.gameState.task3_just_completed = true; 
                    }
                }, 400);
            }
            return;
        }

        if (toolType === 'watering_can') {
            const potRect = this.item.getBoundingClientRect();
            const padding = 40;

            const isOverPot = e.clientX >= (potRect.left - padding) &&
                e.clientX <= (potRect.right + padding) &&
                e.clientY >= (potRect.top - padding) &&
                e.clientY <= (potRect.bottom + padding);

            if (isOverPot) {
                this.triggerWateringPour(e.clientX, e.clientY);
                return;
            }
        }

        this.resetActiveTool();
    }

    triggerWateringPour(clientX, clientY) {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);

        this.toolRotation = -45;
        this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(${this.toolRotation}deg)`, 'important');

        const rect = this.wrapper.getBoundingClientRect();
        this.waterEffect.style.left = `${clientX - rect.left - 20}px`;
        this.waterEffect.style.top = `${clientY - rect.top + 30}px`;
        this.waterEffect.classList.add('active');

        const eatenLeavesCount = document.querySelectorAll('.eaten-leaf').length;
        const bugsCount = document.querySelectorAll('.bug-element').length;

        if (this.growthStage === 0 && eatenLeavesCount > 0) {
            // לא עושים כלום, צריך לגזור קודם
        } else if (this.growthStage === 1 && bugsCount > 0) {
            // לא עושים כלום, צריך לרסס קודם
        } else {
            if (this.wateringProgress === undefined) {
                this.wateringProgress = 0;
            }

            this.wateringProgress += 25;

            if (this.wateringProgress >= 100) {
                this.wateringProgress = 0; 

                if (this.growthStage < 2) {
                    this.growthStage++;
                    
                    if (this.potImages[this.growthStage]) {
                        this.item.src = this.potImages[this.growthStage];
                    }
                    
                    if (this.growthStage === 1) {
                        this.spawnBugs();
                    }
                    
                    if (this.growthStage === 2) {
                        this.spawnConfetti(); 
                        if (!window.gameState) window.gameState = {};
                        window.gameState.task3_completed = true;
                        this.resetActiveTool();
                    }
                }
            }
        }

        this.wateringTimeout = setTimeout(() => {
            this.stopWateringEffect();
        }, 800);
    }

    stopWateringEffect() {
        this.toolRotation = 0;
        if (this.activeDraggedTool) {
            this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(1.5) rotate(${this.toolRotation}deg)`, 'important');
        }
        this.waterEffect.classList.remove('active');
    }

    resetActiveTool() {
        if (!this.activeDraggedTool) return;

        this.stopWateringEffect();
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);

        this.activeDraggedTool.style.position = '';
        this.activeDraggedTool.style.zIndex = '';
        this.activeDraggedTool.style.pointerEvents = '';
        this.activeDraggedTool.style.transform = '';
        this.activeDraggedTool.style.transition = '';
        this.activeDraggedTool.style.left = '';
        this.activeDraggedTool.style.top = '';
        this.activeDraggedTool.style.width = '';  
        this.activeDraggedTool.style.height = '';
        this.activeDraggedTool.classList.remove('dragging');

        if (this.activeDraggedTool.getAttribute('data-tool') === 'Scissors') {
            this.activeDraggedTool.src = 'assets/images/Task_3/Tools/Open_Scissors.png';
        }

        if (this.toolPlaceholder && this.toolPlaceholder.parentNode) {
            this.toolPlaceholder.parentNode.insertBefore(this.activeDraggedTool, this.toolPlaceholder);
            this.toolPlaceholder.remove();
            this.toolPlaceholder = null;
        }

        this.activeDraggedTool = null;
    }

    toggleHint() {
        this.hintOverlay.classList.toggle('active');
    }

    destroy() {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);
 
        if (this.wrapper) {
            this.wrapper.removeEventListener('click', this.onSceneClick);
        }
        if (this.backHubBtn) {
            this.backHubBtn.removeEventListener('click', this.onBackClick); 
        }
        if (this.activeDraggedTool) {
            this.activeDraggedTool.remove();
        }
        this.container.innerHTML = '';
    }
}