var c = document.getElementById("myCanvas");
c.addEventListener("click", addPoint);
var ctx = c.getContext("2d");
var showPoints = 1;
var showPoli = 1;
var showCurve = 1;
var points = Array();
var pointsCurve = Array();
var Curves = Array();
var aval = 100;

function toggleControlPoints(){
    showPoints = !showPoints;
    updateCanvas();
}

function toggleControlPoli(){
    showPoli = !showPoli;
    updateCanvas();
}
function toggleCurves(){
    showCurve = !showCurve;
    updateCanvas();
}

function setAval() {
    aval = document.getElementById("nAvaliacoes").value;
    updateCanvas();
}

function addPoint(event) {
    var x = event.clientX - c.getBoundingClientRect().left;
    var y = event.clientY - c.getBoundingClientRect().top;
    points.push([x, y]);
    updateCanvas();
}

function updateCanvas() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    if(showPoints){
        drawPoints();
    }
    if (points.length > 1) {
        if(showPoli)
            drawLines(points, "#FFD848");
        
        pointsCurve = new Array();
        makeCurve();
        if(showCurve)
            drawLines(pointsCurve, "#000000");
    } 
}

function drawPoints() {
    ctx.strokeStyle = "#000000";
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i][0], points[i][1], 5, 0, 2 * Math.PI);
        ctx.fillRect(points[i][0] - 1.5, points[i][1] - 1.5, 3, 3);
        ctx.stroke();
    }
}

function drawLines(pointsSet, color) {
    ctx.strokeStyle = color;
    for (let j = 0; j < pointsSet.length - 1; j++) {
        ctx.beginPath();
        ctx.moveTo(pointsSet[j][0], pointsSet[j][1]);
        ctx.lineTo(pointsSet[j + 1][0], pointsSet[j + 1][1]);
        ctx.stroke();
    }
}

function makeCurve() {
    let point;
    for (let i = 0; i < aval; i++) {
        point = castanhaDeCaju(points, i);
        if (point)
            pointsCurve.push(point);
    }
    pointsCurve.push(points[points.length - 1]);
}

function castanhaDeCaju(anchorPoints, i) {
    if (anchorPoints.length > 1) {
        let point;
        let aux = new Array();
        for (let j = 0; j < anchorPoints.length - 1; j++) {
            point = new Array([-1, -1]);
            point[0] = anchorPoints[j][0] * (1 - (i / aval)) + anchorPoints[j + 1][0] * (i / aval);
            point[1] = anchorPoints[j][1] * (1 - (i / aval)) + anchorPoints[j + 1][1] * (i / aval);
            aux.push(point);
        }
        return castanhaDeCaju(aux, i);
    } else {
        return anchorPoints[0];
    }
}