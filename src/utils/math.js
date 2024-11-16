export function offset(index) {
  let stagger;

  switch (index) {
    case 0:
      stagger = 1.1;
      break;
    case 1:
      stagger = 1.15;
      break;
    case 2:
      stagger = 1.2;
      break;
    case 3:
      stagger = 1.25;
      break;
    case 4:
      stagger = 1.3;
      break;
    case 5:
      stagger = 1.35;
      break;
    default:
      stagger = null;
  }

  return stagger;
}

export function findX(width, scale, left, size, extra, x = 0) {
  return -width / 2 + scale / 2 + ((left + x) / size) * width + extra;
}

export function findY(height, scale, top, size, extra, stagger, y = 0) {
  // return (((height / 2 + (scale / 2) + ((top - y * stagger) / size) * height + extra)))
  return height / 2 - scale / 2 - ((top - y * stagger) / size) * height + extra;
}

// (((-viewport.width / 2 + (mesh.current.scale.x / 2) + ((bounds.current.left + x) / size.width) * viewport.width + extra.current.x)))
