import * as React from 'react';
import screenfull from 'screenfull';
import {
  faClipboardCheck,
  faExpandArrowsAlt,
  faPlay,
  faUpload,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Button from '../Button';
import {
  readFileIntoMemory,
  transformDataToDownloadFile,
  copyDataToClipBoard
} from '../../common/util/tools';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as styles from './index.less';

interface IProps {
  sourceCode: string;
  targetCode: string;
  className?: React.CSSProperties;
  onTransformCode: () => void;
  onUpdateCode: (value: string) => void;
}

const Header: React.FC<IProps> = props => {
  const inputEl = React.useRef<HTMLInputElement>(null);

  const { sourceCode, targetCode, onTransformCode, onUpdateCode } = props;

  const handleClickFullScreen = (): void => {
    if (screenfull && screenfull.enabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit().catch(err => console.log(err));
      } else {
        screenfull.request().catch(err => console.log(err));
      }
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.row}>
        <div className={styles.section}>
          <Button
            className={styles.title_bar}
            primary
            href="https://github.com/mcuking/vue2react"
          >
            VUE2REACT
          </Button>
        </div>
        <div className={styles.section}>
          <Button
            icon={faGithub}
            primary
            href="https://github.com/mcuking/vue2react"
          >
            Fork me on Github
          </Button>
          <Button
            icon={faExpandArrowsAlt}
            primary
            onClick={handleClickFullScreen}
          >
            Full Screen
          </Button>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.section}>
          <Button
            icon={faUpload}
            primary
            onClick={() => {
              if (inputEl.current) {
                inputEl.current.click();
              }
            }}
          >
            <input
              ref={inputEl}
              type="file"
              className={styles.select_file_input}
              accept=".vue"
              onChange={() => {
                readFileIntoMemory(inputEl, onUpdateCode, toast);
              }}
            />
            Upload Vue Code
          </Button>
          <Button
            icon={faPlay}
            primary
            onClick={onTransformCode}
            disabled={!sourceCode}
          >
            Compile
          </Button>
        </div>
        <div className={styles.section}>
          <Button
            icon={faClipboardCheck}
            primary
            onClick={() => {
              copyDataToClipBoard(targetCode, result => {
                result && toast('Copied!', { type: 'success' });
              });
            }}
            disabled={!targetCode}
          >
            Copy React Code
          </Button>
          <Button
            icon={faDownload}
            primary
            onClick={() => {
              transformDataToDownloadFile(targetCode);
            }}
            disabled={!targetCode}
          >
            Download React Code
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Header;
