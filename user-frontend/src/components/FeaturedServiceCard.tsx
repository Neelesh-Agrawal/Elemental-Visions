import React from 'react';

export type FeaturedServiceMeta = {
  id: string;
  title: string;
  description: string;
  bookingType: string;
  bookingName: string;
  /** Full-card artwork from `/public/featured/…` */
  artworkSrc: string;
};

type FeaturedServiceCardProps = {
  service: FeaturedServiceMeta;
  onViewService: () => void;
};

const CHAMPAGNE = '#DAC6AB';

const FeaturedServiceCard: React.FC<FeaturedServiceCardProps> = ({ service, onViewService }) => (
  <article
    className="group relative w-full overflow-hidden rounded transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_48px_-10px_rgba(15,35,70,0.45)]"
    style={{ borderRadius: '4px' }}
  >
    <div className="relative aspect-[280/380] w-full">
      <img
        src={service.artworkSrc}
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B1528]/92 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-6 pt-10">
        <p className="sr-only">
          {service.title}. {service.description}
        </p>
        <button
          type="button"
          onClick={onViewService}
          className="relative"
          style={{
            fontFamily: "'Gotham', system-ui, sans-serif",
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: CHAMPAGNE,
            background: 'rgba(15, 35, 70, 0.45)',
            border: '1px solid rgba(218,198,171,0.4)',
            padding: '10px 22px',
            cursor: 'pointer',
            transition: 'border-color 0.25s, background 0.25s',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = '#256060';
            el.style.background = 'rgba(37,96,96,0.35)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(218,198,171,0.4)';
            el.style.background = 'rgba(15, 35, 70, 0.45)';
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: -1,
              left: -1,
              width: 6,
              height: 6,
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
              width: 6,
              height: 6,
              borderBottom: '1.5px solid #256060',
              borderRight: '1.5px solid #256060',
              display: 'block',
            }}
          />
          View Service
        </button>
      </div>
    </div>
  </article>
);

export default FeaturedServiceCard;
