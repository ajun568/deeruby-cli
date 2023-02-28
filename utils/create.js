import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from './prompts.js';
import chalk from 'chalk';
import render from './render.js';
import ora from 'ora';

// ESM标准 __dirname 处理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace('/utils', '');

const create = async (projectName, args) => {
  const cwd = process.cwd();
  const createDir = path.join(cwd, projectName);

  // 文件夹已存在
  if (fs.existsSync(createDir)) {
    const result = await prompts([
      {
        type: 'toggle',
        name: 'isRewrite',
        message: '该目录已存在，是否覆盖该目录？',
        initial: false,
        active: '是',
        inactive: '否',
      }
    ]);

    if (!result.isRewrite) {
      console.log(`${chalk.red('✖')} 操作被取消`);
      return;
    }

    await fs.remove(createDir);
  }
  fs.mkdirSync(createDir);
  fs.writeFile(path.resolve(cwd, createDir, 'package.json'), JSON.stringify({ name: projectName }, null, 2));
  
  // 用户配置项
  let userSelected = {
    needsTypeScript: false,
    needsRouter: false,
  };

  if (!args.default) {
    const result = await prompts([
      {
        type: 'toggle',
        name: 'needsTypeScript',
        message: '是否使用 TypeScript？',
        initial: false,
        active: '是',
        inactive: '否',
      },
      {
        type: 'toggle',
        name: 'needsRouter',
        message: '是否使用 vue-router？',
        initial: false,
        active: '是',
        inactive: '否',
      },
    ]);
    userSelected = result;
  }

  // loading start
  const spinner = ora('下载中...');
  spinner.start();

  // 基础配置合并
  const src = path.resolve(__dirname, 'template');
  const baseSrc = path.resolve(src, 'base');
  const dest = path.resolve(cwd, createDir);
  render(baseSrc, dest);

  // 基础代码合并
  const codeSrcName = (userSelected.needsTypeScript ? 'typescript-' : '') + (userSelected.needsRouter ? 'router' : 'default');
  const codeSrc = path.resolve(src, 'code', codeSrcName);
  render(codeSrc, dest);

  // 用户配置合并
  if (userSelected.needsTypeScript) {
    const tsConfigSrc = path.resolve(src, 'config/typescript');
    render(tsConfigSrc, dest);
  }
  if (userSelected.needsRouter) {
    const routerConfigSrc = path.resolve(src, 'config/router');
    render(routerConfigSrc, dest);
  }

  // loading end
  spinner.stop();

  console.log(`\nDone. Now run:\n`);
  console.log(chalk.cyan(`cd ${projectName}`));
  console.log(chalk.cyan('npm install'));
  console.log(chalk.cyan('npm run dev'));
}

export default create;
