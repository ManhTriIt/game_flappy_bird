const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let birdImg = new Image()
let bgImg = new Image()
let ongTren = new Image()
let ongDuoi = new Image()
let restartButton = new Image()

birdImg.src = './img/bird.png'
bgImg.src = './img/background.png'
ongTren.src = './img/ongtren.png'
ongDuoi.src = './img/ongduoi.png'
restartButton.src = './img/restartBtn.png'

let game = 'start'
let currentScore = 0
let bestScore = 0

// screen
const start = {
    draw: function () {
        ctx.beginPath()
        ctx.fillText(`Best score: ${bestScore}`, 325, 150)
        ctx.fillText('Click to play', 320, 400)
        ctx.font = 'bold 30px courier'
    }
}

const end = {
    draw: function () {
        ctx.beginPath()
        ctx.fillText('Game Over', 370, 150)
        ctx.fillText(`Your score: ${currentScore}`, 340, 250)
        ctx.drawImage(restartButton, canvas.width / 2 - 50, 350, 100, 60)
        ctx.font = 'bold 30px courier'
    }
}

// background
const bg = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    draw: function () {
        ctx.beginPath()
        ctx.drawImage(bgImg, this.x, this.y, canvas.width, canvas.height)
    },
}

// Random
function random (min, max) {
    return Math.ceil(Math.random() * (max - min) + min)
}

class Pipes {
    constructor (x, y, space) {
        this.x = x
        this.y = y
        this.width = 82
        this.height = 650
        this.space = space
        this.dx = -5
    }

    draw () {
        ctx.drawImage(ongTren, this.x, this.y, this.width, this.height)
        ctx.drawImage(ongDuoi, this.x, this.y + this.height + this.space, this.width, this.height)
    }
}

let arrPipes = []

function newPipes () {
    for (let i = 1; i < 4; i++) {
        let pipe = new Pipes(random(530, 600) * i, random(-500, -300), 200)
        arrPipes.push(pipe)
    }
}

newPipes()

function drawArrPipe () {
    arrPipes.forEach(pipe => pipe.draw())  // Cu moi doi tuong se goi lai phuong thuc draw
}

function updateArrPipe () {
    arrPipes.forEach(pipe => {
        pipe.x += pipe.dx
    })

    // Neu vi tri x cua duong ong dau tien <= chieu rong cua no thi xoa va them ong moi
    if (arrPipes[0].x <= -82) {
        arrPipes.splice(0, 1)
        let pipe = new Pipes(arrPipes[arrPipes.length - 1].x + random(400, 500), random(-600, -350), random(200, 150))
        arrPipes.push(pipe)
    }
}

class Bird {
    constructor (x, y) {
        this.width = 38
        this.height = 26
        this.x = x
        this.y = y
        this.v = 0
        this.a = 0.2
    }

    draw () {
        ctx.beginPath()
        ctx.drawImage(birdImg, this.x, this.y)
    }

    update () {
        if (game === 'play' || game === 'end') {
            this.v += this.a
            this.y = this.y + this.v

            // Kiem tra va cham voi nen dat
            if (this.y + this.width + this.v >= 466) {
                game = 'end'
                this.v = 0
                this.y = 466
            }

            // Kiem tra va cham voi ong
            if (bird.x + bird.width > arrPipes[0].x &&
                bird.x < arrPipes[0].x + arrPipes[0].width &&
                (
                    bird.y < arrPipes[0].y + arrPipes[0].height ||
                    bird.y + bird.height > arrPipes[0].y + arrPipes[0].height + arrPipes[0].space
                )
            ) {
                game = 'end'
            }

            // Truong hop an diem
            if (bird.x === arrPipes[0].x + arrPipes[0].width) {
                currentScore++
                bestScore = Math.max(currentScore, bestScore)
            }
        }
    }
}

let bird = new Bird(bg.width / 5, bg.height / 2)
let birdStart = new Bird(bg.width / 2 - 30, bg.height / 2)

canvas.addEventListener('click', function (event) {
    switch (game) {
        case 'start':
            game = 'play'
            break
        case 'play':
            console.log('Play game')
            bird.v = -5
            break
        case 'end':
            console.log('End game')
            if (
                event.offsetX > canvas.width / 2 - 50 &&
                event.offsetX < canvas.width / 2 + 50 &&
                event.offsetY > 350 &&
                event.offsetY < 410
            ) {
                currentScore = 0
                arrPipes = []
                newPipes()
                bird.v = 0
                bird.y = bg.height / 2
                game = 'start'
            }
            break
    }
})

function draw () {
    bg.draw()
    if (game === 'start') {
        birdStart.draw()
        start.draw()
    } else {
        bird.draw()
        drawArrPipe()
    }

    if (game === 'end') {
        end.draw()
    }
}

function update () {
    if (game === 'play') {
        updateArrPipe()
    }
    bird.update()
}

function animate () {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw()
    update()
    document.getElementById('bestScore').innerHTML = `Best: ${bestScore}`
    document.getElementById('currentScore').innerHTML = `Current: ${currentScore}`
}

animate()


