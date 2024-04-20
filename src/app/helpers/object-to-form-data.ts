export function objectToFormData(target, formData = new FormData(), namespace = null, level = 0) {
  level++;

  // Depth limit
  if (level > 10) {
    throw Error('Maximum call stack size exceeded');
  }

  if (target === undefined || target === null) {
    return formData;
  }

  Object.keys(target).forEach((property) => {
    const item = target[property];
    const formKey = namespace ? `${namespace}[${property}]` : property;
    const isBlob = item instanceof Blob;

    if (item && typeof item === 'object' && !isBlob) {
      objectToFormData(item, formData, formKey, level);
    } else {
      if (isBlob && item && (item as any).name) {
        formData.append(formKey, item, (item as any).name);
      } else {
        formData.append(formKey, item);
      }
    }

  });

  return formData;
}
