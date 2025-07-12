            const correctsound = document.getElementById("correctsoundeffect");
            const wrongsound = document.getElementById("wrongsoundeffect");
            const timersound = document.getElementById("timersound");
            const sparklesound = document.getElementById("sparklesound");
            
            const words = ["ABYSS","BROKE","CRAMP","DANCE","EMPTY","FRANK","GATES","HOLDS","IGLOO","JUICE","KEEPS","LAKES","MOUSE","NIGHT","OPENS","POINT","QUEEN","ROVER","STAMP","TUNES","ULTRA","VOICE","WOKEN"]
            const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
            const beepositions=[186,211,236]

            let boxes;
            let neededletters;
            let count = 0;
            let wordcount = 0;
            let word;
            let intervalId;
            let timeLeft=30;
            let timerId;
            let movementspeed = 150;

            const currentWordEl = document.getElementById('currentWord')


            function generateWord() {
                let wordindex = Math.floor(Math.random()*23)
                word=words[wordindex];
                neededletters = words[wordindex].split('')
                document.getElementById('currentWord').textContent += words[wordindex]
            }

            function generateGrid() {
                let i=0
                const board = document.getElementById('grid')
                while (i<450) {
                i=i+1
                const square = document.createElement('div')
                board.appendChild(square)
                }
                boxes = document.querySelectorAll('#grid div')
            }

            function clearLetters(){
                boxes.forEach(box => {
                box.textContent = " ";
                box.className = '';
                });
            }

            function generateLetters() {
                clearLetters();
                for (let i=0; i<10; i++) {
                let letterindex=Math.floor(Math.random() * 26 )
                let currentletter=letters[letterindex]
                let letterposition=Math.floor(Math.random() * 450)
                boxes[letterposition].textContent = currentletter
                boxes[letterposition].classList.add('text');
                }
                for (let i=0; i<5; i++) {
                let currentletter=neededletters[i]
                let letterposition=Math.floor(Math.random() * 450)
                boxes[letterposition].textContent = currentletter
                boxes[letterposition].classList.add('text');
                console.log(currentletter)
                }
                for (let i=0; i<5; i++) {
                let currentletter=neededletters[i]
                let letterposition=Math.floor(Math.random() * 450)
                boxes[letterposition].textContent = currentletter
                boxes[letterposition].classList.add('text');
                console.log(currentletter)
                }
            }

            function moveSnake() {
                let currentword = ""
                const tail = beepositions.pop();
                let pickedletter = boxes[tail].textContent
                boxes[tail].className = '';
                boxes[tail].textContent = "";
                if (letters.includes(pickedletter) ) {
                    if (neededletters[count] === pickedletter) {
                        correctsound.play();
                        count++;
                        if (count === neededletters.length) {
                            sparklesound.play();
                            wordcount=wordcount+1;
                            count = 0;
                            setWord();
                        }
                    } else {
                        wrongsound.play();
                        alert("Wrong letter! Game Over! You collected "+wordcount+" word(s)! Click OK to retry.");
                        clearInterval(intervalId);
                        location.reload();
                    }                    
                }

                let newHead = beepositions[0];
                if (currentDirection === 'up') newHead -= 25;
                if (currentDirection === 'down') newHead += 25;
                if (currentDirection === 'left') newHead -= 1;
                if (currentDirection === 'right') newHead += 1;

                if (
                    newHead < 0 ||
                    newHead >= 450 ||
                    (currentDirection === 'left' && newHead % 25 === 24) ||
                    (currentDirection === 'right' && newHead % 25 === 0)
                ) {
                    alert("You hit a wall! Game over! You collected "+wordcount+" word(s)! Click OK to retry.");
                    wrongsound.play();
                    location.reload()
                    return;
                }

                if (beepositions.includes(newHead)) {
                    alert("You ate yourself! Game over! You collected "+wordcount+" word(s)! Click OK to retry.");
                    wrongsound.play();
                    location.reload()
                    return;
                }                

                beepositions.unshift(newHead);

                beepositions.forEach((pos, index) => {
                    boxes[pos].className = '';

                if (index === 0) {
                    if (currentDirection === "left" || currentDirection === "right") {
                        boxes[pos].classList.add('snake-horizontal-head');
                    } else {
                        boxes[pos].classList.add('snake-vertical-head');
                    }
                } else {
                    if (currentDirection === "left" || currentDirection === "right") {
                        boxes[pos].classList.add('snake-horizontal');
                    } else {
                        boxes[pos].classList.add('snake-vertical');
                    }
                }
                });

                movementspeed = 150 - (wordcount*50)
            }

            let currentDirection = "up"
            document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                currentDirection = 'up';
                break;
                case 'ArrowDown':
                currentDirection = 'down';
                break;
                case 'ArrowLeft':
                currentDirection = 'left';
                break;
                case 'ArrowRight':
                currentDirection = 'right';
                break;
                }
            });

            function setWord() {
                generateWord();
                generateLetters();
                currentWordEl.textContent = `Word: ${word} | Collected: ${wordcount}`;
                updateSpeed();
            }

            function SnakeSpeed(speed) {
                setInterval(moveSnake,speed)
            }

            function updateSpeed() {
                clearInterval(intervalId);
                setTimeout(() => {
                    let speed = Math.max(50, 150 - wordcount * 10);
                    intervalId = setInterval(moveSnake, speed);
                }, 1000);
            }            

            function startTimer() {
                timerId = setInterval(() => {
                    timeLeft--;
                    document.getElementById('timer').textContent = `Time left: ${timeLeft}`;
            
                    if (timeLeft <= 0) {
                        timersound.play();
                        clearInterval(timerId);
                        clearInterval(intervalId);
                        showEndOptions();
                    }
                }, 1000);
            }

            function showEndOptions() {
                const retry = confirm("Time's up! Retry level or move on to level 2? Press OK to move on.");
                if (retry) {
                    window.location.href = "level2.html";
                } else {
                    location.reload();
                }
            }            

            generateGrid();
            setWord();
            startTimer();