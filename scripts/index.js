// SET CANVAS

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc : './img/background.png'
})

const gravity = 0.7;

const player = new Fighter({
  position: {
  x: 100, 
  y: 100
  },
  velocity: {
    x: 0,
    y: 0
  }
});

player.draw();

const enemy = new Fighter({
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

decreaseTimer();

//GAME END

// ANIMATION FRAME

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = 'black';
  c.fillRect(0,0, canvas.width, canvas.height);
  background.update();

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
  if(rectangularCollision({rectangle1: player, rectangle2: enemy})) {
    if(player.isAttacking) {
      player.isAttacking = false;
      enemy.health -= 10;
      document.querySelector('.enemy-health').style.width = `${enemy.health}%` ;
    }
  }

  // enemy attack ,
  if(rectangularCollision({rectangle1: enemy, rectangle2: player})) {
    if(enemy.isAttacking) {
      enemy.isAttacking = false;
      player.health -= 10;
      document.querySelector('.player-health').style.width = `${player.health}%` ;
    }
  }

  // end game based on health
  if(enemy.health <= 0 || player.health <= 0) {
    determineWinner({
      player : player,
      enemy: enemy,
      timerId: timerId
    })
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


