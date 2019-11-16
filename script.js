const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let controlPoints = new Array();
let pointsCurve = new Array();
let pointsArr = new Array();
let curves = new Array();
let showPoints = 1;
let showPoli = 1;
let showCurve = 1;
let currentCurve = -1;
let aval = 100;

function startCurve() {
    pointsArr.push(new Array());
    curves = new Array(pointsArr.length);
    controlPoints = new Array();
    currentCurve = pointsArr.length - 1;
    c.addEventListener("click", addPoint);
}

function stopCurve() {
    c.removeEventListener("click", addPoint);
}

function stopEditCurve() {
    c.removeEventListener("click");
}

function nextCurve() {
    if (currentCurve != pointsArr.length - 1) {
        currentCurve++;
    } else {
        currentCurve = 0;
    }
    controlPoints = pointsArr[currentCurve];
}

function previousCurve() {
    if (currentCurve != 0) {
        currentCurve--;
    } else {
        currentCurve = pointsArr.length - 1;
    }
    controlPoints = pointsArr[currentCurve];
}

function editCurve() {
    stopCurve();
    c.addEventListener("click", () => {
        const point = getCoords(event);
        const controlP = isControlPoint(point);
        if (controlP[0]) {
            console.log("vou te mover");
        }
    })

    c.addEventListener("dblclick", () => {
        const point = getCoords(event);
        const controlP = isControlPoint(point);
        if (controlP[0]) {
            deletePoint(controlP[1]);
            updateCanvas();
        }
    })
    
}

function deletePoint(point) {
    for (const curve of pointsArr) {
        for (let i = 0; i < curve.length; i++) {
            if (point === curve[i]) {
                curve.splice(i, 1);
            }
        }
    }
}

function isControlPoint(point) {
    for (const curve of pointsArr) {
        for (const cPoint of curve) {
            const xLimits = cPoint[0]-5 <= point[0] && point[0] <= cPoint[0]+5;
            const yLimits = cPoint[1]-5 <= point[1] && point[1] <= cPoint[1]+5;
            if (xLimits && yLimits) {
                return [true, cPoint];
            }
        }
    }
    return [false];
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

function getCoords(event) {
    const x = event.clientX - c.getBoundingClientRect().left;
    const y = event.clientY - c.getBoundingClientRect().top;
    return [x, y];
}

function addPoint(event) {
    const point = getCoords(event);
    controlPoints.push(point);
    pointsArr[currentCurve] = controlPoints.slice();
    updateCanvas();
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (showPoints)
        drawPoints();

    if (showPoli)
        drawLines(pointsArr, "#FFD848");

    if (showCurve) {
        makeCurve();
        drawLines(curves, "#000000");
    }

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