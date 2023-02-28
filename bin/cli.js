#! /usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import create from '../utils/create.js';

program
  .on('--help', () => {
    console.log();
    console.log(`运行 ${chalk.cyan(`deeruby-cli <command> --help`)} 查看帮助文档`);
    console.log();
  })

program
  .command('create <project>')
  .description('创建项目')
  .option('-d, --default', '跳过提示并使用默认配置', false)
  .action((project, args) => create(project, args))

program.parse(process.argv);
