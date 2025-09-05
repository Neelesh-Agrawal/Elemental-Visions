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
  image,
  name,
  purpose,
  description,
  properties,
  forms,
  onSelect,
  isMixels = false,
}) => (
  <div className="flex-shrink-0 w-80 h-[500px] glass card-shadow overflow-hidden border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 group relative flex flex-col justify-between hover:scale-105 hover:shadow-2xl hover:z-10">
    <div className="h-60 w-full relative overflow-hidden rounded-t-2xl flex-shrink-0">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-center rounded-t-2xl transition-all duration-300"
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md p-4 rounded-b-2xl flex flex-col items-start">
        <h3 className="text-2xl font-bold text-white drop-shadow mb-1">{name}</h3>
        <p className="text-yellow-300 font-semibold text-base mb-1 drop-shadow">{purpose}</p>
      </div>
    </div>
    <div className={`${isMixels ? 'p-4' : 'p-5'} flex flex-col gap-2 flex-1 min-h-0 justify-between overflow-hidden`}>
      <p className={`text-gray-300 ${isMixels ? 'text-sm line-clamp-2' : 'text-sm line-clamp-3'} ${isMixels ? 'mb-1' : 'mb-2'}`}>{description}</p>
      <div className={`flex flex-wrap gap-1 ${isMixels ? 'mb-1' : 'mb-2'}`}>
        {properties.map((property, index) => (
          <span
            key={index}
            className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full"
          >
            {property}
          </span>
        ))}
      </div>
      {!isMixels && (
        <div className="text-xs text-purple-200 mb-3 leading-relaxed break-words">
          <span className="font-medium">Available as:</span><br />
          <span className="text-yellow-300">{forms.join(' • ')}</span>
        </div>
      )}
      {isMixels && (
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-lg p-2 mb-1 animate-pulse">
          <div className="text-center">
            <div className="text-yellow-300 font-bold text-xs leading-tight">✨ CUSTOM DESIGNS AVAILABLE ✨</div>
            <div className="text-xs text-yellow-200 leading-tight">Tell us your requirements!</div>
          </div>
        </div>
      )}
      <button
        onClick={onSelect}
        className="mt-2 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all duration-300 w-full"
      >
        Buy Now
      </button>
    </div>
  </div>
);

export default CrystalCard;
