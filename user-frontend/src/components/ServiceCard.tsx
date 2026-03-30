import React from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  basePrice?: string;
  duration?: string;
  onBook: () => void;
}

// Art deco SVG border drawn inline — matches the Instagram card reference
const ArtDecoBorder = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 280 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Outer frame */}
    <rect x="8" y="8" width="264" height="364" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5"/>
    {/* Inner frame */}
    <rect x="16" y="16" width="248" height="348" stroke="#DAC6AB" strokeWidth="0.5" strokeOpacity="0.3"/>

    {/* Top corners */}
    <path d="M8 48 L8 24 Q8 8 24 8 L48 8" stroke="#DAC6AB" strokeWidth="1" strokeOpacity="0.7" fill="none"/>
    <path d="M272 48 L272 24 Q272 8 256 8 L232 8" stroke="#DAC6AB" strokeWidth="1" strokeOpacity="0.7" fill="none"/>
    {/* Bottom corners */}
    <path d="M8 332 L8 356 Q8 372 24 372 L48 372" stroke="#DAC6AB" strokeWidth="1" strokeOpacity="0.7" fill="none"/>
    <path d="M272 332 L272 356 Q272 372 256 372 L232 372" stroke="#DAC6AB" strokeWidth="1" strokeOpacity="0.7" fill="none"/>

    {/* Corner flourishes — top left */}
    <path d="M8 38 Q20 38 20 50" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    <path d="M38 8 Q38 20 50 20" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    {/* Corner flourishes — top right */}
    <path d="M272 38 Q260 38 260 50" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    <path d="M242 8 Q242 20 230 20" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    {/* Corner flourishes — bottom left */}
    <path d="M8 342 Q20 342 20 330" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    <path d="M38 372 Q38 360 50 360" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    {/* Corner flourishes — bottom right */}
    <path d="M272 342 Q260 342 260 330" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>
    <path d="M242 372 Q242 360 230 360" stroke="#DAC6AB" strokeWidth="0.75" strokeOpacity="0.5" fill="none"/>

    {/* Top center dot */}
    <circle cx="140" cy="8" r="4" fill="#DAC6AB" fillOpacity="0.6"/>
    {/* Bottom center dot */}
    <circle cx="140" cy="372" r="4" fill="#DAC6AB" fillOpacity="0.6"/>

    {/* Top swag line */}
    <path d="M48 8 Q140 28 232 8" stroke="#DAC6AB" strokeWidth="0.5" strokeOpacity="0.35" fill="none"/>
    {/* Bottom swag line */}
    <path d="M48 372 Q140 352 232 372" stroke="#DAC6AB" strokeWidth="0.5" strokeOpacity="0.35" fill="none"/>
  </svg>
);

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  basePrice,
  duration,
  onBook,
}) => (
  <div
    className="relative flex flex-col items-center text-center cursor-pointer group"
    style={{
      background: 'linear-gradient(145deg, #0F2346 0%, #1c1a3a 42%, #582045 100%)',
      borderRadius: '4px',
      padding: '48px 32px 36px',
      minHeight: '380px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      (e.currentTarget as HTMLElement).style.boxShadow =
        '0 22px 52px -8px rgba(15,35,70,0.45), 0 12px 32px -6px rgba(88,32,69,0.22)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    }}
  >
    {/* Art deco border overlay */}
    <ArtDecoBorder />

    {/* Content — above the SVG overlay */}
    <div className="relative z-10 flex flex-col items-center flex-1 w-full">

      {/* Icon */}
      <div
        className="mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{ color: '#DAC6AB', opacity: 0.85 }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="font-heading mb-4 leading-tight"
        style={{
          fontSize: '18px',
          color: '#DAC6AB',
          letterSpacing: '0.12em',
        }}
      >
        {title}
      </h3>

      {/* Thin divider */}
      <div
        className="mb-5 flex items-center gap-2"
        style={{ opacity: 0.35 }}
      >
        <div style={{ width: 24, height: 1, background: '#DAC6AB' }} />
        <div style={{ width: 4, height: 4, background: '#DAC6AB', transform: 'rotate(45deg)', flexShrink: 0 }} />
        <div style={{ width: 24, height: 1, background: '#DAC6AB' }} />
      </div>

      {/* Description — truncated, full shown in modal */}
      <p
        className="mb-6 leading-relaxed"
        style={{
          fontFamily: "'Gotham', system-ui, sans-serif",
          fontSize: '13px',
          fontWeight: 300,
          color: 'rgba(218,198,171,0.65)',
          lineHeight: 1.75,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {description.split('\n')[0]}
      </p>

      {/* Price + duration */}
      {basePrice && (
        <div
          className="mb-6 flex items-center justify-center gap-4"
          style={{ fontFamily: "'Gotham', system-ui, sans-serif" }}
        >
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#256060' }}>
            {basePrice}
          </span>
          {duration && (
            <>
              <span style={{ width: 3, height: 3, background: 'rgba(218,198,171,0.3)', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(218,198,171,0.45)' }}>
                {duration}
              </span>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onBook}
        className="mt-auto"
        style={{
          fontFamily: "'Gotham', system-ui, sans-serif",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#DAC6AB',
          background: 'transparent',
          border: '1px solid rgba(218,198,171,0.3)',
          padding: '10px 24px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'border-color 0.25s, background 0.25s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = '#256060';
          el.style.background = 'rgba(37,96,96,0.2)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(218,198,171,0.3)';
          el.style.background = 'transparent';
        }}
      >
        {/* Art deco corner accents */}
        <span style={{ position: 'absolute', top: -1, left: -1, width: 6, height: 6, borderTop: '1.5px solid #256060', borderLeft: '1.5px solid #256060', display: 'block' }} />
        <span style={{ position: 'absolute', bottom: -1, right: -1, width: 6, height: 6, borderBottom: '1.5px solid #256060', borderRight: '1.5px solid #256060', display: 'block' }} />
        View Sessions
      </button>
    </div>
  </div>
);

export default ServiceCard;