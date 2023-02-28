// 判断是否为对象
const isObject = val => val && typeof val === 'object';
// 合并数组并去重
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));

// 深拷贝
const deepMerge = (target, obj) => {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key];
    const newVal = obj[key];

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal);
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal);
    } else {
      target[key] = newVal;
    }
  }
  return target;
}

export default deepMerge;
