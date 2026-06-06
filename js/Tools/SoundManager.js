export default class SoundManager {
    constructor() {

        this.bgMusic = new Howl({
            src: ['assets/sounds/morning_lake_5min.wav'],
            loop: true,
            volume: 0.3, // ווליום נמוך כי זה רקע
            autoplay: false
        });

        this.sounds = {
            ropeSound: new Howl({ src: ['assets/sounds/rope.mp3'] , volume: 0.4}),
            potDrop: new Howl({ src: ['assets/sounds/putting_plants_down.wav'] , volume: 0.5}),
            stickSnap: new Howl({ src: ['assets/sounds/stickSnap.mp3'] , volume: 0.4}),
            pickTool: new Howl({ src: ['assets/sounds/pickUp.mp3'] , volume: 0.4}),
            scissors: new Howl({ src: ['assets/sounds/scissors.wav'] , volume: 0.5}),
            toolBoxSound: new Howl({ src: ['assets/sounds/inventory_open.mp3'], volume: 0.1 }),
            bugCrawl: new Howl({ src: ['assets/sounds/bugCrawl.mp3'] , volume: 0.7}),
            clickSound: new Howl({ src: ['assets/sounds/Click.mp3'] , volume: 0.3 }),
            hoverSound: new Howl({ src: ['assets/sounds/hover.mp3'], volume: 0.1 }),
            spray: new Howl({ src: ['assets/sounds/spray.mp3'] , volume: 0.7}),
            water: new Howl({ src: ['assets/sounds/water_pouring.mp3'], volume: 0.7 }),
            stageComplete: new Howl({ src: ['assets/sounds/stage_complete.mp3'], volume: 0.8 }),
            // scrollSound: new Howl({ src: ['assets/sounds/scroll.mp3'], volume: 0.4 })
        };
    }

    playBackgroundMusic() {
        if (!this.bgMusic.playing()) {
            this.bgMusic.play();
        }
    }
    
    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.play();
        } else {
            console.warn(`Could not play sound ${soundName}: not found.`);
        }
    }

    setVolume(soundName, volume) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.volume(volume);
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            // sound.fade(sound.volume(), 0, 300);
            // setTimeout(() => {
                sound.stop();
            //     sound.volume(sound._volume);
            // }, 300);
        }
    }

    playLoop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.loop(true); 
            if (!sound.playing()) {
                sound.play();
            }
        }
    }
}

export const soundManager = new SoundManager();