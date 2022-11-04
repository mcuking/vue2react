import * as React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';

import * as styles from './index.less';

interface IProps {
  code: string;
  readOnly?: boolean;
  className?: React.CSSProperties;
  onUpdateCode?: (value: string) => void;
}

const CodeEditor: React.FC<IProps> = props => {
  const { code, readOnly, onUpdateCode } = props;

  return (
    <div className={styles.code_editor}>
      <AceEditor
        className={styles.ace_editor}
        mode="javascript"
        theme="tomorrow_night_eighties"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2
        }}
        editorProps={{ $blockScrolling: true }}
        readOnly={readOnly}
        onChange={onUpdateCode}
        value={code}
      />
    </div>
  );
};

export default CodeEditor;
