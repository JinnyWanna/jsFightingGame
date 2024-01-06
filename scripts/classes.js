class Sprite {
  constructor({position, imageSrc}) {
    this.position = position;
    this.height = 150;  
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
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
