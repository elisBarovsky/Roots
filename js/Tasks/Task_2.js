export default class Task_2 {
    constructor(container) {
        this.container = container;
    }

    init() {
        this.container.innerHTML = `<h1>ברוכים הבאים למשימה 2</h1>`;
        console.log("Task 2 loaded!");
    }

    destroy() {
        this.container.innerHTML = '';
    }
}