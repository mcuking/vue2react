import * as React from 'react';
import { usePersist } from 'react-hooks-set';
import { transformCode } from '../../../src/index';
import initalCode from '../../common/util/initalCode';
import ResizableContainer from '../ResizableContainer';
import Header from '../Header';
import CodeEditor from '../CodeEditor';
import Console from '../Console';
import { Log } from '../../common/util/types';

import * as styles from './index.less';

const App: React.FC = () => {
  const [sourceCode, setSourceCode, clearSourceCode] = usePersist(
    'sourceCode',
    initalCode,
    true
  );
  const [targetCode, setTargetCode] = React.useState('');
  const [logging, setLogging] = React.useState([] as Log[]);

  const [workspaceWeights, setWorkspaceWeights] = React.useState([2, 2, 1.2]);
  const [workspaceVisibles, setWorkspaceVisibles] = React.useState([
    true,
    true,
    true
  ]);

  const handleUpdateCode = (code: string): void => {
    setSourceCode(code);
  };

  const handleTransformCode = () => {
    try {
      const [script, , logHistory] = transformCode(sourceCode);
      setTargetCode(script);
      setLogging(logHistory);
      logHistory.forEach((log: Log) => {
        window.$sentry && window.$sentry.report(log);
      });
    } catch (error) {
      setTargetCode('');
      setLogging([{ msg: error.toString(), type: 'error' }]);
      window.$sentry &&
        window.$sentry.report({ msg: error.toString(), type: 'error' });
    }
  };

  return (
    <div className={styles.app}>
      <Header
        sourceCode={sourceCode}
        targetCode={targetCode}
        onTransformCode={handleTransformCode}
        onUpdateCode={handleUpdateCode}
      />
      <ResizableContainer
        className={styles.workspace}
        horizontal
        weights={workspaceWeights}
        visibles={workspaceVisibles}
        onChangeWeights={(workspaceWeights: number[]): void =>
          setWorkspaceWeights(workspaceWeights)
        }
      >
        <CodeEditor code={sourceCode} onUpdateCode={handleUpdateCode} />
        <CodeEditor code={targetCode} readOnly={true} />
        <Console logging={logging} title="Console" />
      </ResizableContainer>
    </div>
  );
};

export default App;
