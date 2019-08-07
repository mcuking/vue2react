import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import Report from './common/util/report';

if (process.env.NODE_ENV === 'production') {
  const VERSION = require('../package.json').version;

  const sentry = Report.getInstance({
    dsn: 'https://0a0164e50f8e459daefbfce3286b4a39@sentry.io/1523680',
    release: VERSION
  });

  window.$sentry = sentry;
}

ReactDOM.render(<App />, document.getElementById('root'));
