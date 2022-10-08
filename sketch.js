class Mover{
  constructor(){
    var r = random(30);
    this.color = [random(255), random(255), random(255)];
    this.mouse = createVector(0, 0);
    this.position = createVector(random(2*r, width - 2*r), random(2*r, height - 2*r));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = r
  }
  
  show(){
    var r = this.r
    var position = this.position
    var color = this.color
    ellipse(position.x, position.y, 2*r, 2*r);
    fill(color[0], color[1], color[2], 60);
  }

  update(x, y) {
    var position = this.position
    var mouse = createVector(x, y);

    mouse.sub(position);
    mouse.setMag(0.4);
    this.mouse = mouse
  }
  
  directMouse(){
    var acceleration = this.mouse;
    this.acceleration = acceleration
  }

  move(){
    this.position.add(this.velocity);

    this.velocity.add(this.acceleration);
    this.velocity.limit(12);
    console.log(this.position)
  }
  
  bounce(){
    var r = this.r
    var position = this.position
    var velocity = this.velocity
    if(position.x > (width - r - 5) || position.x < r + 5){
       velocity.x = -1.5*velocity.x;
    }
    if(position.y > (height - r - 5) || position.y < r + 5){
       velocity.y = -1.5*velocity.y;
    }
    this.velocity = velocity
    this.position = position
  }
  
  push() {
     
  }
}

var movers = []
function setup() {
  createCanvas(1400, 1400);
  background("black")
  for(var i = 0; i < 200; i++){
    movers[i] = new Mover();
  }
}

function draw() {
  background(20);
	noFill();
	stroke(200, 50);
  strokeWeight(5);
	rect(0, 0, width-5,height-5);
	noStroke();
	fill(255, 100, 100, 50);

  for(var i = 0; i < movers.length; i++){
    movers[i].show();
    movers[i].update(int(mouseX), int(mouseY));
    movers[i].directMouse();
    movers[i].move();
    movers[i].bounce();
  }
}

