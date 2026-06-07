import Task_1 from '../Tasks/Task_1.js';
import Task_2 from '../Tasks/Task_2.js';
import Task_3 from '../Tasks/Task_3.js';
import { soundManager } from '../Tools/SoundManager.js';

export default class Level_2 {
    constructor(container) {
        this.container = container;

        this.onTask1Click = this.onTask1Click.bind(this);
        this.onTask2Click = this.onTask2Click.bind(this);
        this.onTask3Click = this.onTask3Click.bind(this);
        this.onHover = this.onHover.bind(this); 
    }

    init() {

        let backgroundImage = 'assets/images/porch_before.png';

         if (window.gameState && 
            window.gameState.task1_completed && 
            window.gameState.task2_completed && 
            window.gameState.task3_completed) {
            backgroundImage = 'assets/images/porch_after.png';
            this.showStatusBanner("You started by taking care of someone else's plants\nSomewhere along the way, you learned how to take care of yourself too");
        }
        
  
                              
        if (typeof soundManager !== 'undefined') {
            soundManager.playBackgroundMusic();
        }
        
        const t1 = window.gameState.task1_completed ? 'FloweringPot.png' : 'DryPot.png';
        const t2 = window.gameState.task2_completed ? 'PotWithThread_3.png' : 'BasePot.png';
        const t3 = window.gameState.task3_completed ? 'Third_Pot.png' : 'First_Pot.png';
    
        const c1 = window.gameState.task1_completed ? 'completed' : '';
        const c2 = window.gameState.task2_completed ? 'completed' : '';
        const c3 = window.gameState.task3_completed ? 'completed' : '';

         this.container.innerHTML = `
        <div class="hub-wrapper">
            <img src="${backgroundImage}" class="hub-bg" alt="Hub Room">
            
            <img id="task1-item" src="assets/images/Task_1/items/${t1}" class="hub-item task1 ${c1}" style="bottom: 8%; left: 13%;">
            <img id="task2-item" src="assets/images/Task_2/items/${t2}" class="hub-item task2 ${c2}" style="bottom: 6%; left: 28%;">
            <img id="task3-item" src="assets/images/Task_3/items/${t3}" class="hub-item task3 ${c3}" style="bottom: 6%; right: 13%;">
        </div>
        `;

        this.t1 = document.getElementById('task1-item');
        this.t2 = document.getElementById('task2-item');
        this.t3 = document.getElementById('task3-item');

        if (window.gameState.task1_just_completed) {
            if (this.t1) this.t1.classList.add('magic-item-win');
            window.gameState.task1_just_completed = false; 
        }
        
        if (window.gameState.task2_just_completed) {
            if (this.t2) this.t2.classList.add('magic-item-win');
            window.gameState.task2_just_completed = false;
        }

        if (window.gameState.task3_just_completed) {
            if (this.t3) this.t3.classList.add('magic-item-win');
            window.gameState.task3_just_completed = false;
        }

        if (!window.gameState.task1_completed) {
            this.t1.addEventListener('click', this.onTask1Click);
            this.t1.addEventListener('mouseenter', this.onHover);
        }
        if (!window.gameState.task2_completed) {
            this.t2.addEventListener('click', this.onTask2Click);
            this.t2.addEventListener('mouseenter', this.onHover);
        }
        if (!window.gameState.task3_completed) {
            this.t3.addEventListener('click', this.onTask3Click);
            this.t3.addEventListener('mouseenter', this.onHover);
        }

       
        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 50);
    }

    showStatusBanner(text) {
        const banner = document.createElement('div');
        banner.className = 'status-banner';
        banner.innerText = text;
        document.body.appendChild(banner);
        
        // מופיע
        requestAnimationFrame(() => banner.classList.add('show'));
        
        // // נעלם אחרי 4 שניות
        // setTimeout(() => {
        //     banner.classList.remove('show');
        //     setTimeout(() => banner.remove(), 500);
        // }, 4000);
    }
    onHover() {
        if (typeof soundManager !== 'undefined') {
            soundManager.play('hoverSound'); 
        }
    }

    onTask1Click() {
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        
        this.container.classList.add('fade-out');

        setTimeout(() => {
            this.destroy(); 
            const task1 = new Task_1(this.container);
            task1.init();
        }, 1000);
    }

    onTask2Click() {
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        
        this.container.classList.add('fade-out');
        setTimeout(() => {
            this.destroy();
            const task2 = new Task_2(this.container);
            task2.init();
        }, 1000);
    }

    onTask3Click() {
        if (typeof soundManager !== 'undefined') soundManager.play('clickSound');
        
        this.container.classList.add('fade-out');
        setTimeout(() => {
            this.destroy();
            const task3 = new Task_3(this.container);
            task3.init();
        }, 1000);
    }

    destroy() {
        if (this.t1) {
            this.t1.removeEventListener('click', this.onTask1Click);
            this.t1.removeEventListener('mouseenter', this.onHover);
        }
        if (this.t2) {
            this.t2.removeEventListener('click', this.onTask2Click);
            this.t2.removeEventListener('mouseenter', this.onHover);
        }
        if (this.t3) {
            this.t3.removeEventListener('click', this.onTask3Click);
            this.t3.removeEventListener('mouseenter', this.onHover);
        }
        
        this.container.innerHTML = '';
    }
}