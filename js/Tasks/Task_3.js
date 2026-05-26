export default class Task_3 {
    constructor(container) {
        this.container = container;
    }

    init() {
        this.container.innerHTML = `<h1>ברוכים הבאים למשימה 3</h1>`;
        console.log("Task 3 loaded!");
    }

    destroy() {
        this.container.innerHTML = '';
    }
}