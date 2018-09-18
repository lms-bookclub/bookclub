import * as React from 'react';

export interface StarIconProps {
  size?: number;
  fill?: string;
  stroke?: string;
  className?: string;
  onClick?: any;
}

export const StarIcon = (props: StarIconProps) => {
  const { size, fill, stroke, className, onClick } = {
    size: 48,
    fill: 'none',
    stroke: '#000',
    className: 'i-star',
    onClick: ()=>{},
    ...props,
  };
  return (
    <svg onClick={onClick} className={className} enableBackground='new 0 0 50 50' height={`${size}px`} id='Layer_1' version='1.1' viewBox='0 0 50 50' width={`${size}px`}><rect fill='none' height='50' width='50'/><polygon fill={fill} points='25,3.553 30.695,18.321 46.5,19.173   34.214,29.152 38.287,44.447 25,35.848 11.712,44.447 15.786,29.152 3.5,19.173 19.305,18.321 ' stroke={stroke} strokeMiterlimit='10' strokeWidth='2'/></svg>
  )
};