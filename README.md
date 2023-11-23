# METRONOME
#### Video Demo:
#### A web based metronome with basic features.

    My project of choice was to build a simple metronome, my reasoning for picking a metronome as my final project was because
        it was a subject I felt I understood well enough to implement the logic. My inital plan to build the metronome with a tuner as
        standalone software using QT for UI, C++ as the language and the JUCE Framework for aspects of audio.  I pretty quickly
        realized that learning QT alongside JUCE whilst putting together a project wasn't a good idea for times sake.
        I looked for simpler and more familliar solutions and found it in Flask, JavaScript, HTML, Figma for rapid
        prototyping design, CSS and the Web Audio API.

    Undoubtedly what drives this whole project is the Web Audio API.  My first look at the documentation, I glazed over not really
        knowing or understanding where to start.  Once I asked myself, "what's the most basic thing I need to be able to do?"...
        I realized I just needed to get the API to make a sound for me.  After wrapping my head around the audioContext node,
        I was finally able to create a basic oscillator.  The methods within OscillatorNode made sense to me and had the same
        functionality you'd find on any musical oscillator, freq to set the frequencies type to set the wave form i.e. square as well as
        tuning and timing functions. The following snippet of code shows how straight forward the creation of an oscillator is in Web Audio, basically three or four lines of code.

        ```JavaScript
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
        ```
    The thing I struggled most with during this project was the creation of accent buttons. The creation of accent buttons had three major
        issues for me. The first, dynamically creating buttons based on user input of how many beats they wanted in a bar.  I could range
        from one beat per bar up to twelve beats per bar. The second issue I ran across was an issue of scope.  I had zero issues creating
        the amount of buttons I need it but in order to accent them, I had a global Boolean variable called isAccented, by default it was
        set to false and changing one changed them all.  This is when I decided to just make a class for button creation and included
        a method for the creation of an oscillator so I could set the higher frequency for the accented button by using the .this pointer.
        the third issue I had was a simple CSS and HTML issue that was solved by setting the positioning to absolute to match the placement
        in Figma.

    In the next code snippet is the method for button creation, I'm basically
        creating a new html element, setting the required attributes for the constructor, image set up for that
        button is attached, CSS styling and finally appended to the button(s) in the HTML button container. This snippet is for the
        creation of a single button:

        ```JavaScript

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
        ```

    Now as small function for the buttons to be created dynamically, fairly simple:

    ```JavaScript
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
    ```

    I have a straightforward toggle switch that turns the metronome on and off:

    ```JavaScript
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
    ```


    My core loop, what's going on whilst the metronome is playing is somewhat straightforward as well. I first check to see if
        the toggle has set the isPlaying variable to true, if so I create a variable called current button which is equal to the
        current accent button in the loop.  I then create an Oscillator start it, set it's duration to three milliseconds
        and set the regularity or beats per minute to the user's input.  If the isPlaying variable is set to false, the sound stops,
        is set to null and the looping variable is set back to one.

    ```JavaScript
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
    ```

    The CSS and HTML are straight forward in this project, I sued Jinja templates and Python as well, although not implemented
        in this instance of the program, my intention is to add more functionality and I'd like to do that with Flask and Jinja.
        other files are from a copy and paste from a repo outside of my codespaces, they were added to host the site on
        Google's could services.
