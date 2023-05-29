const fileName = "giss-data-may-29-2023.csv";
let shift = 10;
let zeroRadius = 125;
let oneRadius = 200;
let monthRadis = 550;
let previousAnomaly = 0;
let currentColor = 0;

let currentRow = 1;
let currentMonth = 0;

let data;

let months = [
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
];

function preload() {
  //Load the data from the csv file.
  data = loadTable(fileName, "csv", "header");
}

function setup() {
  //Set the size of the canvas
  createCanvas(1200, 700);
  currentColor = color(255);
}

function draw() {
  //Set the background color to black
  background(0);
  //Set the origin point of drawing to the center of the canvas
  translate(width / 2, height / 2);
  //Set text-alignment to the center
  textAlign(CENTER, CENTER);

  textSize(16);

  drawZeroCircle();
  drawZeroSign();

  drawOneCircle();
  drawOneSign();

  drawMonthCircle();

  drawMonths();

  drawYear(currentRow);

  drawLines(currentRow);

  drawUntil();
}

function drawUntil() {
  currentMonth = currentMonth + 1;
  if (currentMonth == months.length) {
    currentMonth = 0;
    currentRow++;
    if (currentRow == data.getRowCount()) {
      noLoop();
    }
  }
  //frameRate(10);
}

function drawLines(currentRow) {
  beginShape();
  noFill();
  stroke(255);
  let firstValue = true;

  for (let j = 0; j < currentRow; j++) {
    let row = data.getRow(j);
    let totalMonths = months.length;

    if (j == currentRow - 1) {
      totalMonths = currentMonth;
    }

    for (let i = 0; i < totalMonths; i++) {
      let anomaly = row.get(months[i]);
      if (anomaly !== "***") {
        let angle = map(i, 0, months.length, 0, TWO_PI) - PI / 3;

        let pr = map(Number(previousAnomaly), 0, 1, zeroRadius, oneRadius);
        let r = map(Number(anomaly), 0, 1, zeroRadius, oneRadius);

        let x1 = r * cos(angle);
        let y1 = r * sin(angle);

        let x2 = pr * cos(angle - PI / 6);
        let y2 = pr * sin(angle - PI / 6);

      
        if (!firstValue) {
          let avg =  (Number(anomaly)+Number(previousAnomaly))*0.5;
          let cold = color(0,0,255);
          let warm = color(255,0,0);
          let zero = color(255);
          let lineColor = zero;

          if(avg < 0){
            lineColor = lerpColor(zero,cold,abs(avg));
          }else{
            lineColor = lerpColor(zero,warm,abs(avg));
          }

          currentColor = lineColor;
          
          stroke(lineColor);        
          line(x1, y1, x2, y2);
        }

        firstValue = false;
        previousAnomaly = anomaly;
      }
    }
  }

  endShape();
}

function drawYear(currentRow) {
  let year = data.getRow(currentRow).get("Year");
  fill(currentColor);
  textSize(22);
  text(year, 0, 0);
}

function drawZeroCircle() {
  //Set Drawing Color White
  stroke(255);
  //Set the width of the stroke 2
  strokeWeight(2);
  //Don't fill the Shap
  noFill();
  //Draw Circle
  circle(0, 0, zeroRadius * 2);
}

function drawZeroSign() {
  //Draw Text, fill brush
  fill(255);
  noStroke();
  text("0°", zeroRadius + shift, 0);
}

function drawOneCircle() {
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, oneRadius * 2);
}

function drawOneSign() {
  fill(255);
  noStroke();
  text("1°", oneRadius + shift, 0);
}

function drawMonthCircle() {
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, 550);
}

function drawMonths() {
  for (let i = 0; i < months.length; i++) {
    noStroke();
    fill(255);
    textSize(24);

    let angle = map(i, 0, months.length, 0, TWO_PI);
    push();
    let x = 285 * cos(angle);
    let y = 285 * sin(angle);
    //console.log(`(${x},${y}) ${months[i]}`);
    translate(x, y);
    rotate(angle + PI / 2);
    text(months[i], 0, 0);
    pop();
  }
}
