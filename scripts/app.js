document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const newGameButton = document.querySelector('#new-game-button')
    let scoreTable = document.querySelector('.score ol')
    const preloader = document.querySelector('.preloader')
    const width = 10
    let nextRandom = 0
    let score = 0
    const colors = [
        '#de1b1b',
        '#646f6f',
        '#51cbc5',
        '#87aab9',
        '#fbf445'
    ]

    // Hide the preloader with instr
    setTimeout(() => preloader.style.display = 'none', 4000)

    // Start new game
    newGameButton.addEventListener('click', newGame)
    function newGame() {
        startButton.style.display = 'block'
        newGameButton.style.display = 'none'
        score = 0;
        ScoreDisplay.innerText = score
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }

    // Make the tetromino move down
    // var timerId = setInterval(moveDown, 500)
    var timerId;

    //  Change button "Start / Pause"
    startButton.addEventListener('click', el => {
        if (el.target.innerText == "Pause") {
            startButton.innerText = "Start"
            clearInterval(timerId)
            startButton.classList.remove('pause')
        }
        else {
            startButton.innerText = "Pause"
            timerId = setInterval(moveDown, 400)
            displayShape()
            startButton.classList.add('pause')

        }

    })

    //  The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 3
    let currentRotation = 0

    // Randomly select
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //  Draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Assign functions to keyCodes
    function control(e) {
        if (startButton.innerText == "Pause") {
            if (e.keyCode === 37) moveLeft()
            if (e.keyCode === 38) rotate()
            if (e.keyCode === 39) moveRight()
        }
    }

    document.addEventListener('keydown', control)
    document.addEventListener('keyup', changeSpeed)

    // Move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // Change speed of game
    let toggleSpeed = false
    function changeSpeed(e) {
        if (startButton.innerText == "Pause")
            if (e.keyCode === 40)
                if (toggleSpeed) {
                    clearInterval(timerId)
                    timerId = setInterval(moveDown, 500)
                    toggleSpeed = !toggleSpeed
                } else {
                    clearInterval(timerId)
                    timerId = setInterval(moveDown, 100)
                    toggleSpeed = !toggleSpeed
                }
    }

    // Freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // Start a new tetromino fall
            random = nextRandom
            nextRand()
            current = theTetrominoes[random][currentRotation]
            currentPosition = 3
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function nextRand() {
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    }

    // Move the tetromino
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition--
        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition++
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index).toString().slice(-1) === '9')
        if (!isAtRightEdge) currentPosition++
        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition--
        draw()
    }

    function rotate() {
        undraw()
        currentRotation = ++currentRotation == 4 ? 0 : currentRotation
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // Show up-next tetromino in mini-grid
    const displaySquares = Array.from(document.querySelectorAll(".mini-grid div"))
    const displayWidth = 4
    const displayIndex = 1

    // The tetrominos wihout rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    // Display the shape in the mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    nextRand()

    // Add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                ScoreDisplay.innerText = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerText = 'Game over ' + score;
            clearInterval(timerId)
            startButton.innerText = 'New game'
            startButton.classList.toggle('pause')

            startButton.style.display = 'none'
            newGameButton.style.display = 'block'

            let li = document.createElement('li');
            li.innerText = score
            scoreTable.insertBefore(li, scoreTable.children[0])
        }
    }
})


