// Pattern generation utility functions

export function generateNoise(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    
    // Generate Perlin-like noise
    const frequency = 0.01;
    const noise = Math.sin(x * frequency) * Math.cos(y * frequency) * Math.random();
    
    // Create a psychedelic color palette
    const r = Math.sin(noise * 2) * 127 + 128;
    const g = Math.sin(noise * 3 + 2) * 127 + 128;
    const b = Math.sin(noise * 5 + 4) * 127 + 128;
    
    data[i] = r;     // red
    data[i + 1] = g; // green
    data[i + 2] = b; // blue
    data[i + 3] = 255; // alpha
  }

  ctx.putImageData(imageData, 0, 0);
}

export function generateGeometric(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  const numShapes = 100;
  const maxSize = Math.min(width, height) / 2;

  for (let i = 0; i < numShapes; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * maxSize;

    // Create gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `hsla(${Math.random() * 360}, 100%, 50%, 0.8)`);
    gradient.addColorStop(1, `hsla(${Math.random() * 360}, 100%, 50%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Randomly choose between different shapes
    const shapeType = Math.floor(Math.random() * 4);
    switch (shapeType) {
      case 0: // Circle
        ctx.arc(x, y, size, 0, Math.PI * 2);
        break;
      case 1: // Square
        ctx.rect(x - size/2, y - size/2, size, size);
        break;
      case 2: // Triangle
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.lineTo(x - size/2, y + size/2);
        break;
      case 3: // Star
        for (let j = 0; j < 5; j++) {
          const angle = (j * 4 * Math.PI) / 5;
          const x1 = x + Math.cos(angle) * size;
          const y1 = y + Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
        }
        break;
    }

    ctx.fill();
  }
}

export function generateMathematical(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width - centerX;
    const y = Math.floor((i / 4) / width) - centerY;
    
    // Complex mathematical pattern using trigonometric functions
    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    
    const pattern = Math.sin(distance * 0.05) * 
                   Math.cos(angle * 5) * 
                   Math.sin(distance * 0.02 + angle);

    // Create vibrant colors based on the pattern
    const r = Math.sin(pattern * Math.PI) * 127 + 128;
    const g = Math.sin(pattern * Math.PI + 2 * Math.PI/3) * 127 + 128;
    const b = Math.sin(pattern * Math.PI + 4 * Math.PI/3) * 127 + 128;
    
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

export function generateFractal(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const maxIterations = 100;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    
    // Map pixel coordinates to complex plane
    const a = (x - width/2) * 4 / width;
    const b = (y - height/2) * 4 / height;
    
    let ca = a;
    let cb = b;
    let n = 0;
    
    // Julia set iteration
    while (n < maxIterations) {
      const aa = a * a - b * b;
      const bb = 2 * a * b;
      
      // Update values
      ca = aa + 0.355534;  // Real part of c
      cb = bb + 0.337292;  // Imaginary part of c
      
      if (ca * ca + cb * cb > 4) break;
      n++;
    }
    
    // Color based on iteration count
    const hue = (n / maxIterations) * 360;
    const saturation = 100;
    const lightness = n < maxIterations ? 50 : 0;
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness / 100 - c / 2;
    
    let r, g, b;
    if (hue < 60) { r = c; g = x; b = 0; }
    else if (hue < 120) { r = x; g = c; b = 0; }
    else if (hue < 180) { r = 0; g = c; b = x; }
    else if (hue < 240) { r = 0; g = x; b = c; }
    else if (hue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    data[i] = (r + m) * 255;     // red
    data[i + 1] = (g + m) * 255; // green
    data[i + 2] = (b + m) * 255; // blue
    data[i + 3] = 255;           // alpha
  }

  ctx.putImageData(imageData, 0, 0);
}