import * as React from 'react';
import { usePersist } from 'react-hooks-set';
import { transformCode } from '../../../src/index';
import initalCode from '../../common/util/initalCode';
import ResizableContainer from '../ResizableContainer';
import Header from '../Header';
import CodeEditor from '../CodeEditor';
import Console from '../Console';

import * as styles from './index.less';

const App: React.FC = () => {
  const [sourceCode, setSourceCode, clearSourceCode] = usePersist(
    'sourceCode',
    initalCode,
    true
  );
  const [targetCode, setTargetCode] = React.useState('');
  const [logging, setLogging] = React.useState([]);

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
      console.log(logHistory, 'logHistory');
    } catch (error) {
      console.log(typeof error, 'error1');
      const a = [{ msg: error.toString(), type: 'error' }] as any;
      setLogging(a);
      setTargetCode('');
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
