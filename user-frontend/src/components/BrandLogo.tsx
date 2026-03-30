import React from 'react';

const LOGO_SRC = '/logo-elemental-visions.png';
const LOGO_ALT = 'Elemental Visions — Sakshi';

type BrandLogoProps = {
  variant: 'nav' | 'hero' | 'footer';
  className?: string;
};

const sizes = {
  nav: 'h-9 w-auto max-w-[200px] object-contain object-left sm:h-10 sm:max-w-[240px] md:h-11',
  hero: 'mx-auto h-36 w-auto max-w-[min(100%,400px)] object-contain sm:h-40 md:h-44 lg:h-48',
  footer: 'h-14 w-auto max-w-[260px] object-contain sm:h-16 sm:max-w-[300px]',
};

/** Full brand lockup (plum field + white line art) from `public/logo-elemental-visions.png`. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ variant, className = '' }) => (
  <img
    src={LOGO_SRC}
    alt={LOGO_ALT}
    className={`rounded-xl ${sizes[variant]} ${className}`.trim()}
  />
);
