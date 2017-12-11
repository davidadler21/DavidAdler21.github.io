var video;
var previousPixels = [];
var particles = [];
var vScale = 60;
var slider;

function setup() {
  mySetup();
}

function draw() {
  myDraw();
}

function mySetup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width/vScale*6, height/vScale*6);
  colorMode(HSB);
  video.loadPixels();
  previousPixels = video.pixels;
  for (var i = 0; i<40; i++) {
    particles[i] = new Particle();
  }
  slider = createSlider(0, 255, 0);
  slider.position(200, 470);
}

function myDraw() {
  background(255, 0, 0);
  video.loadPixels();
  loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x + 1 + (y * video.width))*4;
      var r = video.pixels[index+0];
      var g = video.pixels[index+1];
      var b = video.pixels[index+2];
      var changeR = previousPixels[index+0];
      var changeG = previousPixels[index+1];
      var changeB = previousPixels[index+2];
      var currentAverage = (r+g+b)/3;
      var previousAverage = (changeR+changeG+changeB)/3;
      var z = round(random(1, 9));
      if (changeR > r+25  || changeR < r-25 || changeG < g-25 || changeG < g-25 || changeB < b-25 || changeB < b-25) {
        for (var i = 0; i<2; i++) {
          particles[i].update();
          particles[i].show(x*10, y*10);
        }
      }
      else if (z % 3 === 0 && x % 2 === 0 && y % 2 === 0) {
        fill(slider.value(), 255, 150);
        text(z, 10*x, 11*y);
      }
      else if (x % 2 === 0 && y % 2 === 0){
        fill(slider.value(), 255, 150);
        text(z, 10*x, 11*y);
      }
      previousPixels[index+0] = r;
      previousPixels[index+1] = g;
      previousPixels[index+2] = b;
    }
  }
}

function Particle(x, y) {
  this.x = 0;
  this.y = 0;
  this.r = random(3, 5);
  this.update = function() {
    this.x += random(-10, 10);
    this.y += random(-10, 10);

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
  this.show = function(x, y) {
    noStroke();
    if (slider.value()<20) {
      fill(255);
    }
    else if (slider.value()<200) {
      fill(slider.value()*2, 255, 255);
    }
    else {
      fill(random(255), 255, 255);
    }
    this.x = x;
    this.y = y;
    ellipse(this.x, this.y, this.r, this.r);
  }
}
