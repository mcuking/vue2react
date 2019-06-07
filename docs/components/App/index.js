import React, { useState } from 'react';
import { usePersist } from 'react-hooks-set';
import { transformCode } from 'src/index.ts';
import initalCode from '../../common/util/initalCode';
import Header from '../Header';
import CodeEditor from '../CodeEditor';

import styles from './index.less';

export default function App() {
  const [sourceCode, setSourceCode, clearSourceCode] = usePersist(
    'sourceCode',
    initalCode,
    true
  );
  const [targetCode, setTargetCode] = useState('');
  const [error, setError] = useState('');

  const handleUpdateCode = code => {
    setSourceCode(code);
  };

  const handleTransform = () => {
    try {
      const script = transformCode(sourceCode)[0];
      setTargetCode(script);
      setError('');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  return (
    <div className={styles.app}>
      <Header
        sourceCode={sourceCode}
        targetCode={targetCode}
        handleTransform={handleTransform}
        handleUpdateCode={handleUpdateCode}
      />
      <div className={styles.container}>
        <div className={styles.sub_container}>
          <CodeEditor code={sourceCode} handleUpdateCode={handleUpdateCode} />
        </div>
        <div className={styles.sub_container}>
          <CodeEditor code={targetCode} error={error} readOnly={true} />
        </div>
      </div>
    </div>
  );
}
