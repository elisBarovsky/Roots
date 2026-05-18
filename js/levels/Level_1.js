export default class Level1 {
    constructor(container) {
        this.container = container;
        this.isDown = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.buttonRevealed = false;

        // כריכת הפונקציות כדי שה-this תמיד יצביע למחלקה שלנו ולא לאירוע של ה-DOM
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
    }

    init() {
        // 1. הזרקת התוכן של השלב לקונטיינר
        this.container.innerHTML = `
            <div id="game-viewport" class="viewport">
                <div class="wide-level-content">
                    <img src="assets/images/Untitled_Artwork.png" alt="Level 1">
                </div>
                <button id="next-level-btn">המשך לשלב הבא</button>
            </div>
        `;

        // 2. תפיסת האלמנטים
        this.viewport = document.getElementById('game-viewport');
        this.nextBtn = document.getElementById('next-level-btn');

        // 3. הצמדת מאזינים
        this.viewport.addEventListener('mousedown', this.onMouseDown);
        this.viewport.addEventListener('mouseleave', this.onMouseLeave);
        this.viewport.addEventListener('mouseup', this.onMouseUp);
        this.viewport.addEventListener('mousemove', this.onMouseMove);

        this.nextBtn.addEventListener('click', this.onNextClick);
    }

    onMouseDown(e) {
        this.isDown = true;
        this.viewport.classList.add('active');
        this.startX = e.pageX - this.viewport.offsetLeft;
        this.scrollLeft = this.viewport.scrollLeft;
    }

    onMouseLeave() {
        this.isDown = false;
        this.viewport.classList.remove('active');
    }

    onMouseUp() {
        this.isDown = false;
        this.viewport.classList.remove('active');
    }

    onMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.viewport.offsetLeft;
        const walk = (x - this.startX) * 1.5; // מהירות הגרירה
        this.viewport.scrollLeft = this.scrollLeft - walk;

        this.checkEndReached();
    }

    checkEndReached() {
        if (this.buttonRevealed) return;

        const maxScrollLeft = this.viewport.scrollWidth - this.viewport.clientWidth;

        // אם הגענו לסוף (עם טווח ביטחון קטן)
        if (this.viewport.scrollLeft >= maxScrollLeft - 15) {
            this.buttonRevealed = true;
            this.nextBtn.classList.add('visible');
        }
    }

    onNextClick() {
        console.log("כפתור נלחץ! כאן אמור להיטען שלב 2.");
        // בהמשך נקרא מכאן ל-LevelManager שיעבור לשלב הבא
        // this.destroy();
    }

    destroy() {
        // פונקציה חיונית לניקוי זיכרון לפני שעוברים לשלב הבא
        this.viewport.removeEventListener('mousedown', this.onMouseDown);
        this.viewport.removeEventListener('mouseleave', this.onMouseLeave);
        this.viewport.removeEventListener('mouseup', this.onMouseUp);
        this.viewport.removeEventListener('mousemove', this.onMouseMove);
        this.nextBtn.removeEventListener('click', this.onNextClick);
        this.container.innerHTML = '';
    }
}