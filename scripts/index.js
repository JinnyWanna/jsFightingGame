// SET CANVAS

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// canvas에 이미지 그리기, 여러 프레임인 이미지 그리기

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc : './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc : './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
  x: 0, 
  y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  scale: 2.5,
  offset: { 
    x: 180,
    y: 157
  },
  attackBox: {
    offset: {
      x: 120,
      y: 50
    },
    width: 160,
    height: 50
  },
  framesHold: 5,

  sprites : {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit : {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death : {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
    
  }
});

const enemy = new Fighter({
  position: {
  x: 400, 
  y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  scale : 2.5,
  offset: {
    x: 215,
    y: 170
  },
  attackBox: {
    offset: {
      x: -165,
      y: 50
    },
    width: 165,
    height: 50
  },
  framesHold: 5,


  sprites : {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit : {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death : {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  }
});


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
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  
  if(keys.a.pressed && (player.lastKey === 'a')) {
    player.velocity.x = -5; 
    player.switchSprite('run');
  }
  else if(keys.d.pressed && (player.lastKey === 'd')) {
    player.velocity.x = 5;
    player.switchSprite('run');
  }
  else {
    player.switchSprite('idle');
  }
  //jumping
  if(player.velocity.y < 0) {
    player.switchSprite('jump');
  }
  //falling
  else if(player.velocity.y > 0) {
    player.switchSprite('fall');
  }
  
  // enemy movement 
  if(keys.ArrowLeft.pressed && (enemy.lastKey === 'ArrowLeft')) {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  }
  else if(keys.ArrowRight.pressed && (enemy.lastKey === 'ArrowRight')) {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  }
  else {
    enemy.switchSprite('idle');
  }
  //jumping
  if(enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  }
  //falling
  else if(enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }
  // detect for collision && enemy takeHit
  // player attack ' '
  if(rectangularCollision({rectangle1: player, rectangle2: enemy})) {
    if(player.isAttacking && player.framesCurrent === 4) {
      enemy.takeHit();
      player.isAttacking = false;
      
      document.querySelector('.enemy-health').style.width = `${enemy.health}%` ;
    }
  }
  // if player missed
  if(player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }


  // enemy attack ,
  if(rectangularCollision({rectangle1: enemy, rectangle2: player})) {
    if(enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false;
      player.takeHit();
      document.querySelector('.player-health').style.width = `${player.health}%` ;
      
    }
  }

  if(enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
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
  if(!player.dead) {
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
    }
  }
  
  if(!enemy.dead) {
    switch (event.key) {
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


