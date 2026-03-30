import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  forceSolidBg?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, forceSolidBg }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = forceSolidBg || scrolled;
  const onLightBg = !isSolid;
  const linkMuted = onLightBg ? 'rgba(15, 35, 70, 0.55)' : 'rgba(218, 198, 171, 0.65)';
  const linkBright = onLightBg ? '#0F2346' : '#DAC6AB';
  const ctaColor = onLightBg ? '#0F2346' : '#DAC6AB';
  const ctaBorder = onLightBg ? 'rgba(15, 35, 70, 0.22)' : 'rgba(218, 198, 171, 0.22)';
  const iconMuted = onLightBg ? 'rgba(15, 35, 70, 0.55)' : 'rgba(218, 198, 171, 0.65)';

  const navLinks = ['Home', 'About', 'Services', 'Crystals', 'Contact'] as const;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 w-full transition-[background,border-color,padding,backdrop-filter] duration-300 ease-out"
      style={{
        background: isSolid ? 'rgba(15, 35, 70, 0.98)' : 'rgba(218, 198, 171, 0.02)',
        borderBottom: isSolid
          ? '1px solid rgba(218, 198, 171, 0.15)'
          : '1px solid rgba(15, 35, 70, 0.06)',
        backdropFilter: isSolid ? 'blur(12px)' : 'blur(8px)',
        WebkitBackdropFilter: isSolid ? 'blur(12px)' : 'blur(8px)',
        paddingTop: isSolid ? 6 : 14,
        paddingBottom: isSolid ? 6 : 14,
      }}
    >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex min-h-[44px] items-center md:min-h-[40px]">
            <div className="flex min-w-0 flex-1 justify-start">
              <a href="#home" className="inline-flex shrink-0 leading-none" style={{ textDecoration: 'none' }}>
                <BrandLogo variant="nav" />
              </a>
            </div>

            <div
              className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
              role="presentation"
            >
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-5 lg:gap-x-7" aria-label="Main navigation">
                {navLinks.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    style={{
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '13px',
                      fontWeight: 400,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      color: linkMuted,
                      textDecoration: 'none',
                      position: 'relative' as const,
                      paddingBottom: '3px',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = linkBright;
                      const line = el.querySelector('.nav-ul') as HTMLElement;
                      if (line) line.style.width = '100%';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = linkMuted;
                      const line = el.querySelector('.nav-ul') as HTMLElement;
                      if (line) line.style.width = '0%';
                    }}
                  >
                    {item}
                    <span
                      className="nav-ul"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '0%',
                        height: '1px',
                        background: '#256060',
                        transition: 'width 0.3s ease',
                        display: 'block',
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              <button
                onClick={onCartClick}
                aria-label="Open cart"
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: iconMuted,
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = linkBright)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = iconMuted)}
              >
                <ShoppingCart style={{ width: 20, height: 20 }} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 18,
                      height: 18,
                      background: '#256060',
                      color: '#DAC6AB',
                      borderRadius: '50%',
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '10px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href="#contact"
                className="hidden md:inline-block"
                style={{
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  color: ctaColor,
                  textDecoration: 'none',
                  padding: isSolid ? '8px 16px' : '10px 18px',
                  border: `1px solid ${ctaBorder}`,
                  position: 'relative' as const,
                  transition: 'border-color 0.25s, background 0.25s, padding 0.3s ease',
                  whiteSpace: 'nowrap' as const,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#256060';
                  el.style.background = onLightBg ? 'rgba(37, 96, 96, 0.1)' : 'rgba(37, 96, 96, 0.14)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = ctaBorder;
                  el.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    width: 7,
                    height: 7,
                    borderTop: '1.5px solid #256060',
                    borderLeft: '1.5px solid #256060',
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 7,
                    height: 7,
                    borderBottom: '1.5px solid #256060',
                    borderRight: '1.5px solid #256060',
                    display: 'block',
                  }}
                />
                Book a Session
              </a>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="md:hidden"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: onLightBg ? '#0F2346' : '#DAC6AB',
                }}
              >
                {isMenuOpen ? (
                  <X style={{ width: 20, height: 20 }} strokeWidth={1.5} />
                ) : (
                  <Menu style={{ width: 20, height: 20 }} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className="md:hidden"
          style={{
            maxHeight: isMenuOpen ? '420px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.77, 0, 0.175, 1)',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 35, 70, 0.99)',
              borderTop: '1px solid rgba(218, 198, 171, 0.12)',
              padding: '8px 0 20px',
            }}
          >
            {navLinks.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 28px',
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '13px',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#DAC6AB',
                  textDecoration: 'none',
                  borderBottom: i < navLinks.length - 1 ? '1px solid rgba(218, 198, 171, 0.08)' : 'none',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#256060';
                  el.style.background = 'rgba(218, 198, 171, 0.04)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#DAC6AB';
                  el.style.background = 'transparent';
                }}
              >
                {item}
              </a>
            ))}

            <div style={{ padding: '16px 28px 4px' }}>
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'inline-block',
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase' as const,
                  color: '#DAC6AB',
                  textDecoration: 'none',
                  padding: '12px 28px',
                  border: '1px solid rgba(218, 198, 171, 0.22)',
                }}
              >
                Book a Session
              </a>
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
