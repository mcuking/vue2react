import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classes } from '../../common/util/tools';

import * as styles from './index.less';

interface IProps {
  className?: React.CSSProperties;
  children: React.ReactNode;
  href?: string;
  icon?: any;
  reverse?: boolean;
  selected?: boolean;
  disabled?: boolean;
  primary?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const Button: React.FC<IProps> = props => {
  let {
    className,
    children,
    href,
    icon,
    reverse,
    selected,
    disabled,
    primary,
    active,
    onClick,
    ...rest
  } = props;

  const iconOnly = !children;

  const enhancedClassName = classes(
    styles.button,
    reverse && styles.reverse,
    selected && styles.selected,
    disabled && styles.disabled,
    primary && styles.primary,
    active && styles.active,
    iconOnly && styles.icon_only,
    className
  );
  const enhancedChildren = [
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
  ];

  return href ? (
    <a
      rel="noopener"
      target="_blank"
      className={enhancedClassName}
      href={disabled ? undefined : href}
      onClick={disabled ? undefined : onClick}
      children={enhancedChildren}
      {...rest}
    />
  ) : (
    <div
      className={enhancedClassName}
      onClick={disabled ? undefined : onClick}
      children={enhancedChildren}
      {...rest}
    />
  );
};

export default Button;
