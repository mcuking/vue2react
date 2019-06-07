import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classes } from '../../common/util';

import styles from './index.less';

const Button = props => {
  let {
    className,
    children,
    href,
    onClick,
    icon,
    reverse,
    selected,
    disabled,
    primary,
    active,
    ...rest
  } = props;

  const iconOnly = !children;
  const enhancedProps = {
    className: classes(
      styles.button,
      reverse && styles.reverse,
      selected && styles.selected,
      disabled && styles.disabled,
      primary && styles.primary,
      active && styles.active,
      iconOnly && styles.icon_only,
      className
    ),
    href: disabled ? null : href,
    onClick: disabled ? null : onClick,
    children: [
      icon &&
        (typeof icon === 'string' ? (
          <div
            className={classes(styles.icon, styles.image)}
            key="icon"
            style={{ backgroundImage: `url(${icon})` }}
          />
        ) : (
          <FontAwesomeIcon
            className={styles.icon}
            fixedWidth
            icon={icon}
            key="icon"
          />
        )),
      children
    ],
    ...rest
  };

  return href ? (
    <a rel="noopener" target="_blank" {...enhancedProps} />
  ) : (
    <div {...enhancedProps} />
  );
};

export default Button;
