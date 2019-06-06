import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classes } from '../../common/util';

import './index.less';

export default function Button(props) {
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
      'button',
      reverse && 'reverse',
      selected && 'selected',
      disabled && 'disabled',
      primary && 'primary',
      active && 'active',
      iconOnly && 'icon_only',
      className
    ),
    href: disabled ? null : href,
    onClick: disabled ? null : onClick,
    children: [
      icon &&
        (typeof icon === 'string' ? (
          <div
            className="icon image"
            key="icon"
            style={{ backgroundImage: `url(${icon})` }}
          />
        ) : (
          <FontAwesomeIcon className="icon" fixedWidth icon={icon} key="icon" />
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
}
