var bg,bgImg;
var player, shooterImg, shooter_shooting
var zombieWalking
var life = 3
var FORM = 1
var PLAY = 2
var gameState = PLAY
var score = 0
var craigBossImg
var craig
var boulder
var bosslife=3

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieWalking = loadImage("assets/zombie.png")
  bgImg = loadImage("assets/bg.jpeg")
  bulletImg = loadImage("assets/bullet.png")
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
  startImg = loadImage("assets/start.png")
  winMp3 = loadSound("assets/win.mp3")
  craigBossImg = loadAnimation("assets/00.png","assets/06.png")
  
  boulderRockImg = loadImage("assets/boulder.png") 
  
}

function setup() {

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = window.innerWidth; 
    canH = window.innerHeight; 
    createCanvas(window.innerWidth+80, window.innerHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80);
  zombieGroup = new Group()
  bulletGroup = new Group()
  boulderRockGroup = new Group()
  craigGroup = new Group()
 
 bottomGround = createSprite(canW-canW,canH/2 + 300,800,20)
 topGround = createSprite(canW-canW,canH/2 -300,800,20)
 topGround.visible = false
 bottomGround.visible = false


 heart1 = createSprite(canW -100,40,20,20)
 heart2 = createSprite(canW -150,40,20,20)
 heart3 = createSprite(canW -144,40,20,20) 

 heart1.addImage(heart1Img)
 heart2.addImage(heart2Img)
 heart3.addImage(heart3Img)

 heart1.scale = 0.4
 heart2.scale = 0.4
 heart3.scale = 0.4

 heart1.visible = false
 heart2.visible = false

 start = createSprite(canW /2, canH /2)
 start.addImage(startImg)
 start.scale = 2.5

  player = createSprite(canW-canW+100, canH-300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  player.setCollider("rectangle",0,0,300,300)
  player.visible = false


}

function draw() {
  background(0); 
  image(bgImg, 0,0,width,height)

  if(gameState == FORM){
    if(mousePressedOver(start)){
     gameState = PLAY
    }
   }
  if(gameState == PLAY){
    start.visible = false
    player.visible = true
    if(player.y>bottomGround.y){
      player.y = bottomGround.y
    }
    if(player.y<topGround.y){
      player.y = topGround.y
    }

  if(life == 3){
    heart1.visible = false
    heart2.visible = false
    heart3.visible = true
  }
  if(life == 2){
    heart1.visible = false
    heart2.visible = true
    heart3.visible = false
  }
  if(life == 1){
    heart1.visible = true
    heart2.visible = false
    heart3.visible = false
  }
  if(life == 0){
    heart1.visible = false
    heart2.visible = true
    heart3.visible = true
    gameState = "lost"
  }

  if(score === 20){
    
    winState()
  }
  player.y = mouseY
  
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}



if(mouseWentDown("leftButton")){
  player.addImage(shooter_shooting)
  bullet = createSprite(player.x,player.y -30,20,10)
  bulletGroup.add(bullet)
  bullet.addImage(bulletImg)
  bullet.scale = 0.1
  bullet.velocityX = 50
  bullet.lifetime = 800
}


else if(mouseWentUp("leftButton")){
  player.addImage(shooterImg)
}
if(zombieGroup.isTouching(player)){
  for(var i=0; i < zombieGroup.length; i++){
    if(zombieGroup[i].isTouching(player)){
      zombieGroup[i].destroy()
      life-=1
    }
  }
}
zombieGroup.overlap(bulletGroup,(zombie,bullet)=>{
  zombie.destroy()
  bullet.destroy()
  score += 5
  winMp3.play()
})

craigGroup.overlap(bulletGroup,(craig,bullet)=>{
  bullet.destroy()
  bosslife-=1
  craig.scale -=0.03
  if(bosslife<=0){
    for(var i=0;i<craigGroup.length;i++){
      craigGroup[i].destroy()
      bosslife=3
      
    }
  }
})
if(boulderRockGroup.isTouching(player)){
  for(var i=0;i< boulderRockGroup.length;i++){
    if(boulderRockGroup[i].isTouching(player)){
      boulderRockGroup[i].destroy()
      life-=1;
    }
  }
}

boulderRock()
zombieBoss()
zombieGaming()
}


drawSprites();
textSize(30)
text("Pontuação: "+score, canW -240,110)
if(gameState === "lost"){
 gameOver()
}

 
}
function zombieGaming(){
  
  if(frameCount%80 === 0){
    zombie = createSprite(width,random(500,height),40,40)
    zombie.addImage("zombie",zombieWalking)
    zombie.velocityX = -(6+2*score/15)
    zombie.scale = 0.15
    zombie.lifetime = 800
    zombieGroup.add(zombie)
    
  }
}
function zombieBoss(){
  if (frameCount %400 === 0){ 
  craig = createSprite(canW,canH/2,50,50)
  craig.addAnimation("boss",craigBossImg)
  craig.velocityX=-1 
  craig.scale=0.2
  craig.lifetime=800
  craigGroup.add(craig)
  }
}
function boulderRock() {
  if (frameCount %400 === 0){
  boulder = createSprite(canW,canH/2,20,20)
  boulder.velocityX = -5
  boulder.addAnimation("pedra", boulderRockImg)
  boulder.scale = .2
  boulderRock.lifetime=800
  boulderRockGroup.add(boulder)
}}
function gameOver() {
  swal({
    title: "Game Over",
    text: "Parece que os zombies foram mais rápidos!",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
  },
  function(confirm){
    if(confirm){
      location.reload()
    }
  }
  );
}
function winState() {
 
  swal({
    title: "Game Win",
    text: "Parece que os zumbies não conseguiram te alcançar!",
    imageUrl:
      "https://images.emojiterra.com/google/android-10/512px/1f44d.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
  },
  function(confirm){
    if(confirm){
      location.reload()
    }
  }
  );
}


