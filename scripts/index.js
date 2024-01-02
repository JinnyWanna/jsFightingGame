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
    this.lastKey;
    this.isJumped = false;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50
    }
    this.color = color;
  }
  
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, 50, this.height);

    // attack Box
    c.fillStyle = 'green';
    c.fillRect(
      this.attackBox.position.x, 
      this.attackBox.position.y, 
      this.attackBox.width, 
      this.attackBox.height);
  }

  update() {
    
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    

    if(this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.isJumped = false
    }
    else {
      this.velocity.y += gravity;
    }
    
    this.draw();
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
  else if(keys.d.pressed && (player.lastKey == 'd')) player.velocity.x = 5;

  // enemy movement
  if(keys.ArrowLeft.pressed && (enemy.lastKey === 'ArrowLeft')) enemy.velocity.x = -5;
  else if(keys.ArrowRight.pressed && (enemy.lastKey == 'ArrowRight')) enemy.velocity.x = 5;

  // detect for collision 
  if(player.attackBox.postion.x + player.attackBox.width >= enemy.position.x) {

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


