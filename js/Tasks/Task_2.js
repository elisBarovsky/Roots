import Level_2 from '../levels/Level_2.js'; 
import Toolbox from '../Tools/Toolbox.js'; 

import { soundManager } from '../Tools/SoundManager.js';
export default class Task_2 {
    constructor(container) {
        this.container = container;

        this.growthStage = 0;
        this.wateringTimeout = null;
        this.dropInterval = null;
        this.stick1Placed = false;
        this.stick2Placed = false;
        this.ropePlaced = false;
        this.isPointerDown = false; 
        
        this.basePoints = null;
        this.isTracingRope = false;
        this.currentSegmentIndex = 0;

        this.potImages = {
            0: 'assets/images/Task_2/items/BasePot.png',
            1: 'assets/images/Task_2/items/SproutingPot.png',
            2: 'assets/images/Task_2/items/FloweringPot.png'
        };

        this.potWithThreadImages = {
            0: 'assets/images/Task_2/items/PotWithThread_1.png',
            1: 'assets/images/Task_2/items/PotWithThread_2.png',
            2: 'assets/images/Task_2/items/PotWithThread_3.png'
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
            <div class="task2-wrapper" id="task2-wrapper">
                <button class="back-to-hub-btn" id="back-hub-btn" title="חזור לחצר">↩ חזרה</button>
                <img src="assets/images/HintBook.png" class="hint-icon" id="hint-btn">

                <div class="hint-overlay" id="hint-overlay">
                    <div class="hint-content-wrapper">
                        <span class="close-hint">&times;</span>
                        <img src="assets/images/Hints/Hint_2.png" class="hint-modal">
                    </div>
                </div>

                <div id="pot-assembly-container" class="pot-assembly-zone">
                    <svg id="zigzag-rope-svg" class="zigzag-rope"></svg>
                    <img id="magic-item" class="task2-pot-element" src="${this.potImages[0]}" alt="Magic Item">
                </div>
            </div>
        `;

        this.wrapper = document.getElementById('task2-wrapper');
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
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);

        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 50);
    }

    onPointerDown(e) {
        this.isPointerDown = true;
    }

    getDistanceFromSegmentAndProjection(p, v, w) {
        const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
        if (l2 === 0) return { dist: Math.hypot(p.x - v.x, p.y - v.y), proj: v };
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = v.x + t * (w.x - v.x);
        const projY = v.y + t * (w.y - v.y);
        return {
            dist: Math.hypot(p.x - projX, p.y - projY),
            proj: { x: projX, y: projY }
        };
    }

    onPointerMove(e) {
        const toolType = this.toolbox.getActiveToolType();
        
        if (toolType) {
            if (toolType === 'Thread' && this.basePoints && !this.ropePlaced) {
                const containerRect = this.potContainer.getBoundingClientRect();
                const mouseP = {
                    x: e.clientX - containerRect.left,
                    y: e.clientY - containerRect.top
                };

                if (this.isPointerDown) {
                    if (!this.isTracingRope) {
                        if (Math.hypot(mouseP.x - this.basePoints[0].x, mouseP.y - this.basePoints[0].y) < 40) {
                            this.isTracingRope = true;
                            this.currentSegmentIndex = 0;
                            this.updateWaypointVisuals();
                        }
                    } else {
                        const p1 = this.basePoints[this.currentSegmentIndex];
                        const p2 = this.basePoints[this.currentSegmentIndex + 1];

                        const segData = this.getDistanceFromSegmentAndProjection(mouseP, p1, p2);

                        if (segData.dist > 45) {
                            this.resetRopeProgress();
                            return;
                        }

                        const completedPoints = this.basePoints.slice(0, this.currentSegmentIndex + 1);
                        const pointsStr = completedPoints.map(pt => `${pt.x},${pt.y}`).join(' ') + ` ${segData.proj.x},${segData.proj.y}`;
                        const filledPath = document.getElementById('rope-filled-path');
                        if (filledPath) filledPath.setAttribute('points', pointsStr);

                        if (Math.hypot(mouseP.x - p2.x, mouseP.y - p2.y) < 35) {

                            if (typeof soundManager !== 'undefined') {
                                soundManager.play('ropeSound');
                            } 

                            this.currentSegmentIndex++;
                            if (this.currentSegmentIndex >= this.basePoints.length - 1) {
                                this.completeRopeTask();
                            } else {
                                this.updateWaypointVisuals();
                            }
                        }
                    }
                }
            }
        }
    }

    updateWaypointVisuals() {
        this.potContainer.querySelectorAll('.rope-waypoint').forEach(el => {
            el.classList.remove('active-target', 'completed');
            const idx = parseInt(el.dataset.index);
            if (idx === this.currentSegmentIndex + 1) {
                el.classList.add('active-target'); 
            } else if (idx <= this.currentSegmentIndex) {
                el.classList.add('completed');
            }
        });
    }

    resetRopeProgress() {
        this.isTracingRope = false;
        this.currentSegmentIndex = 0;
        const filledPath = document.getElementById('rope-filled-path');
        if (filledPath) {
            filledPath.setAttribute('points', ''); 
        }
        
        this.potContainer.querySelectorAll('.rope-waypoint').forEach(el => {
            el.classList.remove('active-target', 'completed');
            if (parseInt(el.dataset.index) === 0) {
                el.classList.add('active-target');
            }
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

    onPointerUp(e) {
        this.isPointerDown = false; 

        const toolType = this.toolbox.getActiveToolType();
        if (!toolType) return;

        if (toolType === 'Thread' && this.isTracingRope && !this.ropePlaced) {
            this.resetRopeProgress();
            return;
        }

        if (toolType === 'Stick_1' || toolType === 'Stick_2') {
            const potRect = this.item.getBoundingClientRect();
            const isNearPot = e.clientX >= potRect.left && e.clientX <= potRect.right && e.clientY >= potRect.top - 100 && e.clientY <= potRect.bottom + 100;

            if (isNearPot) {
                const potCenterX = potRect.left + potRect.width / 2;

                if (toolType === 'Stick_1' && e.clientX < potCenterX && !this.stick1Placed) {
                    this.placeStickPermanent('Stick_1', 'left');
                    return;
                }
                if (toolType === 'Stick_2' && e.clientX > potCenterX && !this.stick2Placed) {
                    this.placeStickPermanent('Stick_2', 'right');
                    return;
                }
            }
        }
    }

    placeStickPermanent(type, side) {

        if (typeof soundManager !== 'undefined') {
            soundManager.play('stickSnap');
        }
        const placedStick = document.createElement('img');
        placedStick.src = `assets/images/Tools/${type}.png`;
        placedStick.className = `placed-stick-child ${side}-stick-child`;
        this.potContainer.appendChild(placedStick);

        if (side === 'left') {
            this.stick1Placed = true;
        } else {
            this.stick2Placed = true;
        }

        const toolEl = this.toolbox.getActiveTool();
        if (toolEl) toolEl.remove();
        
        this.toolbox.activeDraggedTool = null;
        if (this.toolbox.toolPlaceholder) {
            this.toolbox.toolPlaceholder.remove();
            this.toolbox.toolPlaceholder = null;
        }
        this.toolbox.updateSticksCount(); 
        
        if (this.stick1Placed && this.stick2Placed) {
            this.drawZigzagRope();
        }
        this.checkTaskCompletion();
    }

    drawZigzagRope() {
        if (!this.stick1Placed || !this.stick2Placed) return;

        const leftStickEl = this.potContainer.querySelector('.left-stick-child');
        const rightStickEl = this.potContainer.querySelector('.right-stick-child');
        const svgEl = document.getElementById('zigzag-rope-svg');

        if (!leftStickEl || !rightStickEl || !svgEl) return;

        const leftRect = leftStickEl.getBoundingClientRect();
        const rightRect = rightStickEl.getBoundingClientRect();
        const containerRect = this.potContainer.getBoundingClientRect();

        const xLeft = leftRect.left + (leftRect.width / 2) - containerRect.left;
        const yLeftBase = leftRect.bottom - containerRect.top;
        const yLeftTop = leftRect.top - containerRect.top;

        const xRight = rightRect.left + (rightRect.width / 2) - containerRect.left;
        const yRightBase = rightRect.bottom - containerRect.top;
        const yRightTop = rightRect.top - containerRect.top;

        const totalHeight = yLeftBase - yLeftTop;
        const step = totalHeight / 6;

        this.basePoints = [
            { x: xLeft, y: yLeftBase },
            { x: xRight, y: yLeftBase - step * 0.5 },
            { x: xLeft, y: yLeftBase - step * 1.5 },
            { x: xRight, y: yLeftBase - step * 2.5 },
            { x: xLeft, y: yLeftBase - step * 3.5 },
            { x: xRight, y: yLeftBase - step * 4.5 },
            { x: xLeft, y: yLeftBase - step * 5.5 },
            { x: xRight, y: yRightTop }
        ];

        this.isTracingRope = false;
        this.currentSegmentIndex = 0;
        const allPointsStr = this.basePoints.map(pt => `${pt.x},${pt.y}`).join(' ');

        svgEl.innerHTML = `
            <polyline points="${allPointsStr}" class="rope-guide" />
            <polyline points="" id="rope-filled-path" class="rope-filled" />
        `; 

        this.basePoints.forEach((pt, index) => {
            const waypoint = document.createElement('div');
            waypoint.className = 'rope-waypoint';
            waypoint.dataset.index = index;
            waypoint.style.left = `${pt.x}px`;
            waypoint.style.top = `${pt.y}px`;
            
            if (index === 0) waypoint.classList.add('active-target');

            this.potContainer.appendChild(waypoint);
        });
    }

    completeRopeTask() {
        this.ropePlaced = true;
        this.growthStage = 0; 
        this.wateringProgress = 0; 

        this.potContainer.innerHTML = `
            <img id="magic-item" class="task2-pot-element final-pot-image stage-0" src="${this.potWithThreadImages[0]}" alt="Pot With Thread">
        `;
        
        this.item = document.getElementById('magic-item');
        this.toolbox.resetActiveTool();
        this.checkTaskCompletion();
    }

    checkTaskCompletion() {
        if (this.stick1Placed && this.stick2Placed && this.ropePlaced && this.growthStage === 2) {

            if (this.toolbox && typeof this.toolbox.closeDrawer === 'function') {
               this.toolbox.closeDrawer();
            }

            if (!window.gameState) window.gameState = {};
            window.gameState.task2_completed = true;
            window.gameState.task2_just_completed = true;
        }
    }

    onSceneClick(e) {
        const toolType = this.toolbox.getActiveToolType();
        if (!toolType) return;

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

        this.toolbox.resetActiveTool();
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

        if (this.wateringProgress === undefined) {
            this.wateringProgress = 0;
        }

        this.wateringProgress += 25;

        if (this.wateringProgress >= 100) {
            this.wateringProgress = 0; 

            if (this.growthStage < 2) {
                this.growthStage++;
                
                if (this.ropePlaced) {
                    this.item.src = this.potWithThreadImages[this.growthStage];
                    this.item.className = `task2-pot-element final-pot-image stage-${this.growthStage}`;
                } else {
                    this.item.src = this.potImages[this.growthStage];
                }
                
                if (this.growthStage === 2) {
                    this.spawnConfetti();
                    this.toolbox.resetActiveTool();

                    // --- תוספת: עצירת המים וסגירת המגירה והתיבה ---
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
                }
                
                this.checkTaskCompletion();
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

    toggleHint() {
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        this.hintOverlay.classList.toggle('active');
    }

    destroy() {
        if (this.wateringTimeout) clearTimeout(this.wateringTimeout);
        if (this.dropInterval) clearInterval(this.dropInterval);
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
        if (this.wrapper) this.wrapper.removeEventListener('click', this.onSceneClick);
        if (this.backHubBtn) this.backHubBtn.removeEventListener('click', this.onBackClick); 
        if (this.toolbox) this.toolbox.destroy();
        this.container.innerHTML = '';
    }
}