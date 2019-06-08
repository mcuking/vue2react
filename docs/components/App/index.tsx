import * as React from 'react';
import { usePersist } from 'react-hooks-set';
import { transformCode } from '../../../src/index';
import initalCode from '../../common/util/initalCode';
import ResizableContainer from '../ResizableContainer';
import Header from '../Header';
import CodeEditor from '../CodeEditor';

import * as styles from './index.less';

const App: React.FC = () => {
  const [sourceCode, setSourceCode, clearSourceCode] = usePersist(
    'sourceCode',
    initalCode,
    true
  );
  const [targetCode, setTargetCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [workspaceWeights, setWorkspaceWeights] = React.useState([1, 1]);
  const [workspaceVisibles, setWorkspaceVisibles] = React.useState([
    true,
    true
  ]);

  const handleUpdateCode = (code: string): void => {
    setSourceCode(code);
  };

  const handleTransformCode = () => {
    try {
      const script = transformCode(sourceCode)[0];
      setTargetCode(script);
      setError('');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleChangeWorkspaceWeights = (workspaceWeights: number[]): void => {
    setWorkspaceWeights(workspaceWeights);
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
        onChangeWeights={handleChangeWorkspaceWeights}
      >
        <CodeEditor code={sourceCode} onUpdateCode={handleUpdateCode} />
        <CodeEditor code={targetCode} error={error} readOnly={true} />
      </ResizableContainer>
    </div>
  );
};

export default App;
