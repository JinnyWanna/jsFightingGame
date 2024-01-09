class Sprite {
  constructor({position, imageSrc, scale = 1, framesMax = 1}) {
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
  }
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent*(this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x, 
      this.position.y, 
      (this.image.width / this.framesMax) * this.scale, 
      this.image.height * this.scale);
  }

  update() {
    this.draw();
    this.framesElapsed++;

    if(this.framesElapsed % this.framesHold === 0) {
      if(this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      }
      else {
        this.framesCurrent = 0;
      }
    }
  }
}
class Fighter {
  
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
    this.health = 100;
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
    

    if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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
