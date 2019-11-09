var c = document.getElementById("myCanvas");
c.addEventListener("click", addPoint);
var ctx = c.getContext("2d");
var points = Array();
var count = 0;

function addPoint(event) {
    var x = event.clientX - c.getBoundingClientRect().left;
    var y = event.clientY - c.getBoundingClientRect().top;
    points.push([x, y]);
    makePoint(x, y);
    makeLine();
}

function makePoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    ctx.stroke();
}

function makeLine() {
    if (count != 0) {
        ctx.beginPath();
        ctx.moveTo(points[count - 1][0], points[count - 1][1]);
        ctx.lineTo(points[count][0], points[count][1]);
        ctx.stroke();
    }
    count++;
}