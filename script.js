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
    try {
        stopEditCurve();
    } finally {
        pointsArr.push(new Array());
        curves = new Array(pointsArr.length);
        controlPoints = new Array();
        currentCurve = pointsArr.length - 1;
        updateCanvas();
        c.addEventListener("click", addPoint);
    }
}

function stopDrawCurve() {
    c.removeEventListener("click", addPoint);
}


function stopEditCurve() {
    c.removeEventListener("mousedown", movePoint);
    c.removeEventListener("dblclick", deletePoint);
}

function deleteCurve() {
    if (currentCurve <= -1) {
        alert("Não há mais curvas para deletar!");
    } else {
        for (let i = currentCurve; i < pointsArr.length - 1; i++) {
            pointsArr[i] = pointsArr[i + 1].slice();
        }
        pointsArr.pop();
        previousCurve();
    }
}

function nextCurve() {
    if (currentCurve != pointsArr.length - 1) {
        currentCurve++;
    } else {
        currentCurve = 0;
    }
    controlPoints = pointsArr[currentCurve];
    updateCanvas();
}

function previousCurve() {
    if (currentCurve != 0) {
        currentCurve--;
    } else {
        currentCurve = pointsArr.length - 1;
    }
    controlPoints = pointsArr[currentCurve];
    updateCanvas();
}

function editCurve() {
    try {
        stopDrawCurve();
        stopEditCurve();
    } finally {
        c.addEventListener("mousedown", movePoint = (event) => {
            const point = getCoords(event);
            const controlP = isControlPoint(point);
            if (controlP[0]) {
                c.addEventListener("mouseup", onMouseUp = () => {
                    c.removeEventListener('mouseup', onMouseUp);
                    c.removeEventListener('mousemove', onMouseMove);
                });

                c.addEventListener("mousemove", onMouseMove = (event) => {
                    pointsArr[controlP[2]][controlP[3]][0] = event.clientX - c.getBoundingClientRect().left;
                    pointsArr[controlP[2]][controlP[3]][1] = event.clientY - c.getBoundingClientRect().top;
                    updateCanvas();
                });
            }
        });

        c.addEventListener("dblclick", deletePoint = (event) => {
            const point = getCoords(event);
            const controlP = isControlPoint(point);
            if (controlP[0]) {
                deleteControlPoint(controlP[2], controlP[3]);
                updateCanvas();
            }
        });
    }

}

function deleteControlPoint(i, j) {
    pointsArr[i].splice(j, 1);
}

function isControlPoint(point) {
    for (let i = 0; i < pointsArr.length; i++) {
        for (let j = 0; j < pointsArr[i].length; j++) {
            const xLimits = pointsArr[i][j][0] - 5 <= point[0] && point[0] <= pointsArr[i][j][0] + 5;
            const yLimits = pointsArr[i][j][1] - 5 <= point[1] && point[1] <= pointsArr[i][j][1] + 5;
            if (xLimits && yLimits) {
                return [true, pointsArr[i][j], i, j];
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
        drawLines(pointsArr, "#84BDFF", "#FF92F3");

    if (showCurve) {
        makeCurve();
        drawLines(curves, "#721E96", "#C340FF");
    }
}

function drawPoints() {
    for (let i = 0; i < pointsArr.length; i++) {
        if (i != currentCurve) {
            ctx.strokeStyle = "#4B7DB6";
            ctx.fillStyle = "#4B7DB6";
        } else {
            ctx.strokeStyle = "#FF4040";
            ctx.fillStyle = "#FF4040";
        }
        for (let j = 0; j < pointsArr[i].length; j++) {
            ctx.beginPath();
            ctx.arc(pointsArr[i][j][0], pointsArr[i][j][1], 5, 0, 2 * Math.PI);
            ctx.fillRect(pointsArr[i][j][0] - 1.5, pointsArr[i][j][1] - 1.5, 3, 3);
            ctx.stroke();
        }
    }
}

function drawLines(pointsSet, color, selectedColor) {
    for (let i = 0; i < pointsSet.length; i++) {
        if (i != currentCurve)
            ctx.strokeStyle = color;
        else
            ctx.strokeStyle = selectedColor;

        for (let j = 0; j < pointsSet[i].length - 1; j++) {
            ctx.beginPath();
            ctx.moveTo(pointsSet[i][j][0], pointsSet[i][j][1]);
            ctx.lineTo(pointsSet[i][j + 1][0], pointsSet[i][j + 1][1]);
            ctx.stroke();
        }
    }
}

function makeCurve() {
    curves = new Array();
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