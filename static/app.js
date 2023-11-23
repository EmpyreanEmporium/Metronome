 const audioContext = new(window.AudioContext || window.webkitAudioContext)();

//variables
let sound; //sound creation
let isPlaying = false; // book to keep track of toggling on/off
let meter = 4; //default meter.
let i = 1; //loops
let currentButton = document.getElementById(`accButton${i}`);
let bpmSlider = document.getElementById("bpm");
bpmSlider.value = 80;

 //class
 class AccentButton {
    constructor(id, imgSrcInactive, imgSrcActive) {
        this.id = id;
        this.imgSrcInactive = "static/acc-inactive.svg";
        this.imgSrcActive = "static/acc-active.svg";
        this.isAccented = false;

        this.createButton();
    }

    //dynamically create buttons
    createButton() {
        const button = document.createElement("button");
        button.id = this.id;
        button.setAttribute("isAcc", this.isAccented);
        button.onclick = () => this.accentToggle();
        this.isAccented = false;

        const img = document.createElement("img");
        img.id = `accentIcon${this.id}`;
        img.src = this.imgSrcInactive;
        img.alt = "Inactive";

        button.appendChild(img);

        //current instance of button
        button.instance = this;

        //accButton styling
        button.classList.add("accentBtnStyle");

        document.getElementById("btn-Container").appendChild(button);
    }

    //function to toggle accent buttons
    accentToggle() {
        const img = document.getElementById(`accentIcon${this.id}`);
        this.isAccented = !this.isAccented;

        console.log("isAccented: ", this.isAccented);

        if (this.isAccented) {
            img.src = this.imgSrcActive;
        } else {
            img.src = this.imgSrcInactive;
        }
    }

    //create Osci
    createOscillator() {
        const osc = audioContext.createOscillator();
        osc.type = "square";

        if (this.isAccented) {
            osc.frequency.setValueAtTime(880, audioContext.currentTime);
        } else {
            osc.frequency.setValueAtTime(440, audioContext.currentTime);
        }

        osc.connect(audioContext.destination);

        return osc;
    }

 }

///////////////////////////////////////////////////////////////////////

//Listen for meter
const meterInput = document.getElementById("meter");
meterInput.addEventListener("input", function() {
    meter = parseInt(meterInput.value);
    if (meter > 12) {
        meter = 12;
    } else if (meter < 1) {
        meter = 1;
    }
    console.log("Meter is set to: ", meter);
    btnArray();
});

//Listen for slider
const slider = document.getElementById("bpm");
slider.addEventListener("input", function() {
    beatsPer = parseInt(slider.value);
    document.getElementById("displayBPM").textContent = beatsPer;
});

//create Accent Buttons
function btnArray() {
    const btnContainer = document.getElementById("btn-Container");

    //clear dem jawns
    btnContainer.innerHTML = '';

    //makin' copies
    for (let i = 1; i <= meter; i++) {
        new AccentButton( `accButton${i}`, "static/acc-inactive.svg", "static/acc-active.svg");
    }
}

// function to start beeps
function startBeep() {
    if (isPlaying) {
        const currentButton = document.getElementById(`accButton${i}`);

        // create Osci for the accented button
        const oscillator = currentButton.instance.createOscillator();
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.03);

        // update count
        document.getElementById("currCount").textContent = i;
        i++;

        if (i > meter) {
            i = 1;
        }

        // create next beep
            setTimeout(() => startBeep(), (60000 / beatsPer)); // milliseconds
        } else {
            if (sound) {
                sound.stop();
                sound = null;
            }
            i = 1;
    }
}

//function to toggle on/off the metronome
function toggleBeep() {
    const toggleIcon = document.getElementById("toggleIcon");
    isPlaying = !isPlaying;

    if (isPlaying) {
        startBeep(beatsPer); // start metronome with current BPM value
        toggleIcon.src = "static/btn-playing.svg";
    } else {
        if (sound) {
            sound.stop();
        }
        toggleIcon.src = "static/btn-stopped.svg";
    }
}

 function sliderBackground(){
    var minValue = parseInt(bpmSlider.min);
    var maxValue = parseInt(bpmSlider.max);
    var x = ((bpmSlider.value - minValue) / (maxValue - minValue)) * 100;
    var color = 'linear-gradient(90deg, rgba(176, 232, 185, 0.85) ' + x + '%, rgba(176, 232, 185, 0.2) ' + x + '%)';
    console.log("x: ", x);
    bpmSlider.style.background = color;
 }
 bpmSlider.addEventListener("input", sliderBackground);

window.onload = function () {
    btnArray();
    sliderBackground();
}
