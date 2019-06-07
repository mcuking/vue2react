import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

import styles from './index.less';

export default function CodeEditor(props) {
  const { code, readOnly, handleUpdateCode } = props;

  return (
    <div className={styles.code_editor}>
      <AceEditor
        className={styles.ace_editor}
        mode="javascript"
        theme="tomorrow_night_eighties"
        editorProps={{ $blockScrolling: true }}
        readOnly={readOnly}
        onChange={handleUpdateCode}
        value={code}
      />
    </div>
  );
}
