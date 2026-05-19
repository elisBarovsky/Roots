export default class Task_3 {
    constructor(container) {
        this.container = container;
    }

    init() {
        // כאן תכניסי את ה-HTML והלוגיקה של המשימה הראשונה בהמשך
        this.container.innerHTML = `<h1>ברוכים הבאים למשימה 3</h1>`;
        console.log("Task 3 loaded!");
    }

    destroy() {
        // כאן ננקה את המשימה כשנסיים אותה
        this.container.innerHTML = '';
    }
}