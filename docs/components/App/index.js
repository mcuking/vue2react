import React from 'react';
import Header from '../Header';
import CodeEditor from '../CodeEditor';
import { transformCode } from 'src/index.ts';
import initalCode from '../../common/util/initalCode';

import styles from './index.less';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceCode: initalCode,
      targetCode: '',
      error: ''
    };
  }

  handleUpdateCode = code => {
    this.setState({
      sourceCode: code
    });
  };

  handleTransform = () => {
    try {
      const script = transformCode(this.state.sourceCode)[0];
      this.setState({
        targetCode: script,
        error: ''
      });
    } catch (error) {
      console.log(error.message, 'error');
      this.setState({
        error: error.message
      });
    }
  };

  render() {
    const { sourceCode, targetCode, error } = this.state;
    return (
      <div className={styles.app}>
        <Header
          sourceCode={sourceCode}
          targetCode={targetCode}
          handleTransform={this.handleTransform}
          handleUpdateCode={this.handleUpdateCode}
        />
        <div className={styles.container}>
          <div className={styles.sub_container}>
            <CodeEditor
              code={sourceCode}
              handleUpdateCode={this.handleUpdateCode}
            />
          </div>
          <div className={styles.sub_container}>
            <CodeEditor code={targetCode} error={error} readOnly={true} />
          </div>
        </div>
      </div>
    );
  }
}
