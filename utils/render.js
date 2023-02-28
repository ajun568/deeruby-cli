import fs from 'fs-extra';
import path from 'path';
import deepMerge from './deepMerge.js';

const render = async (src, dest) => {
  // 获取文件或目录的具体信息
  const stats = fs.statSync(src);

  // 文件夹处理 -- 递归调用
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      render(path.resolve(src, file), path.resolve(dest, file));
    }
    return;
  }

  // 文件处理
  const fileName = path.basename(src);

  // package.json 合并
  if (fileName === 'package.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'));
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'));
    const pkg = deepMerge(existing, newPackage);
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2)); // 首行缩进为2
    return;
  }
  
  // 复制文件
  fs.copyFileSync(src, dest);
}

export default render;
