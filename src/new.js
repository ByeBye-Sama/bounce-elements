import "./styles.css";

let radius = 245;
let speed = 0.5;
let angle = (15 * Math.PI) / 180;

function circleCircle(box1, box2) {
  // get distance between the circle's centers
  // use the Pythagorean Theorem to compute the distance
  let dx = Math.abs(box1.x - box2.x);
  let dy = Math.abs(box1.y - box2.y);
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= radius + radius) {
    return true;
  }
  return false;
}

const findDistance = (fromX, fromY, toX, toY) => {
  const a = Math.abs(fromX - toX);
  const b = Math.abs(fromY - toY);

  return Math.sqrt(a * a + b * b);
};

function circleRect(cx, cy, rx, ry, rw, rh) {
  const midX = rx + rw / 2;
  const midY = ry + rh / 2;
  // Rotate circle's center point back
  const unrotatedCircleX =
    Math.cos(-angle) * (cx - midX) - Math.sin(-angle) * (cy - midY) + midX;
  const unrotatedCircleY =
    Math.sin(-angle) * (cx - midX) + Math.cos(-angle) * (cy - midY) + midY;

  // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
  let closestX;
  let closestY;

  // Find the unrotated closest x point from center of unrotated circle
  if (unrotatedCircleX < rx) closestX = rx;
  else if (unrotatedCircleX > rx + rw) closestX = rx + rw;
  else closestX = unrotatedCircleX;

  // Find the unrotated closest y point from center of unrotated circle
  if (unrotatedCircleY < ry) closestY = ry;
  else if (unrotatedCircleY > ry + rh) closestY = ry + rh;
  else closestY = unrotatedCircleY;

  const distance = findDistance(
    unrotatedCircleX,
    unrotatedCircleY,
    closestX,
    closestY
  );

  if (distance <= radius) {
    return true;
  }
  return false;
}

function collision(circle1, circle2, rect) {
  if (rect === null) {
    const circleCollision = circleCircle(circle1, circle2);
    return circleCollision;
  }

  if (circle1 === null) {
    let { x, y, width, height } = rect;
    // const rectCollision = circleRect(circle2.x, circle2.y, x, y, width, height);
    const rectCollision = circleRect(circle2.x, circle2.y, x, y, width, height);
    return rectCollision;
  }

  if (circle2 === null) {
    let { x, y, width, height } = rect;
    const rectCollision = circleRect(circle1.x, circle1.y, x, y, width, height);
    return rectCollision;
  }
}

// Poor man's box physics update for time step dt:
function doPhysics(boxes, width, height, dt) {
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];

    // Update positions:
    box.x += box.dx * dt;
    box.y += box.dy * dt;

    // Handle boundary collisions:
    if (!box.isCircle) {
      if (box.x < 0) {
        box.x = 0;
        box.dx = -box.dx;
      } else if (box.x + box.width > width) {
        box.x = width - box.width;
        box.dx = -box.dx;
      }
      if (box.y < 0) {
        box.y = 0;
        box.dy = -box.dy;
      } else if (box.y + box.height > height) {
        box.y = height - box.height;
        box.dy = -box.dy;
      }
    } else {
      if (box.x - radius < 0) {
        box.x = 0 + radius;
        box.dx = -box.dx;
      } else if (box.x + radius > width) {
        box.x = width - radius;
        box.dx = -box.dx;
      }
      if (box.y - radius < 0) {
        box.y = 0 + radius;
        box.dy = -box.dy;
      } else if (box.y + radius > height) {
        box.y = height - radius;
        box.dy = -box.dy;
      }
    }
  }

  // Handle box collisions:
  let box1 = boxes[0];
  let box2 = boxes[1];
  let box3 = boxes[2];

  // Check for overlap:
  if (collision(box1, box2, null)) {
    // Swap dx if moving towards each other:
    if (box1.x > box2.x == box1.dx < box2.dx) {
      let swap = box1.dx;
      box1.dx = box2.dx;
      box2.dx = swap;
    }

    // Swap dy if moving towards each other:
    if (box1.y > box2.y == box1.dy < box2.dy) {
      let swap = box1.dy;
      box1.dy = box2.dy;
      box2.dy = swap;
    }
  }

  if (collision(box1, null, box3)) {
    // Swap dx if moving towards each other:
    if (box1.x > box3.x == box1.dx < box3.dx) {
      let swap = box1.dx;
      box1.dx = box3.dx;
      box3.dx = swap;
    }

    // Swap dy if moving towards each other:
    if (box1.y > box3.y == box1.dy < box3.dy) {
      let swap = box1.dy;
      box1.dy = box3.dy;
      box3.dy = swap;
    }
  }

  if (collision(null, box2, box3)) {
    // Swap dx if moving towards each other:
    if (box2.x > box3.x == box2.dx < box3.dx) {
      let swap = box2.dx;
      box2.dx = box3.dx;
      box3.dx = swap;
    }

    // Swap dy if moving towards each other:
    if (box2.y > box3.y == box2.dy < box3.dy) {
      let swap = box2.dy;
      box2.dy = box3.dy;
      box3.dy = swap;
    }
  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize random boxes:
let boxes = [];
for (let i = 0; i < 2; i++) {
  let box = {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    width: radius * 2,
    height: radius * 2,
    dx: (Math.random() - 0.5) * speed,
    dy: (Math.random() - 0.5) * speed,
    isCircle: true,
  };
  boxes.push(box);
}

let rectangle = {
  x: Math.floor(Math.random() * canvas.width),
  y: Math.floor(Math.random() * canvas.height),
  width: 203,
  height: 490,
  dx: (Math.random() - 0.5) * speed,
  dy: (Math.random() - 0.5) * speed,
  isCircle: false,
};
boxes.push(rectangle);

// Update physics at fixed rate:
let last = performance.now();
setInterval(function (time) {
  let now = performance.now();
  doPhysics(boxes, canvas.width, canvas.height, now - last);
  last = now;
}, 50);

function drawRotatedRect(x, y, width, height) {
  // first save the untranslated/unrotated context
  const midX = x + width / 2;
  const midY = y + height / 2;

  context.save();

  context.beginPath();
  // move the rotation point to the center of the rect
  context.translate(midX, midY);
  // rotate the rect
  context.rotate(angle);

  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y]
  //       so the rect needs to be offset accordingly when drawn
  context.rect(-width / 2, -height / 2, width, height);

  context.fillStyle = "black";
  context.fill();

  // restore the context to its untranslated/unrotated state
  context.restore();
}
// Draw animation frames at optimal frame rate:
function draw(now) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "yellow";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];

    // Interpolate position:
    const x = box.x + box.dx * (now - last);
    const y = box.y + box.dy * (now - last);

    if (box.isCircle) {
      context.beginPath();
      context.fillStyle = "black";
      context.arc(x, y, radius, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();
    } else {
      context.beginPath();
      drawRotatedRect(x, y, rectangle.width, rectangle.height);
      context.closePath();
    }
  }

  requestAnimationFrame(draw);
}

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  requestAnimationFrame(draw);
};

resize();
window.addEventListener("resize", resize);
