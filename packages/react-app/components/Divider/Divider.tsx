import React from 'react';
import styles from './divider.module.css';

interface DividerProps {
  variant:
    | 'thin-primary-small'
    | 'thin-primary-medium'
    | 'thin-primary-large'
    | 'thin-secondary-small'
    | 'thin-secondary-medium'
    | 'thin-secondary-large'
    | 'thin-tertiary-small'
    | 'thin-tertiary-medium'
    | 'thin-tertiary-large'
    | 'thinker-primary-small'
    | 'thinker-primary-medium'
    | 'thinker-primary-large'
    | 'thinker-secondary-small'
    | 'thinker-secondary-medium'
    | 'thinker-secondary-large'
    | 'thinker-tertiary-small'
    | 'thinker-tertiary-medium'
    | 'thinker-tertiary-large'
    | 'thick-primary-small'
    | 'thick-primary-medium'
    | 'thick-primary-large'
    | 'thick-secondary-small'
    | 'thick-secondary-medium'
    | 'thick-secondary-large'
    | 'thick-tertiary-small'
    | 'thick-tertiary-medium'
    | 'thick-tertiary-large';
}

const Divider: React.FC<DividerProps> = ({ variant }) => {
  const baseClass = styles.divider;
  const variantClass = variant
    .split('-')
    .map((cls) => {
      return styles[cls];
    })
    .join(' ');

  const className = `${baseClass} ${variantClass}`;
  return <div className={className}></div>;
};

export default Divider;
