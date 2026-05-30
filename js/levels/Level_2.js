import Task_1 from '../Tasks/Task_1.js';
import Task_2 from '../Tasks/Task_2.js';
import Task_3 from '../Tasks/Task_3.js';

export default class Level_2 {
    constructor(container) {
        this.container = container;

        this.onTask1Click = this.onTask1Click.bind(this);
        this.onTask2Click = this.onTask2Click.bind(this);
        this.onTask3Click = this.onTask3Click.bind(this);
    }

    init() {

        const t1 = window.gameState.task1_completed ? 'FloweringPot.png' : 'DryPot.png';
        const t2 = window.gameState.task2_completed ? 'PotWithThread_3.png' : 'BasePot.png';
        const t3 = window.gameState.task3_completed ? 'FloweringPot.png' : 'DryPot.png';
    
        const c1 = window.gameState.task1_completed ? 'completed' : '';
        const c2 = window.gameState.task2_completed ? 'completed' : '';
        const c3 = window.gameState.task3_completed ? 'completed' : '';

         this.container.innerHTML = `
        <div class="hub-wrapper">
            <img src="assets/images/porch.png" class="hub-bg" alt="Hub Room">
            
            <img id="task1-item" src="assets/images/Task_1/items/${t1}" class="hub-item task1 ${c1}" style="bottom: 15%; left: 13%;">
            <img id="task2-item" src="assets/images/Task_2/items/${t2}" class="hub-item task2 ${c2}" style="bottom: 14%; left: 30%;">
            <img id="task3-item" src="assets/images/Task_1/items/${t3}" class="hub-item task3 ${c3}" style="bottom: 15%; right: 15%;">
        </div>
        `;

        this.t1 = document.getElementById('task1-item');
        this.t2 = document.getElementById('task2-item');
        this.t3 = document.getElementById('task3-item');

        if (!window.gameState.task1_completed) this.t1.addEventListener('click', this.onTask1Click);
        if (!window.gameState.task2_completed) this.t2.addEventListener('click', this.onTask2Click);
        if (!window.gameState.task3_completed) this.t3.addEventListener('click', this.onTask3Click);

        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 50);
    }

    onTask1Click() {
        this.container.classList.add('fade-out');

        setTimeout(() => {
            this.destroy(); 
            const task1 = new Task_1(this.container);
            task1.init();
        }, 1000);
    }

    onTask2Click() {
        this.container.classList.add('fade-out');
        setTimeout(() => {
            this.destroy();
            const task2 = new Task_2(this.container);
            task2.init();
        }, 1000);
    }

    onTask3Click() {
        this.container.classList.add('fade-out');
        setTimeout(() => {
            this.destroy();
            const task3 = new Task_3(this.container);
            task3.init();
        }, 1000);
    }

    destroy() {
        if (this.t1) this.t1.removeEventListener('click', this.onTask1Click);
        if (this.t2) this.t2.removeEventListener('click', this.onTask2Click);
        if (this.t3) this.t3.removeEventListener('click', this.onTask3Click);
        
        this.container.innerHTML = '';
    }
}
