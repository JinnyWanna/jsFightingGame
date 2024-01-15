class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }


  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale);
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      }
      else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite {

  constructor({ position, velocity, color = 'red', imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, sprites, framesHold}) { // 상속시 생성자는 상속 안됨 , 내부 함수들만 상속
    
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    });
    
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
      offset,
      width: 100,
      height: 50
    }
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.framesHold = framesHold;

    this.sprites = sprites;

    for(const sprite in this.sprites) {
      this.sprites[sprite].image = new Image(); 
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
    }
    
  }


  update() {

    this.animateFrames();
    // attack box position
    // if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
    //   this.attackBox.position.x = this.position.x - this.width;
    //   this.attackBox.position.y = this.position.y;
    // }
    // else {
    //   this.attackBox.position.x = this.position.x;
    //   this.attackBox.position.y = this.position.y;
    // }  

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //gravity func
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) { // this.velocity.y를 안더하면 가끔 땅속으로 조금 들어감
      this.velocity.y = 0;
      this.position.y = 331; // 이거 없으면 착지할때 발작일으킴
      // why? 소숫점자리의 위치 오차때문에 frames반복하면서 fall모션, idle모션 오락가락함
      this.isJumped = false 
    }
    else {
      this.velocity.y += gravity;
    }

    this.draw();
  }
  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100)
  }

  switchSprite(sprite) {
    if(this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return;
    switch (sprite) {
      case 'idle':
        if(this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0; // 점프시 가끔 프레임차이로 끊김현상 발생 해결 위함 
        }
        break;
      case 'run':
        if(this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if(this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        if(this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack1':
        if(this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
    
    }
  }
}
