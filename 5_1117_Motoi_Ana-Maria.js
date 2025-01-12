

class Asteroid{
x
y
value
dx
dy
radius
color
constructor(x,y){
    this.x = x;
    this.y = y;
    this.value = Math.floor(Math.random()*4+1);
    this.radius = this.getSize();
    this.color = this.getColor();
    this.dx = Math.random() * 4 - 2;
    this.dy = Math.random() * 4 - 2;

}

//function to get the color of the asteroid based on the value between 1 and 4
getColor(){
    if(this.value == 1){
        return 'blue';
    }else if(this.value == 2){
        return 'green';
    }else if(this.value == 3){
        return 'yellow';
    }else if(this.value == 4){
        return 'red';
    }else return null;
}

//function to get the size of the asteroid based on the value between 1 and 4
getSize(){
    if(this.value == 1){
        return 10;
    }else if(this.value == 2){
        return 20;
    }else if(this.value == 3){
        return 30;
    }else if(this.value == 4){
        return 40;
    }else return null;
}

draw(context){
    context.beginPath();
    context.strokeStyle = this.getColor();
    context.arc(this.x, this.y, this.radius, 0, Math.PI *2, false);
    context.stroke();
    context.closePath();

    context.font = `${this.radius/2 +3}px Arial`;
    context.fillStyle = "white";
    context.lineWidth = 3;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.value, this.x, this.y);
}

}

class Ship{
    x
    y
    base
    height
    constructor(x, y, base, height){
        this.x = x;
        this.y=y;
        this.base = base;
        this.height = height;
    }

}

class Rocket{
    x
    y
    dx
    dy
    radius
    angle
    speed
    constructor(x, y, angle){
        this.x =x;
        this.y=y;
        this.speed = 5;
        this.dx = this.speed * Math.sin(angle * Math.PI/180);
        this.dy = -this.speed * Math.cos(angle* Math.PI/180);
        this.radius = 4;
    }

    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = "white";
        context.fill();
        context.closePath();
    }
}


class Game{
    #canvas;
    #context

    //asteroid settings
    #asteroids = [];

    //ship settings
    #ship;
    shipBase = 30;
    shipHeight = 50;
    shipSpeed = 2;
    shipAngle = 0; 
    rotationSpeed = 2; 

    //rocket settings
    #rockets = [];
    launchRocket= false;

    //keyboard settings
    rightKeyPressed = false;
    leftKeyPressed = false;
    upKeyPressed = false;
    downKeyPressed = false;
    launchRocketKeyPressed = false;
    rotateRightKeyPressed = false;
    rotateLeftKeyPressed = false;

    //game data
    score = 0;
    lives = 3;
    restoreLivesScore = 200;

    constructor(){
        this.#canvas = document.getElementById('GameCanvas');
        this.#context = this.#canvas.getContext('2d');
        
        this.resize();

        //asteroid settings
        this.generateAsteroids();

        //ship settings
        this.#ship = new Ship(this.#canvas.width/2, this.#canvas.height/2, this.shipBase, this.shipHeight);

        //container for scores
        const highScores = document.createElement('ul');
        highScores.id = 'highScores';
        document.getElementById('startScreen').appendChild(highScores);
        //display scores on start screen
        this.displayHighScores();

        //events
        this.#canvas.addEventListener('touchmove', (e) => this.touchMove(e), { passive: true });
        document.addEventListener('keydown', (e)=> this.keyDownHandler(e), false);
        document.addEventListener('keyup', (e)=> this.keyUpHadler(e), false);
        this.draw();
    }

    touchmove(e){
        const relativeX = e.touches[0].clientX;
        const relativeY = e.touches[0].clientY;
        //moving the ship
        if(relativeX > 0 && relativeX <this.#canvas.width){
        this.#ship.x = relativeX;
        }
        if(relativeY > 0 && relativeY < this.#canvas.height){
        this.#ship.y = relativeY;
        }
    }

    keyDownHandler(e){
        if(e.keyCode == 39){
            this.rightKeyPressed = true;
        }else if(e.keyCode == 37){
            this.leftKeyPressed = true;
        }else if(e.keyCode == 38){
            this.downKeyPressed = true;
        }else if(e.keyCode == 40){
            this.upKeyPressed = true;
        }else if(e.key == "x"){
            this.launchRocketKeyPressed = true;
        }else if(e.key == "c"){
            this.rotateRightKeyPressed = true;
        }else if(e.key == "z"){
            this.rotateLeftKeyPressed = true;
        }
    }

    keyUpHadler(e){
        if(e.keyCode == 39){
            this.rightKeyPressed = false;
        }else if(e.keyCode == 37){
            this.leftKeyPressed = false;
        }else if(e.keyCode == 38){
            this.downKeyPressed = false;
        }else if(e.keyCode == 40){
            this.upKeyPressed = false;
        }else if(e.key == "x"){
            this.launchRocketKeyPressed = false;
        }else if(e.key == "c"){
            this.rotateRightKeyPressed = false;
        }else if(e.key == "z"){
            this.rotateLeftKeyPressed = false;
        }
    }

    resize(){
        const width = this.#canvas.clientWidth;
        const height = this.#canvas.clientHeight;
        if (this.#canvas.width != width ||
            this.#canvas.height != height) {
            this.#canvas.width = width;
            this.#canvas.height = height;
        }
    }

    generateAsteroids(){
        for(let i=0; i<6; i++){
            this.#asteroids[i] = new Asteroid(Math.random() * this.#canvas.width, Math.random()* this.#canvas.height);
        }
    }

    drawAsteroids(){
        for(let i =this.#asteroids.length-1; i>=0; i--){
            const a = this.#asteroids[i];
            this.#context.beginPath();
            this.#context.strokeStyle = a.getColor();
            this.#context.arc(a.x, a.y, a.radius, 0, Math.PI *2, false);
            this.#context.stroke();
            this.#context.closePath();
 
            //attach the amount of rockets necessary to destroy it
            this.#context.font = `${a.radius/2 +3}px Arial`;
            this.#context.fillStyle = "white";
            this.#context.lineWidth = 3;
            this.#context.textAlign = "center";
            this.#context.textBaseline = "middle";
            this.#context.fillText(a.value, a.x, a.y);

            //update the position of the asteroid
            a.x += a.dx;
            a.y += a.dy;

            //bouncing off the left and right
            if(a.x + a.dx > this.#canvas.width - a.radius || a.x + a.dx < a.radius){
                a.dx = -a.dx;
            }
    
            //bouncing off the top
            if(a.y + a.dy < a.radius){
                a.dy = -a.dy;
            }
    
            //bouncing off the bottom
            if (a.y + a.dy > this.#canvas.height - a.radius) {
                a.dy = -a.dy;
            }

        }
    }


    drawShip(){
        this.#context.save();
        this.#context.translate(this.#ship.x, this.#ship.y); //moves the context to the center of the shape
        this.#context.rotate(this.shipAngle * Math.PI /180); //rotates by the amount converted in radians
        this.#context.beginPath();
        this.#context.moveTo(0, -this.#ship.height / 2);  
        this.#context.lineTo(this.#ship.base / 2, this.#ship.height / 2); 
        this.#context.lineTo(-this.#ship.base / 2, this.#ship.height / 2);
        this.#context.closePath();
        this.#context.strokeStyle = "white";
        this.#context.stroke();
        this.#context.restore(); //reset the context
    }

    

    drawLives(){
        this.#context.font = '25px AsteroidsGameTitle';
        this.#context.fillStyle = "white";
        this.#context.fillText('Lives: ' + this.lives, 75, 30);
    }

    drawScore(){
        this.#context.font = '30px AsteroidsGameTitle';
        this.#context.fillStyle = "white";
        this.#context.fillText('Score: ' + this.score, this.#canvas.width/2, 30);
    }

    draw(){
        this.#context.clearRect(0,0,this.#canvas.width, this.#canvas.height);
        this.drawAsteroids();
        this.drawShip();
        this.drawLives();
        this.drawScore();
        

        //detect collisions
        this.collisionDetection();

        //the angle must be between 0 and 360
        if(this.shipAngle<=0){
            this.shipAngle += 360;
        }
        this.shipAngle %= 360; 

        if(this.rightKeyPressed){
            this.#ship.x += this.shipSpeed;
        }else if(this.leftKeyPressed){
            this.#ship.x -= this.shipSpeed;
        }else if(this.upKeyPressed){
            this.#ship.y += this.shipSpeed;
        }else if(this.downKeyPressed){
            this.#ship.y -= this.shipSpeed;
        }else if(this.rotateRightKeyPressed){
            this.shipAngle += this.rotationSpeed;
        }else if(this.rotateLeftKeyPressed){
            this.shipAngle -= this.rotationSpeed;
        }else if(this.launchRocketKeyPressed && !this.launchRocket){
            if(this.#rockets.length<3){
                this.launchRocket = true;
                const rocketX = this.#ship.x + Math.sin(this.shipAngle * Math.PI / 180) * (this.#ship.height / 2);
                const rocketY = this.#ship.y - Math.cos(this.shipAngle * Math.PI / 180) * (this.#ship.height / 2);
                this.#rockets.push(new Rocket(rocketX, rocketY, this.shipAngle));
            }else{
                this.launchRocket =false;
            }
            }else if(!this.launchRocketKeyPressed){
                this.launchRocket =false;
            }
    
        //draw and move the rockets
        for(let i=this.#rockets.length-1 ; i>=0; i--){
            const rocket = this.#rockets[i];
            rocket.draw(this.#context);
    
            rocket.x +=  rocket.dx;
            rocket.y += rocket.dy;
            //remove the rockets that are out of the canvas
            if (rocket.x < 0 || rocket.x > this.#canvas.width || rocket.y < 0 || rocket.y > this.#canvas.height){
                this.#rockets.splice(i, 1);
            }
        }            

        //keeping the ship within the canvas
        this.#ship.x = Math.max(0, Math.min(this.#canvas.width, this.#ship.x));
        this.#ship.y = Math.max(0, Math.min(this.#canvas.height, this.#ship.y));

        //if there are no more asteroids, generate more 
        if(this.#asteroids.length == 0){
            this.generateAsteroids();
            this.drawAsteroids();
        }

        requestAnimationFrame(()=>this.draw());
    }

    collisionDetection(){
        //collision between an asteroid and the ship
        for(let i=0; i<this.#asteroids.length; i++){
            const a = this.#asteroids[i];

            //coordinates of the ship transformed in rectangle
            const shipLeft = this.#ship.x - this.#ship.base / 2;
            const shipRight = this.#ship.x + this.#ship.base / 2;
            const shipTop = this.#ship.y - this.#ship.height / 2;
            const shipBottom = this.#ship.y + this.#ship.height / 2;

            //a.x and a.y are the coordinates of the center of the asteroid so the radius is added/subtracted to get the top, bottom, lef and right points
            //otherwise the collision will only be detected if the ship reached the center of the asteroid
            if(a.x + a.radius > shipLeft && a.x - a.radius < shipRight &&
                a.y + a.radius > shipTop && a.y - a.radius < shipBottom){
                this.lives--;
                //if there are no more lives end the game session and save the score
                if(this.lives == 0){
                    const playerName = document.getElementById("playerName").value.trim();
                    if (playerName) {
                        this.saveScore(playerName, this.score);
                    }else{
                        alert("Please enter your name to start the game.");
                    }
                    alert('GAME OVER!');
                    //display the start screen and hide the canvas
                    document.getElementById('startScreen').style.display = 'flex'; 
                    document.getElementById('GameCanvas').style.display = 'none'; 
                    //restore the initial settings of the game
                    this.lives = 3; 
                    this.score = 0; 
                    this.#ship.x = this.#canvas.width / 2; 
                    this.#ship.y = this.#canvas.height / 2; 
                    this.generateAsteroids(); 
                }else{
                    //reset ship position 
                    this.#ship.x = this.#canvas.width / 2;
                    this.#ship.y = this.#canvas.height / 2;
                    this.shipAngle = 0;

                    //reset asteroid position (random)
                    a.x = Math.random() * this.#canvas.width;
                    a.y = Math.random() * this.#canvas.height;
                    
                }

            }
        }

        //collision between two asteroids
        for(let i=0; i<this.#asteroids.length; i++){
            const a1= this.#asteroids[i];
            for(let j = i+1; j<this.#asteroids.length; j++){
                const a2= this.#asteroids[j];
                
                //distance between the centers of the asteroids
                const distanceX = a2.x - a1.x;
                const distanceY = a2.y - a1.y;
                const distance =Math.sqrt(distanceX*distanceX + distanceY*distanceY);
                
                //check if they collide and inverse the trajectory
                if(distance<= a1.radius+a2.radius){
                    a1.dx = -a1.dx;
                    a1.dy = -a1.dy;
                    a2.dx = -a2.dx;
                    a2.dy = -a2.dy;
                }
            }
        }

        //collision between a rocket and an asteroid
        for (let i = this.#rockets.length-1; i >=0;  i--) {
            const rocket = this.#rockets[i];
            for (let j = this.#asteroids.length -1; j >= 0; j--) {
                const a = this.#asteroids[j];
    
                //distance between the center of the rocket and the center of the asteroid
                const distanceX = rocket.x - a.x;
                const distanceY = rocket.y - a.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                //if they collide decrement the asteroid's value, update the score and destroy the rocket
                if (distance < a.radius + rocket.radius) {
                    a.value--;
                    this.score+=10;
                    if(a.value>0){
                        a.radius = a.getSize();
                        a.color = a.getColor();
                    }
                    //remove the asteroid if it's value is 0
                    if (a.value <= 0) {
                        this.#asteroids.splice(j, 1);
                        //if the score reaches a certain value restore the number of lives
                        if(this.score >= this.restoreLivesScore){
                            this.lives=3;
                            this.restoreLivesScore += 200;
                        }
                    }
                    this.#rockets.splice(i, 1);
                    break;
                }
            }
        }

    }

    //save the best 5 scores using Web Storage API (local storage)
    saveScore(playerName, score) {
        //convert the json to object, if it's null assign an empty array as a default value
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push({ name: playerName, score: score });
        
        //sort in descending order based on the score
        highScores.sort((a, b) => b.score - a.score);
        
        //keep only the top 5 scores
        highScores = highScores.slice(0, 5);

        //save the scores in local storage
        localStorage.setItem('highScores', JSON.stringify(highScores));
        this.displayHighScores();
    }
    
    displayHighScores() {
        let highScoresList = document.getElementById('highScores');
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        //empty the list for updating
        highScoresList.innerHTML = ''; 
        //iterate through the scores in local storage and add them in the list which will be displayed on the start screen
        highScores.forEach((score, index) => {
            const item = document.createElement('li');
            item.textContent = `${index + 1}. ${score.name} - ${score.score}`;
            highScoresList.appendChild(item);
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById('startScreen');
    const gameCanvas = document.getElementById('GameCanvas');
    const playerNameInput = document.getElementById('playerName');
    const newGameButton = document.getElementById('newGameButton');
    
    newGameButton.addEventListener("click", () => {
      const playerName = playerNameInput.value.trim();
      if (playerName == '') {
        alert("Please enter your name to start the game.");
        return;
      }
      startScreen.style.display = 'none';
      gameCanvas.style.display = 'flex';

      new Game();
    });
  });

  

