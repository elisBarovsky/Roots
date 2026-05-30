import Level_2 from '../levels/Level_2.js'; 

export default class Task_1 {
    constructor(container) {
        this.container = container;

        this.isDraggingPot = false;
        this.originalTool = null;
        this.activeDraggedTool = null;
        this.toolPlaceholder = null;

        this.isLightZone = false;
        this.growthStage = 0;
        this.growthInterval = null;
        this.wateringTimeout = null;

        this.toolRotation = 0;

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
        this.updateGrowthLogic = this.updateGrowthLogic.bind(this);
        this.onBackClick = this.onBackClick.bind(this); 
    }

    init() {
        this.container.innerHTML = `
            <div class="task1-wrapper" id="task1-wrapper">
                <div class="shadow-overlay"></div>

                <button class="back-to-hub-btn" id="back-hub-btn" title="חזור לחצר">↩ חזרה</button>

                <img src="assets/images/HintBook.png" class="hint-icon" id="hint-btn">

                <div class="hint-overlay" id="hint-overlay">
                    <div class="hint-content-wrapper">
                        <span class="close-hint">&times;</span>
                        <img src="assets/images/Hints/Hint_1.png" class="hint-modal">
                    </div>
                </div>

                <div class="toolbox-container" id="toolbox-container">
                    <img src="assets/images/toolbox_close.jpg" class="toolbox-icon" id="toolbox-toggle">
                    <div class="toolbox-panel" id="toolbox-panel">
                        <img src="assets/images/Tools/magnifier.png" class="tool-item" data-tool="magnifier" title="זכוכית מגדלת">
                        <img src="assets/images/Tools/flashlight.png" class="tool-item" data-tool="flashlight" title="פנס">
                        <img src="assets/images/Tools/watering_can.jpg" class="tool-item" data-tool="watering_can" title="משפך">
                        <img src="assets/images/Tools/hammer.jpg" class="tool-item" data-tool="hammer" title="פטיש">
                    </div>
                </div>

                <img id="magic-item" class="draggable-item" src="${this.potImages[0]}" alt="Magic Item">
                <div id="water-effect" class="water-animation"></div>
            </div>
        `;

        this.wrapper = document.getElementById('task1-wrapper');
        this.item = document.getElementById('magic-item');
        this.hintBtn = document.getElementById('hint-btn');
        this.hintOverlay = document.getElementById('hint-overlay');
        this.toolboxContainer = document.getElementById('toolbox-container');
        this.toolboxToggle = document.getElementById('toolbox-toggle');
        this.waterEffect = document.getElementById('water-effect');
        this.backHubBtn = document.getElementById('back-hub-btn'); 

        this.hintBtn.addEventListener('click', this.toggleHint);
        this.hintOverlay.addEventListener('click', this.toggleHint);
        this.item.addEventListener('pointerdown', this.onPointerDown);

        this.backHubBtn.addEventListener('click', this.onBackClick);

        this.toolboxToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toolboxContainer.classList.toggle('expanded');
        });

        const tools = this.container.querySelectorAll('.tool-item');
        tools.forEach(tool => {
            tool.addEventListener('click', (e) => this.selectTool(e, tool));
        });

        this.wrapper.addEventListener('click', this.onSceneClick);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);

        this.growthInterval = setInterval(this.updateGrowthLogic, 2000);

        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 50);
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

    updateGrowthLogic() {
        if (!this.isLightZone && this.growthStage > 0) {
            this.growthStage--;
            this.item.src = this.potImages[this.growthStage];

            this.wateringProgress = 0;

         //   console.log(`העציץ בצל והוא נובל! שלב: ${this.growthStage}`);

            if (this.growthStage < 2) {
                if (!window.gameState) window.gameState = {};
                window.gameState.task1_completed = false;
            }
        }
    }

    onPointerDown(e) {
        if (this.activeDraggedTool) return;
        e.stopPropagation();
        this.isDraggingPot = true;
        e.preventDefault();
    }

    selectTool(e, tool) {
        e.preventDefault();
        e.stopPropagation();

        if (this.activeDraggedTool) {
            this.resetActiveTool();
        }
        this.item.classList.add('pot-inactive');
        this.activeDraggedTool = tool;

        this.toolPlaceholder = document.createElement('div');
        this.toolPlaceholder.style.width = '50px';
        this.toolPlaceholder.style.height = '50px';
        this.toolPlaceholder.style.display = 'inline-block';
        tool.parentNode.insertBefore(this.toolPlaceholder, tool);

        this.activeDraggedTool.style.position = 'fixed';
        this.activeDraggedTool.style.zIndex = '9999';
        this.activeDraggedTool.style.pointerEvents = 'none';
        this.activeDraggedTool.style.transition = 'transform 0.15s ease-in-out';
        this.toolRotation = 0;
        this.activeDraggedTool.classList.add('dragging');

        document.body.appendChild(this.activeDraggedTool);
        this.updateToolPosition(e.clientX, e.clientY);
    }

    onPointerMove(e) {
        const rect = this.wrapper.getBoundingClientRect();

        if (this.isDraggingPot) {
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;
            mouseX = Math.max(0, Math.min(mouseX, rect.width));
            mouseY = Math.max(0, Math.min(mouseY, rect.height));
            this.item.style.left = `${mouseX}px`;
            this.item.style.top = `${mouseY}px`;

            this.checkDiagonalZone(mouseX, mouseY, rect.width, rect.height);
        }

        if (this.activeDraggedTool) {
            this.updateToolPosition(e.clientX, e.clientY);

            if (this.waterEffect.classList.contains('active')) {
                const wrapperRect = this.wrapper.getBoundingClientRect();
                this.waterEffect.style.left = `${e.clientX - wrapperRect.left - 20}px`;
                this.waterEffect.style.top = `${e.clientY - wrapperRect.top + 30}px`;
            }
        }
    }

    updateToolPosition(clientX, clientY) {
        if (!this.activeDraggedTool) return;
        this.activeDraggedTool.style.left = `${clientX}px`;
        this.activeDraggedTool.style.top = `${clientY}px`;
        this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(2.0) rotate(${this.toolRotation}deg)`, 'important');
    }

    onPointerUp(e) {
        this.isDraggingPot = false;
    }

    onSceneClick(e) {
        if (!this.activeDraggedTool) return;

        const toolType = this.activeDraggedTool.getAttribute('data-tool');

        if (toolType === 'watering_can') {
            const potRect = this.item.getBoundingClientRect();
            const padding = 40;

            const isOverPot = e.clientX >= (potRect.left - padding) &&
                e.clientX <= (potRect.right + padding) &&
                e.clientY >= (potRect.top - padding) &&
                e.clientY <= (potRect.bottom + padding);

            if (isOverPot) {
                if (this.isLightZone) {
                    this.triggerWateringPour(e.clientX, e.clientY);
                    return;
                } else {
                  //  console.log("העציץ חייב להיות בצד המואר כדי לגדול!");
                }
            }
        }

        this.resetActiveTool();
    }

    triggerWateringPour(clientX, clientY) {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);

        this.toolRotation = -45;
        this.activeDraggedTool.style.setProperty('transform', `translate(-50%, -50%) scale(2.0) rotate(${this.toolRotation}deg)`, 'important');


        const rect = this.wrapper.getBoundingClientRect();
        this.waterEffect.style.left = `${clientX - rect.left - 20}px`;
        this.waterEffect.style.top = `${clientY - rect.top + 30}px`;
        this.waterEffect.classList.add('active');

        if (this.wateringProgress === undefined) {
            this.wateringProgress = 0;
        }

        this.wateringProgress += 25;
       // console.log(`מד השקיה: ${this.wateringProgress}% `);

        if (this.wateringProgress >= 100) {
            this.wateringProgress = 0; 

            if (this.growthStage < 2) {
                this.growthStage++;
                this.item.src = this.potImages[this.growthStage];
                //console.log(`יש! העציץ גדל לשלב: ${this.growthStage} `);

                if (this.growthStage === 2) {
               //     console.log(" העציץ פרח לחלוטין! ");
                    this.spawnConfetti(this.item);
    
                    if (!window.gameState) window.gameState = {};
                    window.gameState.task1_completed = true;
                    this.resetActiveTool();
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
            this.activeDraggedTool.style.transform = `translate(-50%, -50%) scale(2.0) rotate(${this.toolRotation}deg)`;
        }
        this.waterEffect.classList.remove('active');
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

    resetActiveTool() {
        if (!this.activeDraggedTool) return;

        this.stopWateringEffect();
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);

        this.item.classList.remove('pot-inactive');
        this.activeDraggedTool.style.position = '';
        this.activeDraggedTool.style.zIndex = '';
        this.activeDraggedTool.style.pointerEvents = '';
        this.activeDraggedTool.style.transform = '';
        this.activeDraggedTool.style.transition = '';
        this.activeDraggedTool.style.left = '';
        this.activeDraggedTool.style.top = '';
        this.activeDraggedTool.classList.remove('dragging');

        if (this.toolPlaceholder && this.toolPlaceholder.parentNode) {
            this.toolPlaceholder.parentNode.insertBefore(this.activeDraggedTool, this.toolPlaceholder);
            this.toolPlaceholder.remove();
            this.toolPlaceholder = null;
        }

        this.activeDraggedTool = null;
    }

    checkDiagonalZone(x, y, width, height) {
        const diagonalLineY = (height / width) * x + (height / 3);
        if (y < diagonalLineY) {
            this.isLightZone = true;
        } else {
            this.isLightZone = false;
        }
    }

    toggleHint() {
        this.hintOverlay.classList.toggle('active');
    }

    destroy() {
        if (this.growthInterval) clearInterval(this.growthInterval);
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
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