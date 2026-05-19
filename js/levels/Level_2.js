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
        this.container.innerHTML = `
            <div class="hub-wrapper">
                <img src="assets/images/porch.png" class="hub-bg" alt="Hub Room">

                <div id="hotspot-1" class="hotspot" title="משימה 1"></div>
                <div id="hotspot-2" class="hotspot" title="משימה 2"></div>
                <div id="hotspot-3" class="hotspot" title="משימה 3"></div>
            </div>
        `;

        this.hotspot1 = document.getElementById('hotspot-1');
        this.hotspot2 = document.getElementById('hotspot-2');
        this.hotspot3 = document.getElementById('hotspot-3');

        this.hotspot1.addEventListener('click', this.onTask1Click);
        this.hotspot2.addEventListener('click', this.onTask2Click);
        this.hotspot3.addEventListener('click', this.onTask3Click);
    }

    onTask1Click() {
        this.destroy();
        const task1 = new Task_1(this.container);
        task1.init();
    }

    onTask2Click() {
        this.destroy();
        const task2 = new Task_2(this.container);
        task2.init();
    }

    onTask3Click() {
        this.destroy();
        const task3 = new Task_3(this.container);
        task3.init();
    }

    destroy() {
        this.hotspot1.removeEventListener('click', this.onTask1Click);
        this.hotspot2.removeEventListener('click', this.onTask2Click);
        this.hotspot3.removeEventListener('click', this.onTask3Click);
        this.container.innerHTML = '';
    }
}