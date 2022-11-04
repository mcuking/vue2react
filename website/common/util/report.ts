import * as Sentry from '@sentry/browser';
import { anyObject, Log } from './types';

const levalMap: anyObject = {
  log: Sentry.Severity.Log,
  info: Sentry.Severity.Info,
  error: Sentry.Severity.Error
};

class Report {
  private static instance: Report;

  options: anyObject;

  private constructor(options = {}) {
    this.options = options;
  }

  public static getInstance(options = {}) {
    if (!this.instance) {
      this.instance = new Report(options);
      this.instance.install();
    }
    return this.instance;
  }

  /**
   * init
   */
  private install() {
    Sentry.init({
      dsn: this.options.dsn,
      release: this.options.release
    });
  }

  /**
   * report to sentry
   */
  public report(log: Log) {
    Sentry.withScope(scope => {
      scope.setLevel(levalMap[log.type]);
      Sentry.captureException(log.msg);
    });
  }
}

export default Report;
