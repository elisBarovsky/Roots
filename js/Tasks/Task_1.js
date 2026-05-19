
export default class Task_1 {
    constructor(container) {
        this.container = container;
    }

    init() {
        // כאן תכניסי את ה-HTML והלוגיקה של המשימה הראשונה בהמשך
        this.container.innerHTML = `<h1>ברוכים הבאים למשימה 1</h1>`;
        console.log("Task 1 loaded!");
    }

    destroy() {
        // כאן ננקה את המשימה כשנסיים אותה
        this.container.innerHTML = '';
    }
}