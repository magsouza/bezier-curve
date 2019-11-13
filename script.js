var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var controlPoints = Array();
var pointsCurve = Array();
var pointsArr = Array();
var curves = Array();
var showPoints = 1;
var showPoli = 1;
var showCurve = 1;
var currentCurve = -1;
var aval = 100;

function startCurve() {
    c.addEventListener("click", addPoint);
    pointsArr.push(new Array());
    curves = new Array(pointsArr.length);
    controlPoints = new Array();
    currentCurve++;
}

function stopCurve() {
    c.removeEventListener("click", addPoint);
}

function toggleControlPoints() {
    showPoints = !showPoints;
    updateCanvas();
}

function toggleControlPoli() {
    showPoli = !showPoli;
    updateCanvas();
}
function toggleCurves() {
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
    controlPoints.push([x, y]);
    pointsArr[currentCurve] = controlPoints.slice();
    updateCanvas();
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (showPoints) {
        drawPoints();
    }
    if (showPoli)
        drawLines(pointsArr, "#FFD848");

    makeCurve();
    if (showCurve)
        drawLines(curves, "#000000");

}

function drawPoints() {
    ctx.strokeStyle = "#000000";
    for (let i = 0; i < pointsArr.length; i++) {
        for (let j = 0; j < pointsArr[i].length; j++) {
            ctx.beginPath();
            ctx.arc(pointsArr[i][j][0], pointsArr[i][j][1], 5, 0, 2 * Math.PI);
            ctx.fillRect(pointsArr[i][j][0] - 1.5, pointsArr[i][j][1] - 1.5, 3, 3);
            ctx.stroke();
        }
    }
}

function drawLines(pointsSet, color) {
    ctx.strokeStyle = color;
    for (let i = 0; i < pointsSet.length; i++) {
        for (let j = 0; j < pointsSet[i].length - 1; j++) {
            ctx.beginPath();
            ctx.moveTo(pointsSet[i][j][0], pointsSet[i][j][1]);
            ctx.lineTo(pointsSet[i][j + 1][0], pointsSet[i][j + 1][1]);
            ctx.stroke();
        }
    }
}

function makeCurve() {
    for (let j = 0; j < pointsArr.length; j++) {
        pointsCurve = new Array();
        let point;
        for (let i = 0; i < aval; i++) {
            point = castanhaDeCaju(pointsArr[j], i);
            if (point)
                pointsCurve.push(point);
        }
        pointsCurve.push(pointsArr[j][pointsArr[j].length - 1]);
        curves[j] = pointsCurve;
    }
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