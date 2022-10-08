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

class Boid {
  constructor() {
    this.position = createVector(random(width/2), random(height));
    this.velocity = createVector(5,0);
    // this.velocity = p5.Vector.random2D();
    // this.velocity.setMag(random(0, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 1;
    this.alpha = 30;
    
    this.r = random(20,40);
    
  }

  edges() {
    if (this.position.x > width) {
      return true;
    } else if (this.position.x < 0) {
      return true;
    }
    if (this.position.y > height) {
      return true;
    } else if (this.position.y < 0) {
      return true;
    }
    else{
      return false;
    }
    
  }

  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 10;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);


    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    
    
    if (this.r <80){
        this.r += 0.2;
    }
  }

  changeColor(mover) {
    this.show(mover.color)
  }

  show(color) {
    strokeWeight(3);
    // stroke("#bad6db");
    // noFill();
    // noStroke();
    stroke(255, this.alpha);
    if (color == undefined) {
      noFill();
    } else {
      fill(mover.color)
    }
    ellipse( this.position.x, this.position.y, this.r/2, this.r/2);
    // point(this.position.x, this.position.y);
    // point(this.position.x-15, this.position.y+15);
    // point(this.position.x+15, this.position.y-15);
    this.alpha += 0.1;
  }
}


var movers = []
var flock = []
let start =0;

function setup() {
  createCanvas(1400, 1400);
  foamX = width/2;
  waveX = -100;
  waveSize = 0;
  waveAlpha = 0;
  waveAlpha2 = 0;

  for(var i = 0; i < 200; i++){
    movers[i] = new Mover();
  }

  for (let i = 0; i < 50; i++) {
    flock.push(new Boid());
  }

  setInterval(bubbles,16000);
  pixelDensity(1);
}

function draw() {
  background("#055873");
  // oceanColors();

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

  for (let i = 0; i<flock.length; i++) {
    if (flock[i].edges() == true){
        flock.splice(i,1);
    }
  }

  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  // for (let boid of flock) {
  //   for (let mover of movers) {
  //     if (is_intersect(boid, mover)) {
  //       boid.changeColor(mover.color)
  //     }
  //   }
  // }
}

function is_intersect(boid, mover) {
  console.log(boid)
  console.log(mover)
  return Math.sqrt(Math.abs(boid.position.x-mover.position.x)+ Math.abs(boid.position.y-mover.position.y))<(boid.r+mover.r)
}

function bubbles(){
  for (let i = 0; i < 50; i++) {
      flock.push(new Boid());
  }
  restart();
  
}

function oceanColors(){
  //perlin noise applied on pixels
  loadPixels();
  var yoff = start;
  for (let x = 0; x<width; x++){
    var xoff = start;
    for (let y = 0; y<height; y++){
      
      let index = (x + y* width) * 4;
      let n = noise(xoff,yoff)*255;
      
      let r = pixels[index + 0]  // r
      let g = pixels[index + 1]  // g
      let b = pixels[index + 2] // b
      let a = pixels[index + 3]  // alpha
      
      let bright = (r+g+b)/3;
      pixels[index + 0] = (r+n)/2;
      pixels[index + 1] = (g+n)/2;
      pixels[index + 2] = (b+n)/2;
      pixels[index + 3] = b+400
      
      xoff += 0.02;
    
    }
    yoff -= 0.02;
  }
  start += 0.01;
  updatePixels();
  
  // add a transparent rect to create more realistic water
  fill(2,116,149,100);
  rect(0,0, width, height);
}
