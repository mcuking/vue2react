import * as React from 'react';
import { classes } from '../../common/util/tools';
import * as styles from './index.less';

interface IProps {
  horizontal: boolean;
  className?: React.CSSProperties;
  onResize: (
    parentElement: HTMLDivElement,
    clientX: number,
    clientY: number
  ) => void;
}

const Divider: React.FC<IProps> = props => {
  const { className, horizontal, onResize } = props;
  let target: EventTarget;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    target = event.target;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (onResize) {
      onResize((target as any).parentElement, event.clientX, event.clientY);
    }
  };

  const handleMouseUp = (): void => {
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
