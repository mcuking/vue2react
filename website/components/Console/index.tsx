import * as React from 'react';
import { classes } from '../../common/util/tools';

import * as styles from './index.less';

interface IProps {
  logging: any[];
  title: string;
}

const Console: React.FC<IProps> = props => {
  const { logging, title } = props;

  return (
    <div className={styles.console_wrapper}>
      <span className={styles.console_title}>{title}</span>
      {logging.map((log, i) => (
        <div
          key={i}
          className={classes(log.type === 'error' && styles.console_error_item)}
        >
          <span
            className={styles.console_type}
          >{`[${log.type.toUpperCase()}]  `}</span>
          <span className={styles.console_msg}>{log.msg}</span>
        </div>
      ))}
    </div>
  );
};

export default Console;
