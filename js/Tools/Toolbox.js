import { soundManager } from '../Tools/SoundManager.js';


export default class Toolbox {
    constructor(parentContainer) {
        this.parentContainer = parentContainer; 
        this.activeDraggedTool = null;
        this.toolPlaceholder = null;
        this.toolRotation = 0;

        this.selectTool = this.selectTool.bind(this);
        this.updateToolPosition = this.updateToolPosition.bind(this);
        this.resetActiveTool = this.resetActiveTool.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    init() {
        const toolboxHTML = `
            <div class="toolbox-container" id="toolbox-container">
                <img src="assets/images/Tools/toolbox_close.png" class="toolbox-icon" id="toolbox-toggle">
                <div class="toolbox-panel" id="toolbox-panel">
                    <img src="assets/images/Tools/watering_can.png" class="tool-item" data-tool="watering_can" title="משפך">
                    <img src="assets/images/Tools/Thread.png" class="tool-item" data-tool="Thread" title="סליל">
                    
                    <div class="tool-slot" title="מקלות">
                        <span class="tool-count" id="sticks-count">2</span>
                        <img src="assets/images/Tools/Stick_2.png" class="tool-item stacked-tool" data-tool="Stick_2">
                        <img src="assets/images/Tools/Stick_1.png" class="tool-item stacked-tool" data-tool="Stick_1">
                    </div>

                    <img src="assets/images/Tools/Bee.png" class="tool-item" data-tool="Bee" title="מקל דבורה">
                    <img src="assets/images/Tools/Open_Scissors.png" class="tool-item" data-tool="Scissors" title="מספריים">
                    <img src="assets/images/Tools/shovel.png" class="tool-item" data-tool="shovel" title="חפירה">
                    <img src="assets/images/Tools/Spray_1.png" class="tool-item" data-tool="spray" title="ספריי">
                    <img src="assets/images/Tools/Hand_saw.png" class="tool-item" data-tool="Hand_saw" title="מסור ידני">
                </div>
            </div>
        `;
        
        this.parentContainer.insertAdjacentHTML('beforeend', toolboxHTML);

        this.toolboxContainer = document.getElementById('toolbox-container');
        this.toolboxToggle = document.getElementById('toolbox-toggle');

        this.toolboxToggle.addEventListener('click', (e) => {
            e.stopPropagation();

            if (typeof soundManager !== 'undefined') soundManager.play('toolBoxSound');

            if (this.activeDraggedTool) {
                this.resetActiveTool();
            } else {
                const isExpanded = this.toolboxContainer.classList.toggle('expanded');
                
                if (isExpanded) {
                    this.toolboxToggle.src = 'assets/images/Tools/toolbox_open.png';
                } else {
                    this.toolboxToggle.src = 'assets/images/Tools/toolbox_close.png';
                }
            }
        });

        this.toolboxContainer.addEventListener('click', (e) => {
            if (this.activeDraggedTool) {
                e.stopPropagation();
                this.resetActiveTool();
            }
        });

        const tools = this.parentContainer.querySelectorAll('.tool-item');
        tools.forEach(tool => {
            tool.addEventListener('click', (e) => this.selectTool(e, tool));
        });

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('contextmenu', this.handleContextMenu);
    }

    getActiveTool() {
        return this.activeDraggedTool;
    }

    getActiveToolType() {
        return this.activeDraggedTool ? this.activeDraggedTool.getAttribute('data-tool') : null;
    }

    closeDrawer() {
        const toolboxEl = document.getElementById('toolbox-container'); 
        if (toolboxEl && toolboxEl.classList.contains('open')) {
           
            if (typeof soundManager !== 'undefined') soundManager.play('toolboxSound');

            toolboxEl.classList.remove('open');
        }
        
        this.resetActiveTool(); 
    }

    playToolAnimation() {
        if (!this.activeDraggedTool) return;
        const toolType = this.getActiveToolType();

        if (toolType === 'Scissors') {

            if (typeof soundManager !== 'undefined') {
                soundManager.play('scissors'); 
            }
            this.activeDraggedTool.src = 'assets/images/Tools/Close_Scissors.png'; 
            setTimeout(() => {
                if (this.activeDraggedTool && this.activeDraggedTool.getAttribute('data-tool') === 'Scissors') {
                    this.activeDraggedTool.src = 'assets/images/Tools/Open_Scissors.png'; 
                }
            }, 200);
        }

        if (toolType === 'spray') {

            if (typeof soundManager !== 'undefined') {
                soundManager.play('spray'); 
            } 

            this.activeDraggedTool.style.setProperty('transform', 'translate(-50%, -10%) scale(1.5) rotate(0deg)', 'important');
            this.activeDraggedTool.src = 'assets/images/Tools/Spray_2.png'; 

            setTimeout(() => {
                if (this.activeDraggedTool && this.activeDraggedTool.getAttribute('data-tool') === 'spray') {
                    this.activeDraggedTool.src = 'assets/images/Tools/Spray_1.png'; 
                    this.activeDraggedTool.style.setProperty('transform', 'translate(-50%, -10%) scale(1.5) rotate(0deg)', 'important');
                }
            }, 200);
        }
    }

    updateSticksCount() {
        const countEl = document.getElementById('sticks-count');
        if (countEl) {
            let current = parseInt(countEl.innerText);
            if (current > 0) {
                countEl.innerText = current - 1;
                if (current - 1 === 0) {
                    countEl.style.display = 'none'; 
                }
            }
        }
    }

    spawnParticle(type, clientX, clientY) {
        const particle = document.createElement('img');
        particle.style.position = 'fixed';
        particle.style.left = `${clientX}px`;
        particle.style.top = `${clientY}px`;

        if (type === 'water') {
            const dropImages = ['WaterDrop_1.png', 'WaterDrop_2.png', 'WaterDrop_3.png', 'WaterDrop_4.png']; 
            
            const randomDrop = dropImages[Math.floor(Math.random() * dropImages.length)];
            
            particle.src = `assets/images/Tools/Water/${randomDrop}`; 
            
            particle.className = 'drop-particle';
            
            const randomOffsetX = (Math.random() - 0.5) * 40; 
            
            particle.style.setProperty('--offsetX', `${randomOffsetX}px`);
            
        } else if (type === 'spray') {
            const sprayImages = ['miniSpray_1.png', 'miniSpray_2.png', 'miniSpray_3.png', 'miniSpray_4.png'];
            
            const randomMist = sprayImages[Math.floor(Math.random() * sprayImages.length)];
            
            particle.src = `assets/images/Tools/Spray/${randomMist}`; 
            
            particle.className = 'mist-particle';
            
            const randomDirX = 20 + Math.random() * 40; 
            const randomDirY = (Math.random() - 0.5) * 40; 
            
            particle.style.setProperty('--dirX', `${randomDirX}px`);
            particle.style.setProperty('--dirY', `${randomDirY}px`);
        }

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 600);
    }

   selectTool(e, tool) {
        e.preventDefault();
        e.stopPropagation();

        if (this.activeDraggedTool) {
            this.resetActiveTool();
        }

        this.activeDraggedTool = tool;

        if (typeof soundManager !== 'undefined') {
            soundManager.play('pickTool');
        }

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
        
        const toolType = this.activeDraggedTool.getAttribute('data-tool');
        const translateY = toolType === 'spray' ? '-10%' : '-50%';
        this.activeDraggedTool.style.setProperty('transform', `translate(-50%, ${translateY}) scale(1.5)`, 'important');

        document.body.appendChild(this.activeDraggedTool);
        this.updateToolPosition(e.clientX, e.clientY);

        if (this.toolboxContainer && this.toolboxContainer.classList.contains('expanded')) {

            if (typeof soundManager !== 'undefined') soundManager.play('toolBoxSound');

            this.toolboxContainer.classList.remove('expanded');
            
            if (this.toolboxToggle) {
                this.toolboxToggle.src = 'assets/images/Tools/toolbox_close.png';
            }
        }
    }

    onPointerMove(e) {
        if (this.activeDraggedTool) {
            this.updateToolPosition(e.clientX, e.clientY);
        }
    }

    updateToolPosition(clientX, clientY) {
        this.activeDraggedTool.style.left = `${clientX}px`;
        this.activeDraggedTool.style.top = `${clientY}px`;
        
        const toolType = this.getActiveToolType();
        const translateY = toolType === 'spray' ? '-10%' : '-50%';
        
        this.activeDraggedTool.style.setProperty('transform', `translate(-50%, ${translateY}) scale(1.5) rotate(${this.toolRotation}deg)`, 'important');
    }

    handleContextMenu(e) {
        if (this.activeDraggedTool) {
            e.preventDefault();
            this.resetActiveTool();
        }
    }

    resetActiveTool() {
        if (!this.activeDraggedTool) return;

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
            this.activeDraggedTool.src = 'assets/images/Tools/Open_Scissors.png';
        }

        if (this.activeDraggedTool.getAttribute('data-tool') === 'spray') {
            this.activeDraggedTool.src = 'assets/images/Tools/Spray_1.png';
        }

        if (this.toolPlaceholder && this.toolPlaceholder.parentNode) {
            this.toolPlaceholder.parentNode.insertBefore(this.activeDraggedTool, this.toolPlaceholder);
            this.toolPlaceholder.remove();
            this.toolPlaceholder = null;
        }

        this.activeDraggedTool = null;
    }

    destroy() {
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('contextmenu', this.handleContextMenu);
        if (this.activeDraggedTool) this.activeDraggedTool.remove();
    }
}