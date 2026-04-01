import React from 'react';

interface CrystalCardProps {
  image: string;
  name: string;
  purpose: string;
  description: string;
  properties: string[];
  forms: string[];
  onSelect: () => void;
  isMixels?: boolean;
}

const CrystalCard: React.FC<CrystalCardProps> = ({
  name,
  purpose,
  description,
  properties,
  forms,
  onSelect,
  isMixels = false,
}) => (
  <div className="group relative flex h-[500px] w-80 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-navy/12 bg-white/50 shadow-lg transition-all duration-300 hover:z-10 hover:scale-105 hover:border-teal/45 hover:shadow-xl">
    <div className="h-60 w-full relative overflow-hidden rounded-t-2xl flex-shrink-0">
      <div className="w-full h-full rounded-t-2xl bg-gradient-to-br from-navy via-plum to-navy flex items-center justify-center">
        <span
          className="font-heading text-sand uppercase"
          style={{ fontSize: '22px', letterSpacing: '0.12em', fontWeight: 700 }}
        >
          Coming Soon
        </span>
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md p-4 rounded-b-2xl flex flex-col items-start">
        <h3 className="text-2xl font-bold text-sand drop-shadow mb-1">{name}</h3>
        <p className="text-teal font-semibold text-base mb-1 drop-shadow">{purpose}</p>
      </div>
    </div>
    <div className={`${isMixels ? 'p-4' : 'p-5'} flex flex-col gap-2 flex-1 min-h-0 justify-between overflow-hidden bg-sand/90 border-t border-navy/10`}>
      <p className={`text-navy/75 ${isMixels ? 'text-sm line-clamp-2' : 'text-sm line-clamp-3'} ${isMixels ? 'mb-1' : 'mb-2'}`}>{description}</p>
      <div className={`flex flex-wrap gap-1 ${isMixels ? 'mb-1' : 'mb-2'}`}>
        {properties.map((property, index) => (
          <span
            key={index}
            className="text-xs bg-teal/15 text-navy px-2 py-1 rounded-full border border-teal/25"
          >
            {property}
          </span>
        ))}
      </div>
      {!isMixels && (
        <div className="text-xs text-navy/80 mb-3 leading-relaxed break-words">
          <span className="font-medium text-navy">Available as:</span><br />
          <span className="text-teal font-semibold">{forms.join(' • ')}</span>
        </div>
      )}
      {isMixels && (
        <div className="bg-teal/10 border border-teal/35 rounded-lg p-2 mb-1 animate-pulse">
          <div className="text-center">
            <div className="text-teal font-bold text-xs leading-tight">✨ CUSTOM DESIGNS AVAILABLE ✨</div>
            <div className="text-xs text-navy/80 leading-tight">Tell us your requirements!</div>
          </div>
        </div>
      )}
      <button
        onClick={onSelect}
        className="mt-2 bg-gradient-to-r from-teal to-plum hover:opacity-90 px-4 py-2 rounded-lg text-sm font-bold text-sand shadow-lg transition-all duration-300 w-full"
      >
        Buy Now
      </button>
    </div>
  </div>
);

export default CrystalCard;
