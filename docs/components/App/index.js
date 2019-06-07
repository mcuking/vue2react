import React, { useState, useRef } from 'react';
import { usePersist } from 'react-hooks-set';
import { transformCode } from 'src/index.ts';
import initalCode from '../../common/util/initalCode';
import ResizableContainer from '../ResizableContainer';
import Header from '../Header';
import CodeEditor from '../CodeEditor';

import styles from './index.less';

const App = () => {
  const [sourceCode, setSourceCode, clearSourceCode] = usePersist(
    'sourceCode',
    initalCode,
    true
  );
  const [targetCode, setTargetCode] = useState('');
  const [error, setError] = useState('');
  const [workspaceWeights, setWorkspaceWeights] = useState([1, 1]);
  const [workspaceVisibles, setWorkspaceVisibles] = useState([true, true]);
  const aceEditorRef = useRef(null);

  const handleUpdateCode = code => {
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

  const handleChangeWorkspaceWeights = workspaceWeights => {
    setWorkspaceWeights(workspaceWeights);
    aceEditorRef.current.editor.resize();
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
        <CodeEditor
          ref={aceEditorRef}
          code={sourceCode}
          onUpdateCode={handleUpdateCode}
        />
        <CodeEditor
          ref={aceEditorRef}
          code={targetCode}
          error={error}
          readOnly={true}
        />
      </ResizableContainer>
    </div>
  );
};

export default App;
