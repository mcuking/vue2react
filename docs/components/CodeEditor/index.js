import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

import styles from './index.less';

const CodeEditor = React.forwardRef((props, ref) => {
  const { code, readOnly, onUpdateCode } = props;

  return (
    <div className={styles.code_editor}>
      <AceEditor
        className={styles.ace_editor}
        ref={ref}
        mode="javascript"
        theme="tomorrow_night_eighties"
        editorProps={{ $blockScrolling: true }}
        readOnly={readOnly}
        onChange={onUpdateCode}
        value={code}
      />
    </div>
  );
});

export default CodeEditor;
