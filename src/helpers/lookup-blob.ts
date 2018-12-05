export function lookupBlob(data: {}, level = 0) {
  level++;

  // Depth limit
  if (level > 4) {
    throw Error('Maximum call stack size exceeded');
  }

  if (!data) {
    return false;
  }

  return Object.keys(data).some((key) => {
    const item = data[key];

    if (item instanceof File || item instanceof Blob) {
      return true;
    } else if (item instanceof Object || Array.isArray(item)) {
      return lookupBlob(item, level);
    }
  });
}
