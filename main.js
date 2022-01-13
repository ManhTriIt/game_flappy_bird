const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')
let scoreShow = document.querySelector('.score')

let birdImg = new Image()
let bgImg = new Image()
let ongTren = new Image()
let ongDuoi = new Image()

birdImg.src = './img/bird.png'
bgImg.src = './img/background.png'
ongTren.src = './img/ongtren.png'
ongDuoi.src = './img/ongduoi.png'

let game = 'start'
let currentScore = 0
let bestScore = 0

// screen
const start = {
    draw: function () {
        ctx.beginPath()
        ctx.fillText(`Best Score: ${bestScore}`, 325, 150)
        ctx.fillText('Click to play', 320, 400)
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
        this.dx = -2
    }

    draw () {
        ctx.drawImage(ongTren, this.x, this.y, this.width, this.height)
        ctx.drawImage(ongDuoi, this.x, this.y + this.height + this.space, this.width, this.height)
    }
}

let arrPipes = []

for (let i = 1; i < 4; i++) {
    let pipe = new Pipes(random(530, 660) * i, random(-600, -300), 200)
    arrPipes.push(pipe)
}

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
        let pipe = new Pipes(arrPipes[arrPipes.length - 1].x + random(400, 500), random(-660, -300), random(200, 150))
        arrPipes.push(pipe)
    }
}

class Bird {
    x
    y

    constructor (x, y) {
        this.x = x
        this.y = y
    }

    draw () {
        ctx.beginPath()
        ctx.drawImage(birdImg, this.x, this.y)
    }
}

let bird = new Bird(bg.width / 5, bg.height / 2)
let birdStart = new Bird(bg.width / 2 - 30, bg.height / 2)

canvas.addEventListener('click', () => {
    switch (game) {
        case 'start':
            game = 'play'
            break
        case 'play':
            console.log('Play game')
            break
        case 'end':
            console.log('End game')
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

}

function update () {
    if (game === 'play') {
        updateArrPipe()
    }
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

// let arrPipes = [];
