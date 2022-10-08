


const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ["#F38181", "#FCE38A", "#95E1D3", "#FF5959", "#FACF5A", "#49BEB7", "#085F63"];

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};


function Player(playerPo, radius, color) {
  this.x = playerPo.x;
  this.y = playerPo.y;
  this.radius = radius;
  this.color = color

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = color;
    c.fill()
  };

  this.update = () => {
    this.draw();
  };
}

let player = new Player(
  { x: canvas.width / 2, y: canvas.height / 2 },
  innerWidth * .025,
  colors[Math.floor(Math.random() * colors.length)]
)

console.log(player)
function Fiers(x, y, radius, color, velactiy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.velactiy = velactiy;
  this.color = color
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill()
  };

  this.update = () => {
    this.draw();
    this.x += this.velactiy.x * 5;
    this.y += this.velactiy.y * 5
  };
}

function Enemy(x, y, radius, velactiy, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.velactiy = velactiy;
  this.color = color
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill()
  };

  this.update = () => {
    this.draw();
    this.x += this.velactiy.x;
    this.y += this.velactiy.y
  };
}

let fires = []
let enemies = []



// spawn enmies
let spawnEnmies = setInterval(function () {
  let radius = Math.floor(Math.random() * (20 - 10 + 1)) + 10
  let x
  let y
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
    y = Math.random() * canvas.height
  } else {
    x = Math.random() * canvas.width
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
  }
  let color = colors[Math.floor(Math.random() * colors.length)]
  let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
  let velactiy = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }
  enemies.push(new Enemy(x, y, radius, velactiy, color))

}, 2000)



addEventListener('click', (e) => {
  // let radius = Math.floor(Math.random() * (10 - 5 + 1)) + 5 
  let radius = 10
  let angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2)
  let y = Math.sin(angle)
  let x = Math.cos(angle)
  let color = colors[Math.floor(Math.random() * colors.length)]
  fires.push(new Fiers(
    canvas.width / 2,
    canvas.height / 2,
    radius,
    color,
    {
      x,
      y
    },
  ))
})
let score ;
// // Animation Loop
function animate() {
 let animation =  requestAnimationFrame(animate);
  c.fillStyle = ("rgba(0,0,0,0.4)")
  c.fillRect(0, 0, innerWidth, innerHeight);

  player.update()
  fires.forEach(fire => {
    fire.update()
  })
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()
    let dis = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (dis - enemy.radius - player.radius < 1) {
      TelegramGameProxy.shareScore()
      cancelAnimationFrame(animation)

    }

    fires.forEach((fire, fireIndex) => {
      let dis = Math.hypot(fire.x - enemy.x, fire.y - enemy.y)
      if (dis - enemy.radius - fire.radius < 1) {
        score++
        setTimeout(function () {
          enemies.splice(enemyIndex, 1)
          fires.splice(fireIndex, 1)
        }, 0)
      }
    })
  })
}

animate();
