export default class SoundManager {
    constructor() {
        this.sounds = {
            //inventoryClose.mp3: new Audio('assets/sounds/inventory_close.mp3'),
            ropeSound: new Audio('assets/sounds/rope.mp3'),
            potDrop: new Audio('assets/sounds/putting_plants_down.wav'),
            stickSnap: new Audio('assets/sounds/stickSnap.mp3'),
            pickTool: new Audio('assets/sounds/pickUp.mp3'),
            scissors: new Audio('assets/sounds/scissors.wav'),
            toolBoxSound: new Audio('assets/sounds/inventory_open.mp3'),
            bugCrawl: new Audio('assets/sounds/bugCrawl.mp3'),
            clickSound: new Audio('assets/sounds/Click.mp3'),
            hoverSound: new Audio('assets/sounds/hover.mp3'),
            spray: new Audio('assets/sounds/spray.mp3'),
            water: new Audio('assets/sounds/water_pouring.mp3'),
        };

        this.sounds.water.volume = 0.5; 
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; 
            
            sound.play().catch(error => {
                console.warn(`Could not play sound ${soundName}:`, error);
            });
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
            sound.loop = false;
        }
    }

    playLoop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.loop = true; 
            sound.currentTime = 0; 
            sound.play().catch(error => {
                //console.warn(`Could not play loop sound ${soundName}:`, error);
            });
        }
    }
}

export const soundManager = new SoundManager();