//canvas设定
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let spaceImage,spaceshipImage,enemyImage,gameoverImage,bulletImage;
let gameOver=false
let score=0

//spaceship坐标
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

let bulletlist = [];
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        this.alive=true;
        bulletlist.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit=function(){

        for(let i=0; i < enemyList.length;i++){
            if(
                this.y <= enemyList[i].y &&
                this.x >= enemyList[i].x &&
                this.x <= enemyList[i].x + 60
            ) {
            score++;
            this.alive=false;
            enemyList.splice(i,1);
            }

        }
    };
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList=[];
function Enemy() {
    this.x=0;
    this.y=0;
    this.init =function () {
        this.y=0;
        this.x=generateRandomValue(0, canvas.width - 60);
        enemyList.push(this);
    };
    this.update = function() {
        this.y += 5;

        if (this.y >= canvas.height - 60) {
            gameOver = true;
        }
    };
}


function loadImage(){
    spaceImage = new Image();
    spaceImage.src="images/space.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";

    enemyImage = new Image();
    enemyImage.src="images/enemy.png";
    
    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    gameoverImage = new Image();
    gameoverImage.src="images/gameover.jpg";
}


let keysdown = {}
function setupkeyboardlistener(){
    document.addEventListener("keydown",function(event){
        keysdown[event.keyCode] = true;
    });
    document.addEventListener("keyup",function(event){
        delete keysdown[event.keyCode];

        if(event.keyCode == 32){
            createBullet();
        }
    });
}

function createBullet(){
    let b = new Bullet();
    b.init();
}

function createEnemy(){
    const interval = setInterval(function () {
        let e = new Enemy();
        e.init();
    },1000);
}


function update() {
    if( 39 in keysdown) {
        spaceshipX += 5;
    }//right
    if( 37 in keysdown) {
        spaceshipX -= 5;
    }//left

    if (spaceshipX <= 0){
        spaceshipX = 0;
    }
    if (spaceshipX >=canvas.width-64){
        spaceshipX = canvas.width-64;
    }



    for(let i = 0; i < bulletlist.length; i++) {
        if(bulletlist[i].alive){
        bulletlist[i].update();
        bulletlist[i].checkHit();
        }
    }

    for(let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
    
}



function render(){
    ctx.drawImage(spaceImage,0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
    ctx.fillText(`Score:${score}`, 20, 100);
    ctx.fillStyle="white";
    ctx.font = "20px Arial";
    for(let i = 0; i < bulletlist.length; i++){
        if (bulletlist[i].alive) {
        ctx.drawImage(bulletImage,bulletlist[i].x,bulletlist[i].y);
        }
    }

    for(let i = 0; i < enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
    if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage,10,100,380,380);
    }
}

loadImage();
setupkeyboardlistener();
createEnemy();
main();

