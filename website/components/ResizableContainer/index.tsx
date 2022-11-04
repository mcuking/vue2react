import * as React from 'react';
import { classes } from '../../common/util/tools';
import Divider from '../Divider';
import * as styles from './index.less';

interface IProps {
  horizontal: boolean;
  visibles: boolean[];
  weights: number[];
  className?: React.CSSProperties;
  onChangeWeights?: (value: number[]) => void;
  children: React.ReactNodeArray;
}

const ResizableContainer: React.FC<IProps> = props => {
  const {
    horizontal,
    visibles,
    weights,
    children,
    className,
    onChangeWeights
  } = props;

  const handleResize = (
    prevIndex: number,
    index: number,
    targetElement: HTMLDivElement,
    clientX: number,
    clientY: number
  ): void => {
    const weights = [...props.weights];
    const { left, top } = targetElement.getBoundingClientRect();
    const {
      offsetWidth,
      offsetHeight
    } = targetElement.parentElement as HTMLDivElement;
    const position = horizontal ? clientX - left : clientY - top;
    const containerSize = horizontal ? offsetWidth : offsetHeight;

    let totalWeight = 0;
    let subtotalWeight = 0;
    weights.forEach((weight, i) => {
      if (visibles && !visibles[i]) return;
      totalWeight += weight;
      if (i < index) subtotalWeight += weight;
    });
    const newWeight = (position / containerSize) * totalWeight;
    let deltaWeight = newWeight - subtotalWeight;
    deltaWeight = Math.max(deltaWeight, -weights[prevIndex]);
    deltaWeight = Math.min(deltaWeight, weights[index]);
    weights[prevIndex] += deltaWeight;
    weights[index] -= deltaWeight;
    if (onChangeWeights) {
      onChangeWeights(weights);
    }
  };

  const elements: React.ReactNodeArray = [];
  let lastIndex = -1;
  const totalWeight = weights
    .filter((weight, i) => !visibles || visibles[i])
    .reduce((sumWeight, weight) => sumWeight + weight, 0);
  children.forEach((child: React.ReactNode, i: number) => {
    if (!visibles || visibles[i]) {
      if (~lastIndex) {
        const prevIndex = lastIndex;
        elements.push(
          <Divider
            key={`divider-${i}`}
            horizontal={horizontal}
            onResize={(target, dx, dy) =>
              handleResize(prevIndex, i, target, dx, dy)
            }
          />
        );
      }
      elements.push(
        <div
          key={i}
          className={classes(styles.wrapper)}
          style={{
            flexGrow: weights[i] / totalWeight,
            position: 'relative'
          }}
        >
          {child}
        </div>
      );
      lastIndex = i;
    }
  });

  return (
    <div
      className={classes(
        styles.resizable_container,
        horizontal && styles.horizontal,
        className
      )}
    >
      {elements}
    </div>
  );
};

export default ResizableContainer;
