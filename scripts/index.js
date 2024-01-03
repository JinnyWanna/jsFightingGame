// 이 프로젝트 끝낸후 블로그에 기록하기

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

///// class

const gravity = 0.7;

class Sprite {
  
  constructor({position, velocity, color = 'red'}) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;  
    this.width = 50;
    this.lastKey;
    this.isJumped = false;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: 100,
      height: 50
    }
    this.color = color;
    this.isAttacking = false;
  }
  
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack Box
    if(this.isAttacking) {
      c.fillStyle = 'green';
      c.fillRect(
        this.attackBox.position.x, 
        this.attackBox.position.y, 
        this.attackBox.width, 
        this.attackBox.height);
    }
  }

  update() {

    // attack box position
    if(this.lastKey === 'a' || this.lastKey === 'ArrowLeft'){
      this.attackBox.position.x = this.position.x - this.width;
      this.attackBox.position.y = this.position.y;
    }
    else {
      this.attackBox.position.x = this.position.x;
      this.attackBox.position.y = this.position.y;
    }
    
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    

    if(this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y= 0;
      this.isJumped = false
    }
    else {
      this.velocity.y += gravity;
    }
    
    this.draw();
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100)
  }
}

const player = new Sprite({
  position: {
  x: 0, 
  y: 0
  },
  velocity: {
    x: 0,
    y: 0
  }
});

player.draw();

const enemy = new Sprite({
  position: {
  x: 400, 
  y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color : 'blue'
});
enemy.draw();

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}


//// function , keymove

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = 'black';
  c.fillRect(0,0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  
  // player movement
  if(keys.a.pressed && (player.lastKey === 'a')) player.velocity.x = -5;
  else if(keys.d.pressed && (player.lastKey === 'd')) player.velocity.x = 5;

  // enemy movement
  if(keys.ArrowLeft.pressed && (enemy.lastKey === 'ArrowLeft')) enemy.velocity.x = -5;
  else if(keys.ArrowRight.pressed && (enemy.lastKey === 'ArrowRight')) enemy.velocity.x = 5;
    
  // detect for collision 
  // player attack ' '
  if(player.attackBox.position.x + player.attackBox.width >= enemy.position.x && 
    player.attackBox.position.x <= enemy.position.x + enemy.width && 
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y && 
    player.attackBox.position.y <= enemy.position.y +enemy.height) {
    if(player.isAttacking) {
      player.isAttacking = false;
      console.log('go');
    }
  }

  // enemy attack ,
  if(enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x && 
    enemy.attackBox.position.x <= player.position.x + player.width && 
    enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y && 
    enemy.attackBox.position.y <= player.position.y +player.height) {
    if(enemy.isAttacking) {
      enemy.isAttacking = false;
      console.log('go2');
    }
  }
}

animate();

///// keymove


window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;

    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      if(!player.isJumped) {
        player.isJumped = true;
        player.velocity.y = -20;
      }
      break;
    case ' ':
      player.attack();
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      if(!enemy.isJumped) {
        enemy.isJumped = true;
        enemy.velocity.y = -20;
      }     
      break;

    case ',':
      enemy.attack();
      break;
  }
     
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;

    case 'a':
      keys.a.pressed = false;
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    }


});


