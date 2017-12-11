var background1;
var background2;
var pTree;
var p1Front;
var p1Back;
var p1Left;
var p1Right;
var p1LeftF;
var p1RightF;
var magicShield;
var boots;
var lWing;
var rWing;
var p1;
var trees = [];
var sEnemies = [];
var lastChecked = 0;
var numEnemies = 0;
var start = false;
var gamePaused = false;
var BEnemy;
var shield ={
  captured: false,
  active: false,
  lastChecked: 0
};
var superSpeed ={
  captured: false,
  active: false,
  lastChecked: 0
};
var wings = false;

function setup() {
  p1 = new P1();
  BEnemy = new bEnemy();
  for (var i = 0; i<80; i++) {
    trees[i] = new Tree;
    sEnemies[i] = new sEnemy;
  }
  createCanvas(windowWidth, windowHeight);
  //Images
  background1 = loadImage("Pink Flowers.png");
  background2 = loadImage("Grass.png");
  pTree = loadImage("Tree.png");
  p1Front = loadImage("WizardFront.png");
  p1Back = loadImage("Wizard Back.png");
  p1Left = loadImage("Wizard Left.png");
  p1LeftF = loadImage("Firing Wizard Left.png");
  p1RightF = loadImage("Firing Wizard Right.png");
  p1Right = loadImage("Wizard Right.png");
  magicShield = loadImage("magic shield.jpg");
  boots = loadImage("Boots.png");
  lWing = loadImage("Left Wing.png");
  rWing = loadImage("Right Wing.png");
}

function draw() {
  if (!start) {
    startMenu();
  }
  else {
    Background();
    fill(255);
    p1.fire();
    if (!wings) {
      p1.display();
    }
    for (var i = 0; i<80; i++) {
      trees[i].display();
      sEnemies[i].display();
    }
    if (wings) {
      p1.display();
    }
    BEnemy.display();
    p1.statusDisplay();
    pause();
    p1.end();
  }
}

function Background() {
  //generates grass background
  background(255);
  for (var i = 0; i<21; i++) {
    for (var x = 0; x<7; x++) {
      image(background2, i*60, x*100, 60, 100);
    }
  }
  image(background1, 120, 0, 60*3.13207547, 100);
  image(background1, 360, 200, 60*3.13207547, 100);
  image(background1, 740, 100, 60*3.13207547, 100);
  image(background1, 180, 400, 60*3.13207547, 100);
  image(background1, 860, 500, 60*3.13207547, 100);
}

function Tree () {
  //generates trees not on flowers
  this.x = random(900);
  this.y = random(600);
  this.display = function () {
    if (!isOnFlowers(this.x, this.y)) {
      image(pTree, this.x, this.y, 44, 55);
      this.isTouchingPlayer();
    }
  }
  this.isTouchingPlayer = function () {
    //player cannot walk through tree trunks
    if (!wings) {
      if (hitBox(this.x+19, p1.x+56, p1.x+88, this.x+24, this.y+52, p1.y+31,  p1.y+76, this.y+40)) {
        if (keyIsDown(65)) {
          p1.x+= 1 + checkSuperSpeedActive();
        }
        else if (keyIsDown(68)) {
          p1.x-= 1 + checkSuperSpeedActive();
        }
        if (keyIsDown(87)) {
          p1.y+= 1 + checkSuperSpeedActive();
        }
        if (keyIsDown(83)) {
          p1.y-= 1 + checkSuperSpeedActive();
        }
      }
    }
  }
}

function isOnFlowers(xtree, ytree) {
  //prevents trees from being generated within the vicinity of flowers or on top of the character
  //the numbers behind xtrees and ytrees are set cooridinates of where the flowers begin and end
  if (hitBox(xtree, 120, 120+60*3.13207547, xtree, 100, ytree, ytree, 0)) {
    return true;
  }
  else if (hitBox(xtree, 350, 360+60*3.13207547, xtree, ytree, 180, 300, ytree)) {
    return true;
  }
  else if (hitBox(xtree, 730, 740+60*3.13207547, xtree, ytree, 80, 200, ytree)) {
    return true;
  }
  else if (hitBox(xtree, 170, 180+60*3.13207547, xtree, ytree, 380, 500, ytree)) {
    return true;
  }
  else if (hitBox(xtree, 850, 860+60*3.13207547, xtree, ytree, 480, 600, ytree)) {
    return true;
  }
  else if (hitBox(xtree+19, 356, 388, xtree+24, ytree+52, 131, 176, ytree+40)) {
    return true;
  }
  else {
    return false;
  }
}

function P1 () {
  this.bullets = [{x:0, y:0, hidden:true, angle:0}, {x:0, y:0, hidden:true, angle:0}]
  this.bullet2 = false;
  this.x = 300;
  this.y = 100;
  this.lastChecked = 0;
  this.lastCheckedSP = 0;
  //stats
  this.level = 0;
  this.skillPoint = 0;
  this.exp = 0;
  this.maxhp = 100;
  this.maxmp = 100;
  this.hp = 100;
  this.mp = 100;
  this.dex = 0;
  this.attack = 10;
  this.speed = 0;
  this.display = function() {
    this.displayBullet();
    this.levelUp();
    this.autoRegen();
    this.maxStats();
    this.hpTrade();
    this.manaRegen();
    this.stayOnScreen();
    this.playerImage();
    this.playerImageFiring();
  },
  this.playerImage = function () {
    // if not paused and not firing, generates the player walking without ever generating two images of the player at once
    if (!keyPressed()) {
      if (!keyIsDown(65) && !keyIsDown(68) && !keyIsDown(87) && !keyIsDown(83) && !mouseIsPressed) {
        characterWings(this.x+20, this.y+35, true, true);
        image(p1Front, this.x, this.y, 300, 220);
      }
      if (keyIsDown(65)) {
        if (!mouseIsPressed && !keyIsDown(87) && !keyIsDown(83) && !keyIsDown(68)) {
          characterWings(this.x+19, this.y+35, true, false);
          image(p1Left, this.x-44, this.y, 300, 220);
        }
        this.x-=1+ checkSuperSpeedActive();
      }
      if (keyIsDown(68)) {
        if (!mouseIsPressed && !keyIsDown(87) && !keyIsDown(83)) {
          characterWings(this.x+20, this.y+35, false, true);
          image(p1Right, this.x+45, this.y, 300, 220);
        }
        this.x+=1+ checkSuperSpeedActive();
      }
      if (keyIsDown(87)) {
        if (!mouseIsPressed && !keyIsDown(83)) {
          image(p1Back, this.x-75, this.y, 300, 220);
          characterWings(this.x+22, this.y+35, true, true);
        }
        this.y-=1+ checkSuperSpeedActive();
      }
      if (keyIsDown(83)) {
        if (!mouseIsPressed) {
          characterWings(this.x+19, this.y+35, true, true);
          image(p1Front, this.x, this.y, 300, 220);
        }
        this.y+=1+ checkSuperSpeedActive();
      }
    }
  },
  this.playerImageFiring = function () {
    // generates image of the player while firing and not paused
    if (!keyPressed()) {
      if (mouseIsPressed) {
        if (mouseY < (this.y+5) && this.x-100 < mouseX && this.x+200 > mouseX) {
          image(p1Back, this.x-75, this.y, 300, 220);
          characterWings(this.x+22, this.y+35, true, true);
        }
        else if (mouseY > (this.y-5) && this.x-100 < mouseX && this.x+200 > mouseX) {
          characterWings(this.x+19, this.y+35, true, true);
          image(p1Front, this.x, this.y, 300, 220);
        }
        else if (mouseX < this.x) {
          characterWings(this.x+19, this.y+35, true, false);
          image(p1LeftF, this.x-44, this.y, 300, 220);
        }
        else if (mouseX > this.x) {
          characterWings(this.x+20, this.y+35, false, true);
          image(p1RightF, this.x+45, this.y, 300, 220);
        }
      }
    }
  },
  this.stayOnScreen = function () {
    // stops player from walking off screen
    if (this.x+55 < 0) {
      this.x+=1+ checkSuperSpeedActive();
    }
    if (this.x-10 > 900) {
      this.x-=1+ checkSuperSpeedActive();
    }
    if (this.y+30 < 0) {
      this.y+=1+ checkSuperSpeedActive();
    }
    if (this.y-30 > 600) {
      this.y-=1+ checkSuperSpeedActive();
    }
  },
  this.displayBullet = function () {
    //generates first bullet and moves it
    if (this.bullets[0].hidden === false && !keyPressed() && this.hp>0) {
      this.moveBullet(0);
      noStroke();
      fill (0, 200, 200);
      this.displayFireTrail(0);
      // calls another bullet if mouse is still pressed and first bullet is too far away
      if ((this.bullets[0].x - (this.x+75) > 100 || this.bullets[0].x - (this.x+75) < -100 || this.bullets[0].y - (this.y+50) > 100 || this.bullets[0].y - (this.y+50) < -100) && mouseIsPressed) {
        if (this.mp>2 && this.bullets[1].hidden === true) {
          this.mp-=2;
          this.bullets[1].hidden = false;
        }
      }
    }
    // generates second bullet and moves it
    if (this.bullets[1].hidden === false && !keyPressed() && this.hp>0) {
      this.moveBullet(1);
      noStroke();
      fill (0, 200, 200);
      this.displayFireTrail(1);
    }
    this.checkBulletLimit(0);
    this.checkBulletLimit(1);
  },
  this.moveBullet = function(num) {
    // moves a bullet
    for (var i = 0; i<3; i++) {
      this.bullets[num].x += cos(this.bullets[num].angle)+cos(this.bullets[num].angle)*(0.1*this.dex);
      this.bullets[num].y += sin(this.bullets[num].angle)+sin(this.bullets[num].angle)*(0.1*this.dex);
    }
  },
  this.displayFireTrail = function(num) {
    // shows you a physical bullet
    for (var i = 0; i < 5; i++) {
      ellipse(this.bullets[num].x + cos(this.bullets[num].angle)*3*i, this.bullets[num].y + sin(this.bullets[num].angle)*3*i, 4);
    }
  },
  this.checkBulletLimit = function(num) {
    // stops bullet from going to far away from you
    if (this.bullets[num].x - (this.x+150) > 200 || this.bullets[num].x - this.x < -200 || this.bullets[num].y - (this.y+100) > 200 || this.bullets[num].y - this.y < -200) {
      this.bullets[num].hidden = true;
    }
  },
  this.setTrajectory = function(num) {
    // sets the direction of the bullet and start location
    this.bullets[num].x = this.x+75;
    this.bullets[num].y = this.y+50;
    this.bullets[num].angle = atan2((mouseY-this.bullets[num].y),(mouseX-this.bullets[num].x));
  },
  this.fire = function () {
    // sets directionality and generates bullet if you have enough mp (bullets move towards the mouse)
    if (this.bullets[1].hidden === true && this.mp>=2 && !keyPressed()) {
      this.setTrajectory(1);
    }
    if (mouseIsPressed) {
      // sets directionality and generates bullet if you have enough mp (bullets move towards the mouse)
      if (this.bullets[0].hidden === true && this.mp>=2 && !keyPressed()) {
        this.setTrajectory(0);
        this.bullets[0].hidden = false;
        this.mp-=2;
      }
    }
  },
  this.autoRegen = function () {
    // makes hp and mp regenerate over time
    this.hpRegen = round(this.maxhp/50);
    this.mpRegen = round(this.maxmp/10);
    if (millis() - lastChecked > 7000 && !keyPressed() && this.hp>0) {
      lastChecked = millis();
      this.hp = this.hp + this.hpRegen;
      this.mp = this.mp + this.mpRegen;
    }
  },
  this.hpTrade = function () {
    // regenerates mp at the cost of hp if e is pressed
    if (keyIsDown(69) && this.hp>10 && this.mp !== this.maxmp) {
      this.mp+=2;
      this.hp-=1;
    }
  },
  this.manaRegen = function () {
    // gives player mana quickly if they are not moving and q is pressed
    if (millis() - this.lastChecked > 100 && keyIsDown(81) && !keyIsDown(87) && !keyIsDown(83) && !keyIsDown(65) && !keyIsDown(68) && !keyPressed()) {
      this.lastChecked = millis();
      this.mp++;
    }
  },
  this.maxStats = function () {
    //stops mp and hp from exceeding their maximum
    if (this.hp > this.maxhp) {
      this.hp = this.maxhp;
    }
    if (this.mp > this.maxmp) {
      this.mp = this.maxmp;
    }
  },
  this.levelUp = function () {
    //increases stats when you have gained enough exp
    if (this.exp > 100+(20*this.level) && this.hp>0) {
      this.dex++;
      this.attack++;
      this.speed++;
      this.skillPoint+=3;
      this.exp-= 100+(20*this.level);
      this.level++;
      this.maxhp+=5;
      this.hp=this.maxhp;
      this.maxmp+=10;
    }
  },
  this.statusDisplay = function () {
    //makes the status menu on the side
    noStroke();
    var h = this.hp/this.maxhp;
    var m = this.mp/this.maxmp;
    fill(220);
    rect(1000, 0, 270, 699);
    fill(0);
    textSize(18);
    text("Stats", 1100, 20);
    text("Level " + (this.level+1), 1050, 50);
    rect(1000, 21, 270, 1);
    rect(1010, 60, 250, 30);
    rect(1010, 100, 250, 30);
    fill(255, 0, 0);
    rect(1012, 62, 246*h, 26);
    if (shieldAbility()) {
      fill(0, 255, 20);
    }
    else {
      fill(0, 20, 255);
    }
    rect(1012, 102, 246*m, 26);
    fill(255);
    text(this.hp + " / " + this.maxhp, 1100, 83);
    text(this.mp + " / " + this.maxmp, 1100, 123);
    textSize(16);
    fill(0);
    text("Dex = " + this.dex, 1020, 150);
    text("Atk = " + this.attack, 1100, 150);
    text("Speed = " + this.speed, 1180, 150);
    rect(1000, 152, 270, 1);
    text("Skill Points = " + this.skillPoint, 1020, 175);
    text("Exp until next level up = " + ((100+(20*this.level)) - this.exp), 1020, 200);
    rect(1000, 201, 270, 1)
    rect(1000, 177, 270, 1);
    text("Special Items", 1050, 300);
    rect(1000, 301, 270, 1);
    this.shieldInstructions();
    this.superSpeedInstructions();
    this.wingsInstructions();
    //lets you devote skill points to increase stats by clicking on the menu on the side
    if (millis() - this.lastCheckedSP > 200) {
      if (mouseIsPressed && mouseX>1010 && mouseX<1075 && mouseY>135 && mouseY<153 && this.skillPoint>0) {
        this.dex += 1;
        this.skillPoint-=1;
        this.lastCheckedSP = millis();
      }
      if (mouseIsPressed && mouseX>1100 && mouseX<1165 && mouseY>135 && mouseY<153 && this.skillPoint>0) {
        this.attack += 1;
        this.skillPoint-=1;
        this.lastCheckedSP = millis();
      }
      if (mouseIsPressed && mouseX>1180 && mouseX<1245 && mouseY>135 && mouseY<153 && this.skillPoint>0) {
        this.speed += 1;
        this.skillPoint-=1;
        this.lastCheckedSP = millis();
      }
      if (mouseIsPressed && mouseX>1010 && mouseX<1260 && mouseY>60 && mouseY<90 && this.skillPoint>0) {
        this.maxhp+=5;
        this.hp+=5;
        this.skillPoint-=1;
        this.lastCheckedSP = millis();
      }
      if (mouseIsPressed && mouseX>1010 && mouseX<1260 && mouseY>100 && mouseY<130 && this.skillPoint>0) {
        this.maxmp+=5;
        this.mp+=5;
        this.skillPoint-=1;
        this.lastCheckedSP = millis();
      }
    }
  },
  this.shieldInstructions = function () {
    // displays shield instructions if the item is obtained
    if (shield.captured) {
      image(magicShield, 1020, 300, 40, 40);
      text("         Magic Shield: \n While active lose mp instead \n of hp (press 1 to turn on and off)", 1022, 323);
      rect(1000, 364, 270, 1);
    }
  },
  this.superSpeedInstructions = function () {
    // displays superSpeed instructions if the item is attained
    if (superSpeed.captured) {
      image(boots, 1020, 370, 30, 30);
      text("        Super Speed: \n hold down the space key to run \n very fast at the cost of mp", 1022, 390);
      rect(1000, 364, 270, 1);
      rect(1000, 435, 270, 1);
    }
  },
  this.wingsInstructions = function () {
    // displays wing instructions if the item is attained
    if (wings) {
      image(lWing, 1040, 424, 60, 40);
      image(rWing, 1000, 424, 60, 40);
      text("               Wings: \n can walk through trees \n and increases your dex by 5", 1020, 455);
      rect(1000, 435, 270, 1);
      rect(1000, 500, 270, 1);
    }
  }
  this.end = function () {
    var outCome = ["lose", "win"]
    //if the player dies or reaches level 80 they win or lose
    if (this.hp<1) {
      endGame(outCome[0]);
    }
    else if (this.level===79) {
      endGame(outCome[1]);
    }
  }
}

function keyPressed () {
  //pauses the game if escape is pressed and unpauses it if '~' is pressed
  if (keyCode === 27 && gamePaused === false) {
    gamePaused = true;
  }
  else if (keyCode === 192){
    gamePaused = false;
  }
  return gamePaused;
}

function pause () {
  if (keyPressed()) {
    fill(220);
    stroke(0);
    rect(350, 150, 300, 100);
    textSize(64);
    fill(0);
    noStroke();
    text("Paused", 390, 200);
    textSize(16);
    text("To unpause press '~' key below escape", 360, 230);
  }
}

function sEnemy () {
  this.bullets ={
    x:0,
    y:0,
    hidden:true,
    angle:0
  };
  this.spawn = false;
  this.right = true;
  this.level = 0;
  this.maxhp = 100;
  this.hp = 100;
  this.dex = 0;
  this.attack = 10;
  this.speed = 0;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.display = function () {
    if (p1.hp>0) {
      stroke(0);
      this.stats();
      this.spawning();
      this.gEnemy();
      this.move();
      this.fire();
      this.dead();
      this.damagePlayer();
      this.damageMe(0);
      this.damageMe(1);
    }
  },
  this.stats = function () {
    //sets enemy stats
    if (this.spawn === false) {
      this.x = random(900);
      this.y = random(600);
      this.level = round(random(p1.level, (p1.level+3)));
      this.maxhp = (this.level+1)*10 + 100;
      this.hp = this.maxhp;
      this.dex = this.level*2;
      this.attack = this.level*2;
      this.speed = this.level*2;
    }
  },
  this.spawning = function () {
    //randomly spawns an enemy that is not within the players firing range
    if (!keyPressed() && this.spawn === false && (this.x < (p1.x-200) || this.x > (p1.x+200) || this.y < (p1.y-200) || this.y > (p1.y+200))) {
      var x = round(random((80-p1.level)));
      var y = round(random(200));
      if (x === 2 && y === 5 && numEnemies<p1.level+15) {
        this.spawn = true;
        numEnemies++;
      }
    }
  },
  this.gEnemy = function () {
    //creates an enemy and sets them facing a random direction
    if (this.spawn === true && !keyPressed()) {
      colorMode(HSB);
      fill((this.level-p1.level)*40, 255, 255);
      rect(this.x, this.y, 30, 30);
      if (this.right === true) {
        fill(255);
        rect(this.x+23, this.y+8, 5, 5);
        rect(this.x+8, this.y+8, 5, 5);
        fill(0);
        rect(this.x+25, this.y+9, 3, 3);
        rect(this.x+10, this.y+9, 3, 3);
      }
      else {
        fill(255);
        rect(this.x+3, this.y+8, 5, 5);
        rect(this.x+20, this.y+8, 5, 5);
        fill(0);
        rect(this.x+3, this.y+9, 3, 3);
        rect(this.x+20, this.y+9, 3, 3);
      }
      colorMode(RGB);
      fill(0);
      textSize(12);
      text(this.hp, this.x+5, this.y+25);
    }
  },
  this.move = function () {
    if (!keyPressed()) {
      //odds of npc moving
      var z = round(random(1, 10));
      //npc moves towards character
      if (z === 2) {
        this.angle = atan2(((p1.y+50)-this.y),((p1.x+75)-this.x));
        for (var i = 0; i<(this.speed/2+1); i++) {
          this.x += cos(this.angle)/2;
          this.y += sin(this.angle)/2;
        }
      }
      //npc moves randomly
      else if (z === 3) {
        this.angle = random(360);
        for (var i = 0; i<(round(this.speed/5+1)); i++) {
          this.x += cos(this.angle)/10;
          this.y += sin(this.angle)/10;
        }
      }
    }
  },
  this.fire = function () {
    //odds of npc firing a bullet
    var z = round(random(150));
    //sets bullet directionality and fires it
    if (this.bullets.hidden === true && !keyPressed() && z === 0 && this.spawn === true) {
      this.bullets.x = this.x;
      this.bullets.y = this.y;
      this.bullets.hidden = false;
      this.bullets.angle = atan2(((p1.y+50)-this.bullets.y),((p1.x+75)-this.bullets.x));
    }
    this.displayBullet();
    this.maxDistance();
  },
  this.displayBullet = function () {
    //generates and moves bullet
    if (this.bullets.hidden === false && !keyPressed()) {
      for (var i = 0; i<15; i++) {
        this.bullets.x += cos(this.bullets.angle)/5;
        this.bullets.y += sin(this.bullets.angle)/5;
        noStroke();
        fill(255, 0, 0);
        ellipse(this.bullets.x, this.bullets.y, 4);
      }
    }
  },
  this.maxDistance = function () {
    // limit on how far bullet can go
    if (this.bullets.x - this.x > 200 || this.bullets.x - this.x < -200 || this.bullets.y - this.y > 200 || this.bullets.y - this.y < -200) {
      this.bullets.hidden = true;
    }
  },
  this.damagePlayer = function () {
    // if a bullet is touching the player they take damage depending on magicShield
    if (hitBox(this.bullets.x, p1.x+56, p1.x+88, this.bullets.x, this.bullets.y, p1.y+31, p1.y+66, this.bullets.y) && this.bullets.hidden === false) {
      if (shield.active && (p1.mp - this.attack) > 0) {
        p1.mp-=this.attack;
      }
      else {
        p1.hp-=this.attack;
      }
      this.bullets.hidden = true;
    }
  },
  this.damageMe = function (num) {
    // if a bullet hits an enemy it deals damage and dissapears
    if (hitBox(p1.bullets[num].x, this.x, this.x, p1.bullets[num].x-30, p1.bullets[num].y, this.y, this.y, p1.bullets[num].y-30) && this.spawn === true && p1.bullets[num].hidden === false) {
      p1.bullets[num].hidden = true;
      this.hp-=round(random(p1.attack, p1.attack+(p1.attack*.25)));
    }
  },
  this.dead = function () {
    if (this.hp<1) {
      this.spawn = false;
      p1.exp+= this.level*3;
      numEnemies--;
    }
  }
}

function bEnemy () {
  this.bullets = [{x:0, y:0, hidden:true, angle:0}, {x:0, y:0, hidden:true, angle:0}, {x:0, y:0, hidden:true, angle:0}];
  this.spawn = false;
  this.boss = 5;
  this.level = 0;
  this.maxhp = 100;
  this.hp = 100;
  this.attack = 10;
  this.speed = 0;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.display = function () {
    if (p1.hp>0) {
      stroke(0);
      this.stats();
      this.spawning();
      if (this.spawn === true) {
        this.fire()
      }
      this.gEnemy();
      this.move();
      this.dead();
      for (var i = 0; i<3; i++) {
      this.damagePlayer(i);
      }
      this.damageMe(0);
      this.damageMe(1);
    }
  },
  this.stats = function () {
    //sets enemy stats
    if (this.spawn === false) {
      this.x = random(900);
      this.y = random(600);
      this.level = (p1.level+1);
      this.maxhp = (this.level+1)*20 + 100;
      this.hp = this.maxhp;
      this.attack = this.level*3;
      this.speed = this.level*3;
    }
  },
  this.spawning = function () {
    //spawns boss enemy not in player's firing range every 5 levels
    if (!keyPressed() && this.spawn === false && (this.x < (p1.x-200) || this.x > (p1.x+200) || this.y < (p1.y-200) || this.y > (p1.y+200))) {
      if (this.level/this.boss === 1) {
        this.spawn = true;
        this.boss+= 5;
      }
    }
  },
  this.gEnemy = function () {
    //creates an enemy and sets them facing a random direction
    if (this.spawn === true && !keyPressed()) {
      fill(20);
      rect(this.x, this.y, 50, 50);
      fill(255);
      rect(this.x+30, this.y+8, 10, 10);
      rect(this.x+8, this.y+8, 10, 10);
      fill(255);
      textSize(12);
      text(this.hp, this.x+15, this.y+35);
    }
  },
  this.move = function () {
    if (!keyPressed()) {
      //odds of npc moving
      var z = round(random(1, 10));
      //npc moves towards character
      if (z === 2) {
        this.angle = atan2(((p1.y+50)-this.y),((p1.x+75)-this.x));
        for (var i = 0; i<(this.speed/2+1); i++) {
          this.x += cos(this.angle)/2;
          this.y += sin(this.angle)/2;
        }
      }
      //npc moves randomly
      else if (z === 3) {
        this.angle = random(360);
        for (var i = 0; i<(round(this.speed/5+1)); i++) {
          this.x += cos(this.angle)/10;
          this.y += sin(this.angle)/10;
        }
      }
    }
  },
  this.fire = function () {
    //odds of npc firing a bullet
    var z = round(random(50));
    if (z === 4 && this.spawn === true) {
      z=0;
    }
    // fires bullet if conditions are met
    if (this.bullets[0].hidden === true && !keyPressed() && z === 0 && this.spawn === true) {
      this.spawnBullet(0);
    }
    for (var i = 0; i<2; i++) {
      if (this.callAdditionalBullets(i)) {
        this.spawnBullet(i+1);
      }
    }
    for (var i = 0; i<2; i++) {
      this.displayBullet(i);
      this.bulletMaxDistance(i);
    }
  },
  this.spawnBullet = function (num) {
    // sets bullet directionality and fires it
    this.bullets[num].x = this.x+25;
    this.bullets[num].y = this.y+25;
    this.bullets[num].hidden = false;
    this.bullets[num].angle = atan2(((p1.y+50)-this.bullets[num].y),((p1.x+75)-this.bullets[num].x));
  },
  this.callAdditionalBullets = function (num) {
    if (this.bullets[num].hidden === false && !keyPressed() && this.spawn === true && this.bullets[num].x - this.x+25 > 80 ||
    this.bullets[num].x - this.x+25 < -80 || this.bullets[num].y - this.y+25 > 80 || this.bullets[num].y - this.y+25 < -80) {
      return true;
    }
    else {
      return false;
    }
  }
  this.displayBullet = function (num) {
    //generates and moves bullet
    if (this.bullets[num].hidden === false && !keyPressed()) {
      for (var i = 0; i<15; i++) {
        this.bullets[num].x += cos(this.bullets[num].angle)/3;
        this.bullets[num].y += sin(this.bullets[num].angle)/3;
        noStroke();
        fill(140, 0, 255);
        ellipse(this.bullets[num].x, this.bullets[num].y, 6);
      }
    }
  },
  this.bulletMaxDistance = function (num) {
    // limit on how far bullet can go
    if (this.bullets[num].x - this.x+25 > 300 || this.bullets[num].x - this.x+25 < -300 || this.bullets[num].y - this.y+25 > 300 || this.bullets[num].y - this.y+25 < -300) {
      this.bullets[num].hidden = true;
    }
  },
  this.damagePlayer = function (num) {
    // damages player if any of the bullets hit him (taking magicShield into account)
    if (hitBox(this.bullets[num].x, p1.x+56, p1.x+88, this.bullets[num].x, this.bullets[num].y, p1.y+31, p1.y+66, this.bullets[num].y) && this.bullets[num].hidden === false) {
      if (shield.active && (p1.mp - this.attack) > 0) {
        p1.mp-=this.attack;
      }
      else {
        p1.hp-=this.attack;
      }
      this.bullets[num].hidden = true;
    }
  },
  this.damageMe = function (num) {
    // damages the enemy if the player hits him
    if (hitBox(p1.bullets[num].x, this.x, this.x, p1.bullets[num].x-50, p1.bullets[num].y, this.y, this.y, p1.bullets[num].y-50) && this.spawn === true && p1.bullets[num].hidden === false) {
      p1.bullets[num].hidden = true;
      this.hp-=round(random(p1.attack, p1.attack+(p1.attack*.25)));
    }
  },
  this.dead = function () {
    // gets rid of dead enemies and gives the player exp
    if (this.hp < 1) {
      this.spawn = false;
      p1.exp+=this.level*3+5;
      this.itemDrop();
    }
  },
  this.itemDrop = function () {
    // odds of dropping an item
    var z = round(random(1, 4));
    //possible item drops
    if (z === 1 && shield.captured === false) {
      shield.captured = true;
    }
    else if (z === 2 && superSpeed.captured === false) {
      superSpeed.captured = true;
    }
    else if (z === 3 && wings === false) {
      wings = true;
      p1.dex+=5;
    }
    else {
      z = round(random(1, 4));
    }
  }
}

function shieldAbility() {
  // if you got the magicShield item you can activate its ability
  if (shield.captured) {
    if (keyIsDown(49) && shield.active === false) {
      shield.active = true;
      shield.lastChecked = millis();
    }
    else if (keyIsDown(49) && shield.active === true) {
      shield.active = false;
      shield.lastChecked = millis();
    }
  }
  return shield.active;
}

function superSpeedAbility() {
  // if you got the super speed item lets you activate it
  if (superSpeed.captured) {
    if (keyIsDown(32) && p1.mp>2) {
      superSpeed.active = true;
      if (millis() - superSpeed.lastChecked > 100) {
        superSpeed.lastChecked = millis();
        p1.mp-=1;
      }
    }
    else {
      superSpeed.active = false;
    }
  }
  return superSpeed.active;
}

function checkSuperSpeedActive() {
  // changes p1's speed if he is using super speed
  var times = 1;
  if (superSpeedAbility() &&  p1.mp>6) {
    times = 3;
  }
  else {
    times = 1;
  }
  return p1.speed*0.05*times;
}

function characterWings (x, y, left, right) {
  // if the character got wings he'll have an image of wings on him and be able to pass through trees
  if (wings) {
    if (left === true) {
      image(lWing, x+41, y, 60, 40);
    }
    if (right === true) {
      image(rWing, x, y, 60, 40);
    }
  }
}

function endGame(result) {
  //screen when game ends
  fill(0);
  rect(0, 0, 1300, 700);
  fill(255, 0, 0);
  textSize(64);
  text("You " + result, 500, 300);
}

function startMenu() {
  //generates a start menu before game starts
  fill(220);
  rect(0, 0, 1050, 530);
  fill(255, 0, 0);
  rect(400, 100, 350, 130);
  fill(0);
  textSize(64);
  text("Controls", 200, 50);
  text("Start", 500, 190);
  rect(0, 51, 1050, 1);
  textSize(48);;
  text("Moving:", 100, 100);
  text("Firing:", 100, 300);
  text("Mana Using:", 100, 375);
  text("Skill Points:", 100, 490);
  rect(100, 101, 165, 1);
  rect(100, 301, 130, 1);
  rect(100, 376, 265, 1);
  rect(100, 491, 245, 1);
  textSize(32);
  text("- w = up \n- s = down \n- a = left \n- d = right", 110, 125);
  text("- Click in the direction you want to fire", 110, 329);
  text("- q = mana regeneration while not moving \n- e = trade in hp for mana", 110, 400);
  text("- Click on stats (including hp and mp) to devote skill points to them", 110, 520);
  text("- Press escape to \n  pause the game", 700, 280);
  //starts game
  if (mouseX>400 && mouseX<750 && mouseY>100 && mouseY<230 && mouseIsPressed) {
    start = true;
  }
}

function hitBox(x11, x12, x21, x22, y11, y12, y21, y22) {
  if (x11 > x12 && x21 > x22 && y11 > y12 && y21 > y22) {
    return true;
  }
  else {
    return false;
  }
}
