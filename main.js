

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;





addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // init();
});




// Objects
// function Ball(x, y, radius,velactiy) {
//   this.x = x;
//   this.y = y;
//   this.radius = radius;
//   this.velactiy = velactiy;

//   this.draw = function() {
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c.fillStyle ="white"
//     c.stroke();
//     c.fill()
//   };

//   this.update = () => {
//     this.x += this.velactiy.x
//     this.y += this.velactiy.y
//     if(this.x + this.radius < 0||this.x + radius > canvas.width||this.y - radius> canvas.height){
//         this.x = Math.random() * canvas.width
//         this.y = 0 - this.radius
//     }
//     this.x += this.velactiy.x 
//     this.y += this.velactiy.y
//     this.draw();
//   };
// }

// // Implementation
// let balls;
// function init() {
  //   balls = [];
  
  //   for (let i = 0; i < 30; i++) {
//     let x = Math.random() * canvas.width
//     let radius = Math.floor(Math.random() * 4)
//     let y =0 - radius

//     let velactiy = {
  //         x:Math.random()  ,
  //         y:Math.random() *2 + 0.5
//     }
//     balls.push(new Ball(x, y, radius , velactiy));
//   }
// }

// // Animation Loop
// function animate() {
//   requestAnimationFrame(animate);
//   c.fillStyle=("rgb(0,0,0,0.9)")
//   c.fillRect(0, 0, innerWidth, innerHeight);
//   balls.forEach((ball) => {
//     ball.update();
//   });


// }

// init();
// animate();


// firebase setup
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBVLslwWAHcU3lrRgN6QGUuC6nnY0Uw_4k",
  authDomain: "mob-game-b336b.firebaseapp.com",
  databaseURL: "https://mob-game-b336b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mob-game-b336b",
  storageBucket: "mob-game-b336b.appspot.com",
  messagingSenderId: "125126322474",
  appId: "1:125126322474:web:1b65694d66fa93c98e1653"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();





let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};


window.addEventListener('click',function(e){
  mouse.x=e.clientX;
  mouse.y=e.clientY;
})


// Objects
function Player(playerPo, radius,color, id) {
  this.x = playerPo.x;
  this.y = playerPo.y;
  this.radius = radius;
  this.color = color
  this.id = id

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle =color;
    c.fill()
  };

  this.update = () => {
    this.draw();
  };
}
function Fiers(x, y, radius,velactiy,id,color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.velactiy = velactiy;
  this.id = id
  this.color = color

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle =this.color;
    c.fill()
  };

  this.update = () => {
    this.draw();
    this.x += this.velactiy.x * 5;
    this.y += this.velactiy.y * 5
  };
}

function Enemy(x, y, radius,velactiy,id,color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.velactiy = velactiy;
  this.id = id
  this.color = color
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle =this.color;
    c.fill()
  };

  this.update = () => {
    this.draw();
    this.x += this.velactiy.x ;
    this.y += this.velactiy.y 
  };
}

const colors = ["#F38181", "#FCE38A", "#95E1D3", "#FF5959","#FACF5A","#49BEB7","#085F63"];

let playerId;
let playerRef;
let allPlayersRef;
let players= [];
let fiersRef;
let firesArr = [];
let enemyRef;
let enmeies = [];
let playerColor;

  function int(){
    allPlayersRef = firebase.database().ref(`players`);
    fiersRef = firebase.database().ref(`fires`)
    enemyRef = firebase.database().ref(`enemy`)

    // fires
    fiersRef.on('child_added', (snapshot) => {
    let fire=snapshot.val()
    let fireId =snapshot.key
    firesArr.push(new Fiers(fire.x , fire.y , fire.radius , fire.velactiy , fireId, fire.color ))
    })

    // enemies
    enemyRef.on('child_added', (snapshot) => {
      let enemy=snapshot.val()
      let enemyId =snapshot.key
      enmeies.push(new Enemy(enemy.x , enemy.y , enemy.radius , enemy.velactiy , enemyId, enemy.color ))
      })

    allPlayersRef.on('value', (snapshot) => {
    })

    allPlayersRef.on('child_added', (snapshot) => {
      // fires whenever new player added
      const addedPlayer = snapshot.val()
      let playerId = snapshot.key

      players.push(new Player(addedPlayer.playerPo , addedPlayer.radius ,  addedPlayer.color , playerId))
      // console.log(players)
    })

    // whenever the player is disconnect and removed from the firebase
    allPlayersRef.on("child_removed",(snapshot) => {
      // child id in the firebase
      let removedChild = snapshot.key;
      // remove the child from the canvas
      players.forEach((player,index) => {
        if(player.id === removedChild){
          players.splice(index,1)
          console.log(players)
        }
      })
    })
  }

  firebase.auth().onAuthStateChanged((user)=> {
    if(user){
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`)
      playerColor = colors[Math.floor(Math.random()*colors.length)]
      playerRef.set({
        playerPo: {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        radius:15,
        color:playerColor,
      })

      playerRef.onDisconnect().remove()
      
      var connectedRef = firebase.database().ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          console.log("connected");
        } else {
          console.log("not connected");
          // firebase.database().ref(`fires`).child().remove()
        }
      });
      
      int()
    }else{
    }
  })
  firebase.auth().signInAnonymously().catch((error)=>{
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode,errorMessage)
  })


// push players fires to firebase 
addEventListener('click',function(){

  let angle = Math.atan2(mouse.y-canvas.height/2,mouse.x-canvas.width/2) 
  let xV =Math.cos(angle);
  let yV =Math.sin(angle);
  let fireColor =  playerColor

  fiersRef.push({ x:canvas.width/2 , y:canvas.height/2 ,radius: 10 , velactiy:{x:xV,y:yV} ,id:playerId,color:fireColor})

})


// spawn enmies
setInterval(function(){ 
  let xP;
  let yP;
  let enmeyRadius = Math.floor(Math.random() * ( 20 - 5) + 5)
  let color =colors[Math.floor(Math.random() * colors.length)]

  if(Math.random() < 0.5 ){
    xP = Math.random() < 0.5 ? 0 - enmeyRadius:canvas.width +enmeyRadius
    yP = Math.random() * canvas.height
  }else{
    xP= Math.random() * canvas.width
    yP = Math.random() < 0.5 ? 0 - enmeyRadius:canvas.height +enmeyRadius
  }

  let angle = Math.atan2(canvas.height/2 - yP,canvas.width/2 - xP) 
  let xV =Math.cos(angle);
  let yV =Math.sin(angle);

   enemyRef.push({ x:xP , y:yP ,radius: enmeyRadius , velactiy:{x:xV,y:yV},color})
},5000)

// // Animation Loop
function animate() {

  requestAnimationFrame(animate);
  c.fillStyle=("rgba(0,0,0,0.4)")
  c.fillRect(0, 0, innerWidth, innerHeight);

  players.forEach(player => {
    player.update()
  })

  firesArr.forEach((fires,index) => {
    fires.update()

    if(fires.x - fires.radius > canvas.width ||
      fires.x + fires.radius < 0 ||
      fires.y - fires.radius > canvas.height ||
      fires.y + fires.radius < 0) {
       setTimeout(function(){
        firesArr.splice(index , 1)
       },0)
        let id = firebase.database().ref(`fires/${fires.id}`)
        id.remove()
      }
  })
  
  enmeies.forEach((enmey,eindex) => {
    enmey.update()

    let eid = firebase.database().ref(`enemy/${enmey.id}`)

    firesArr.forEach((fire,ind) => {
      let fid = firebase.database().ref(`fires/${fire.id}`)
      const dis = Math.hypot(fire.x-enmey.x,fire.y-enmey.y)
      
      if(dis-enmey.radius - fire.radius < 1 ){
       setTimeout(function(){
        firesArr.splice(ind,1)
        enmeies.splice(eindex,1)
       },0)
        eid.remove()
        fid.remove()
        console.log(dis)
      }
    })
  })
}

// init();
animate();
