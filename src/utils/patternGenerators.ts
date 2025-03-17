// Pattern generation utility functions

export function generateNoise(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixelX = (i / 4) % width;
    const pixelY = Math.floor((i / 4) / width);
    
    // Generate Perlin-like noise
    const frequency = 0.01;
    const noise = Math.sin(pixelX * frequency) * Math.cos(pixelY * frequency) * Math.random();
    
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
    const shapeX = Math.random() * width;
    const shapeY = Math.random() * height;
    const size = Math.random() * maxSize;

    // Create gradient
    const gradient = ctx.createRadialGradient(shapeX, shapeY, 0, shapeX, shapeY, size);
    gradient.addColorStop(0, `hsla(${Math.random() * 360}, 100%, 50%, 0.8)`);
    gradient.addColorStop(1, `hsla(${Math.random() * 360}, 100%, 50%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Randomly choose between different shapes
    const shapeType = Math.floor(Math.random() * 4);
    switch (shapeType) {
      case 0: // Circle
        ctx.arc(shapeX, shapeY, size, 0, Math.PI * 2);
        break;
      case 1: // Square
        ctx.rect(shapeX - size/2, shapeY - size/2, size, size);
        break;
      case 2: // Triangle
        ctx.moveTo(shapeX, shapeY - size/2);
        ctx.lineTo(shapeX + size/2, shapeY + size/2);
        ctx.lineTo(shapeX - size/2, shapeY + size/2);
        break;
      case 3: // Star
        for (let j = 0; j < 5; j++) {
          const angle = (j * 4 * Math.PI) / 5;
          const starX = shapeX + Math.cos(angle) * size;
          const starY = shapeY + Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(starX, starY);
          else ctx.lineTo(starX, starY);
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
    const pixelX = (i / 4) % width - centerX;
    const pixelY = Math.floor((i / 4) / width) - centerY;
    
    // Complex mathematical pattern using trigonometric functions
    const distance = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
    const angle = Math.atan2(pixelY, pixelX);
    
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
    const pixelX = (i / 4) % width;
    const pixelY = Math.floor((i / 4) / width);
    
    // Map pixel coordinates to complex plane
    let zReal = (pixelX - width/2) * 4 / width;
    let zImag = (pixelY - height/2) * 4 / height;
    
    let n = 0;
    
    // Julia set iteration
    while (n < maxIterations) {
      const zRealSquared = zReal * zReal;
      const zImagSquared = zImag * zImag;
      
      if (zRealSquared + zImagSquared > 4) break;
      
      // z = z^2 + c, where c is a complex constant
      const nextZReal = zRealSquared - zImagSquared + 0.355534;
      zImag = 2 * zReal * zImag + 0.337292;
      zReal = nextZReal;
      
      n++;
    }
    
    // Color based on iteration count
    const hue = (n / maxIterations) * 360;
    const saturation = 100;
    const lightness = n < maxIterations ? 50 : 0;
    
    // Convert HSL to RGB
    const chroma = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const huePrime = hue / 60;
    const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
    const lightnessAdjustment = lightness / 100 - chroma / 2;
    
    let red = 0;
    let green = 0;
    let blue = 0;
    
    if (huePrime >= 0 && huePrime < 1) {
      red = chroma;
      green = secondComponent;
    } else if (huePrime >= 1 && huePrime < 2) {
      red = secondComponent;
      green = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
      green = chroma;
      blue = secondComponent;
    } else if (huePrime >= 3 && huePrime < 4) {
      green = secondComponent;
      blue = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      red = secondComponent;
      blue = chroma;
    } else {
      red = chroma;
      blue = secondComponent;
    }
    
    data[i] = (red + lightnessAdjustment) * 255;     // red
    data[i + 1] = (green + lightnessAdjustment) * 255; // green
    data[i + 2] = (blue + lightnessAdjustment) * 255;  // blue
    data[i + 3] = 255;                                  // alpha
  }

  ctx.putImageData(imageData, 0, 0);
}