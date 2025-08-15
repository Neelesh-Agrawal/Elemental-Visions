import React from 'react';

interface CrystalCardProps {
  image: string;
  name: string;
  purpose: string;
  description: string;
  properties: string[];
  forms: string[];
  onSelect: () => void;
}

const CrystalCard: React.FC<CrystalCardProps> = ({
  image,
  name,
  purpose,
  description,
  properties,
  forms,
  onSelect,
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
    <div className="p-4 flex flex-col gap-2 flex-1 min-h-0 justify-between overflow-hidden">
      <p className="text-gray-300 text-sm line-clamp-3 mb-1">{description}</p>
      <div className="flex flex-wrap gap-1 mb-1">
        {properties.map((property, index) => (
          <span
            key={index}
            className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full"
          >
            {property}
          </span>
        ))}
      </div>
      <div className="text-xs text-purple-200">
        Available as: {forms.join(' | ')}
      </div>
      <button
        onClick={onSelect}
        className="mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all duration-300 w-full"
      >
        Buy Now
      </button>
    </div>
  </div>
);

export default CrystalCard;
