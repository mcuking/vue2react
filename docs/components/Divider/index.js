import React from 'react';
import { classes } from '../../common/util';
import styles from './index.less';

const Divider = props => {
  const { className, horizontal, onResize } = props;
  let target;

  const handleMouseDown = e => {
    target = e.target;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = e => {
    if (onResize) {
      onResize(target.parentElement, e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={classes(
        styles.divider,
        horizontal ? styles.horizontal : styles.vertical,
        className
      )}
      onMouseDown={handleMouseDown}
    />
  );
};

export default Divider;
