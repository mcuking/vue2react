import React from 'react';
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
} from '../../common/util';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './index.less';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  handleClickFullScreen = () => {
    if (screenfull.enabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  };

  render() {
    const {
      sourceCode,
      targetCode,
      handleTransform,
      handleUpdateCode
    } = this.props;

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
              onClick={this.handleClickFullScreen}
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
                this.inputRef.current.click();
              }}
            >
              <input
                ref={this.inputRef}
                type="file"
                className={styles.select_file_input}
                accept=".vue"
                onChange={() => {
                  readFileIntoMemory(
                    this.inputRef.current,
                    handleUpdateCode,
                    toast
                  );
                }}
              />
              Upload Vue Code
            </Button>
            <Button
              icon={faPlay}
              primary
              onClick={handleTransform}
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
  }
}
