import chalk from 'chalk';
import { Log } from './types';

class LogUtil {
  private static instance: LogUtil;

  prefix: string;
  logHistory: Log[];

  private constructor(prefix = '') {
    this.prefix = prefix;
    this.logHistory = [];
  }

  public static getInstance(prefix = '') {
    if (!this.instance) {
      this.instance = new LogUtil(prefix);
    }
    return this.instance;
  }

  public log(msg: string, type = 'error') {
    this.logHistory.push({
      msg,
      type
    });
    if (type === 'error') {
      console.log(chalk.red(`${this.prefix}${msg}`));
      throw msg;
    } else {
      console.log(chalk.green(`${this.prefix}${msg}`));
    }
  }

  public clearHistory() {
    this.logHistory = [];
  }
}

export default LogUtil.getInstance('[Vue-to-React] ');
