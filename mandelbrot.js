const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = 800;
const HEIGHT = 600;
ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

const MAX_ITERATIONS = 1000;
const ZOOM_FACTOR = 0.1;

let REAL_START, REAL_END, IMAGINARY_START, IMAGINARY_END;

// Function to generate random numbers
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to calculate the Mandelbrot set for a given complex number
function mandelbrotSet(c) {
  let z = { real: 0, imaginary: 0 };
  let n = 0;

  while (n < MAX_ITERATIONS && (z.real * z.real + z.imaginary * z.imaginary) < 4) {
    const realTemp = z.real * z.real - z.imaginary * z.imaginary + c.real;
    const imaginaryTemp = 2 * z.real * z.imaginary + c.imaginary;
    z.real = realTemp;
    z.imaginary = imaginaryTemp;
    n++;
  }

  return n;
}

// Function to render the Mandelbrot set
function renderMandelbrotSet() {
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      const real = mapValue(x, 0, WIDTH, REAL_START, REAL_END);
      const imaginary = mapValue(y, 0, HEIGHT, IMAGINARY_START, IMAGINARY_END);
      const c = { real, imaginary };
      const iterations = mandelbrotSet(c);

      // Map the number of iterations to a color
      const hue = mapValue(iterations, 0, MAX_ITERATIONS, 0, 360);
      const saturation = 100;
      const lightness = iterations < MAX_ITERATIONS ? 50 : 0;

      // Convert HSL color to RGB color
      const rgbColor = hslToRgb(hue, saturation, lightness);

      // Set the pixel color in the canvas
      ctx.fillStyle = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Function to convert HSL color to RGB color
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Function to handle double-click for zooming
canvas.addEventListener('dblclick', handleZoom);

function handleZoom(event) {
  const canvasRect = canvas.getBoundingClientRect();
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  const real = mapValue(x, 0, WIDTH, REAL_START, REAL_END);
  const imaginary = mapValue(y, 0, HEIGHT, IMAGINARY_START, IMAGINARY_END);

  const realRange = REAL_END - REAL_START;
  const imaginaryRange = IMAGINARY_END - IMAGINARY_START;

  const newRealStart = real - realRange * ZOOM_FACTOR;
  const newRealEnd = real + realRange * ZOOM_FACTOR;
  const newImaginaryStart = imaginary - imaginaryRange * ZOOM_FACTOR;
  const newImaginaryEnd = imaginary + imaginaryRange * ZOOM_FACTOR;

  REAL_START = newRealStart;
  REAL_END = newRealEnd;
  IMAGINARY_START = newImaginaryStart;
  IMAGINARY_END = newImaginaryEnd;

  renderMandelbrotSet();
}

// Function to map values from one range to another
function mapValue(value, inputStart, inputEnd, outputStart, outputEnd) {
  return ((value - inputStart) / (inputEnd - inputStart)) * (outputEnd - outputStart) + outputStart;
}

// Function to generate random parameters for the Mandelbrot set
function generateRandomParameters() {
  REAL_START = getRandomNumber(-2, 2);
  REAL_END = getRandomNumber(-2, 2);
  IMAGINARY_START = getRandomNumber(-2, 2);
  IMAGINARY_END = getRandomNumber(-2, 2);

  renderMandelbrotSet();
}

// Initial rendering of the Mandelbrot set
generateRandomParameters();

// Update the visualization every 1 second
setInterval(generateRandomParameters, 1000);
