export default class Task_2 {
    constructor(container) {
        this.container = container;
    }

    init() {
        // כאן תכניסי את ה-HTML והלוגיקה של המשימה הראשונה בהמשך
        this.container.innerHTML = `<h1>ברוכים הבאים למשימה 2</h1>`;
        console.log("Task 2 loaded!");
    }

    destroy() {
        // כאן ננקה את המשימה כשנסיים אותה
        this.container.innerHTML = '';
    }
}