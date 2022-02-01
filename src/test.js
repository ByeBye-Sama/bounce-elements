const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rectX = 100;
const rectY = 100;
const rectWidth = 200;
const rectHeight = 100;
const circleRadius = 20;
const rectMidPointX = rectX + rectWidth / 2;
const rectMidPointY = rectY + rectHeight / 2;
const angle = Math.PI / 4;
let circleX;
let circleY;

canvas.addEventListener("mousemove", (e) => {
  circleX = e.clientX;
  circleY = e.clientY;

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  calculateIntersection();
});

ctx.save();

//ctx.fillRect(100, 100, 100, 100);
ctx.strokeStyle = "black";
ctx.translate(rectMidPointX, rectMidPointY);
ctx.rotate(angle);
ctx.translate(-rectMidPointX, -rectMidPointY);
ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
ctx.restore();

// Determine collision
let collision = false;

const findDistance = (fromX, fromY, toX, toY) => {
  const a = Math.abs(fromX - toX);
  const b = Math.abs(fromY - toY);

  return Math.sqrt(a * a + b * b);
};

function calculateIntersection() {
  // Rotate circle's center point back
  const unrotatedCircleX =
    Math.cos(-angle) * (circleX - rectMidPointX) -
    Math.sin(-angle) * (circleY - rectMidPointY) +
    rectMidPointX;
  const unrotatedCircleY =
    Math.sin(-angle) * (circleX - rectMidPointX) +
    Math.cos(-angle) * (circleY - rectMidPointY) +
    rectMidPointY;

  // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
  let closestX, closestY;

  // Find the unrotated closest x point from center of unrotated circle
  if (unrotatedCircleX < rectX) closestX = rectX;
  else if (unrotatedCircleX > rectX + rectWidth) closestX = rectX + rectWidth;
  else closestX = unrotatedCircleX;

  // Find the unrotated closest y point from center of unrotated circle
  if (unrotatedCircleY < rectY) closestY = rectY;
  else if (unrotatedCircleY > rectY + rectHeight) closestY = rectY + rectHeight;
  else closestY = unrotatedCircleY;

  const distance = findDistance(
    unrotatedCircleX,
    unrotatedCircleY,
    closestX,
    closestY
  );
  if (distance < circleRadius) collision = true;
  // Collision
  else collision = false;

  console.log("collision", collision);
}
