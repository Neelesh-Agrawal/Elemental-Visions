import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import type { FeaturedServiceMeta } from './FeaturedServiceCard';

type FeaturedServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service: FeaturedServiceMeta | null;
  onBookSession: (serviceType: string, serviceName: string) => void;
};

type ArcanaKey = 'elite' | 'deep' | 'alignment' | 'mini' | 'checkin';

type ArcanaType = {
  key: ArcanaKey;
  title: string;
  sessionWindow?: string;
  tagline?: string;
  intro: string[];
  whatYouReceive?: string[];
  whatWeWorkOn?: string[];
  sessionStructure?: string[];
  whoThisIsFor?: string[];
  whatThisIsNot?: string[];
  notes?: string[];
  energyExchange?: {
    original: string;
    discounted: string;
    note?: string;
  };
};

const ARCANA_TYPES: ArcanaType[] = [
  {
    key: 'elite',
    title: 'THE ELITE ENLIGHTENMENT',
    sessionWindow: '60 minutes',
    tagline: 'Where clarity meets destiny',
    energyExchange: { original: '13999', discounted: '7999', note: 'INCLUDES ANY 1 CRYSTAL DELIVERY AT YOUR DOORSTEP' },
    intro: [
      'A premium portal to your highest self',
      'Decode. Align. Elevate.',
      'Elite Enlightenment is not just a reading—it is an initiation.',
      'This is a deeply immersive, high-frequency session designed to bring you face-to-face with your truth. Whether you feel stuck, confused, or ready to elevate, this experience decodes your energy, your patterns, and your path ahead with precision and depth.',
      'Through intuitive channeling, tarot wisdom, and energetic alignment, we uncover:',
    ],
    whatWeWorkOn: [
      'Your current life theme & soul lesson',
      'Relationship & emotional patterns',
      'Career / money alignment insights',
      'Clear next steps for manifestation',
    ],
    whatYouReceive: [
      '1:1 Premium Intuitive Session',
      'In-depth Tarot Channeling (multi-layered reading)',
      'Energy & Blockage Analysis',
      'Personalized Guidance + Action Steps',
      'Affirmations',
      'Energised Crystal as per your blockage',
      '(Optional add-on: voice note support for further clarity within 24 hours of the session.)',
    ],
    whoThisIsFor: [
      'Someone feeling emotionally or mentally stuck',
      'People facing confusion in relationships, career, or life direction',
      'Clients seeking premium, honest, no-sugarcoating guidance',
      'Those ready to invest in real transformation',
    ],
    whatThisIsNot: [
      'Not a yes/no quick reading',
      'Not for pre natal gender prediction',
      'Not for gambling or stock market prediction',
      'Not for death prediction',
      'Not for casual curiosity',
      'Not for repetitive questioning without action',
    ],
    notes: ['You don’t just receive answers… you leave as a more aligned version of yourself.'],
  },
  {
    key: 'deep',
    title: 'DEEP INSIGHT EXPERIENCE',
    sessionWindow: '40 minutes',
    tagline: 'See clearly, decide confidently',
    energyExchange: { original: '9999', discounted: '4999' },
    intro: [
      'This experience is your space for deep clarity and aligned direction.',
      'If you’re at a crossroads, feeling uncertain, or overthinking your next move… this session cuts through the noise and brings you back to clarity.',
      'Through intuitive channeling and tarot insights, we uncover patterns, highlight what’s influencing your current situation, and guide you towards decisions that are truly aligned with you.',
    ],
    whatWeWorkOn: [
      'Understanding your current situation & energy around your relationships or career',
      'Identifying patterns influencing your decisions',
      'Clearing mental clutter',
    ],
    whatYouReceive: [
      '1:1 Premium Intuitive Session',
      'In-depth Tarot Channeling (multi-layered reading)',
      'Energy & Blockage Analysis',
      'Personalized Guidance + Action Steps',
      'Affirmations',
      'Crystal Recommendation as per your blockage',
    ],
    whatThisIsNot: [
      'Not a yes/no quick reading',
      'Not for pre natal gender prediction',
      'Not for gambling or stock market prediction',
      'Not for death prediction',
      'Not for casual curiosity',
      'Not for repetitive questioning without action',
    ],
  },
  {
    key: 'alignment',
    title: 'FOCUSSED INSIGHT SESSION',
    sessionWindow: '15 minutes',
    tagline: 'Pause. Realign. Move Forward',
    energyExchange: { original: '4999', discounted: '2499' },
    intro: [
      'Alignment Session is a focused–1:1 clarity space for your immediate concerns.',
      'This is a short yet powerful session designed to help you understand your current situation with clarity and calmness—without going into an extensive deep dive.',
      'If you’re feeling confused, overthinking, or just need quick guidance on something specific, this session helps you pause, ground yourself, and move forward with confidence.',
    ],
    whatWeWorkOn: [
      'Quick understanding of your current situation',
      'Clearing immediate confusion or overthinking',
      'Clarity in relationships or emotions',
      'Guidance on a specific decision or concern',
      'Aligning your next step…',
    ],
    sessionStructure: [
      '1:1 Personalized Session',
      'Focused Tarot Spread (not a deep multi-layered reading)',
      'Covers 2 specific questions/aspects only',
      'Clear, direct guidance with practical direction',
    ],
    whatThisIsNot: [
      'Not a yes/no quick reading',
      'Not for pre natal gender prediction',
      'Not for gambling or stock market prediction',
      'Not for death prediction',
      'Not for casual curiosity',
      'Not for repetitive questioning without action',
    ],
  },
  {
    key: 'mini',
    title: 'MINI CLARITY EDIT',
    tagline: 'Quick access to intuitive guidance',
    energyExchange: { original: '3400', discounted: '1499' },
    intro: [
      'Mini Clarity Edit is your quick access to intuitive guidance—anytime you feel stuck.',
      'This is a short, focused reading designed to bring clarity to one specific question or situation without the need for a full session.',
      'Simple, precise, and aligned—so you can move forward without confusion.',
    ],
    whatYouReceive: [
      'Insight on 1 specific question only',
      'Clear, intuitive guidance + advice',
      'Straightforward, no-overwhelm interpretation',
      'Delivered via text message or voice note',
      'Format: No live session',
      'Response shared within your defined time',
    ],
    whatThisIsNot: [
      'Not a yes/no quick reading',
      'Not for pre natal gender prediction',
      'Not for gambling or stock market prediction',
      'Not for death prediction',
      'Not for casual curiosity',
      'Not for repetitive questioning without action',
    ],
  },
  {
    key: 'checkin',
    title: 'QUICK CHECK IN',
    sessionWindow: 'Within 24 hrs',
    tagline: 'Small follow up clarity',
    energyExchange: { original: '1199', discounted: '499' },
    intro: [
      'For small follow up clarity or any missed question post session within 24 hrs via text message.',
      'Only for genuine concerns.',
    ],
    whatYouReceive: ['Text follow-up within 24 hours for genuine concerns.'],
  },
];

type AlignmentSubtypeKey = 'quantum' | 'reset' | 'intro';

type AlignmentSubtype = {
  key: AlignmentSubtypeKey;
  title: string;
  sacredWindow: string;
  tagline: string;
  description: string;
  energyExchange: {
    original: string;
    discounted: string;
  };
};

const KARMIC_CONTENT = {
  sessionWindow: '20 minutes',
  tagline: 'Decode the Unseen. Release What No Longer Serves You.',
  intro: [
    'In the subtle layers of your soul’s journey, there exist unresolved energies, unfinished cycles, and karmic imprints carried across time.',
    'These unseen patterns often manifest as recurring challenges, emotional blocks, or unexplained delays in life.',
    'It is a deeply intuitive reading designed to gently uncover these hidden influences and bring them into conscious awareness.',
  ],
  reveals: [
    '✨ Karmic patterns influencing your present life',
    '✨ Emotional or energetic blocks holding you back from your past life',
    '✨ Soul lessons awaiting completion',
    '✨ Areas where release and healing are needed',
  ],
  experiences: ['A personalized, in-depth intuitive reading via audio call.'],
  whoFor: [
    'Those feeling stuck despite efforts',
    'Experiencing repeated patterns in relationships or career',
    'Ready to release old cycles and move forward',
  ],
  transformation: [
    'This session is not about predicting the future: it is about empowering you to transform it.',
    'When karmic patterns are understood, they begin to lose their hold… creating space for clarity, flow, and conscious choice.',
  ],
  disclaimer: [
    'This is an intuitive and spiritual interpretation',
    'Offered for guidance and self-awareness only',
    'Not for future predictions',
  ],
  energyExchange: {
    original: '4999',
    discounted: '1999',
  },
};

const ALIGNMENT_SUBTYPES: AlignmentSubtype[] = [
  {
    key: 'quantum',
    title: 'The Quantum Alignment Experience (6 Sessions)',
    sacredWindow: 'Each session 24 mins',
    tagline: 'Embodiment • Expansion • Transformation',
    description:
      'A premium, high-touch container for deep energetic transformation and powerful manifestation.',
    energyExchange: { original: '19999', discounted: '6666' },
  },
  {
    key: 'reset',
    title: 'The Alignment Reset (3 Sessions)',
    sacredWindow: 'Each session 24 mins',
    tagline: 'Realign • Release • Reprogram',
    description: 'A focused journey to shift inner blocks and start creating visible changes.',
    energyExchange: { original: '10000', discounted: '3900' },
  },
  {
    key: 'intro',
    title: 'The Introductory Alignment (1 session)',
    sacredWindow: 'Each session 24 mins session',
    tagline: 'Initiate Your Manifestation Journey',
    description: 'A powerful first step into understanding your energy and manifestation pattern.',
    energyExchange: { original: '4999', discounted: '1699' },
  },
];

const FeaturedServiceModal: React.FC<FeaturedServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onBookSession,
}) => {
  const serviceId = service?.id;
  const isArcana = serviceId === 'arcana';

  const [arcanaView, setArcanaView] = useState<'types' | 'details'>('types');
  const [selectedArcanaKey, setSelectedArcanaKey] = useState<ArcanaKey | null>(null);

  const [alignmentView, setAlignmentView] = useState<'subtypes' | 'details'>('subtypes');
  const [selectedAlignmentKey, setSelectedAlignmentKey] = useState<AlignmentSubtypeKey | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (serviceId === 'arcana') {
      setArcanaView('types');
      setSelectedArcanaKey(null);
    }
    if (serviceId === 'alignment') {
      setAlignmentView('subtypes');
      setSelectedAlignmentKey(null);
    }
  }, [isOpen, serviceId]);

  const selectedArcana = useMemo(() => {
    if (!selectedArcanaKey) return null;
    return ARCANA_TYPES.find((t) => t.key === selectedArcanaKey) ?? null;
  }, [selectedArcanaKey]);

  const selectedAlignment = useMemo(() => {
    if (!selectedAlignmentKey) return null;
    return ALIGNMENT_SUBTYPES.find((t) => t.key === selectedAlignmentKey) ?? null;
  }, [selectedAlignmentKey]);

  if (!isOpen || !service) return null;

  const handleBook = () => {
    onClose();
    onBookSession(service.bookingType, service.bookingName);
  };

  const handleKarmicBook = () => {
    onClose();
    onBookSession(service.bookingType, 'KARMIC PATTERN INSIGHTS');
  };

  const handleAlignmentBook = () => {
    if (!selectedAlignment) return;
    onClose();
    onBookSession(service.bookingType, selectedAlignment.title);
  };

  const handleArcanaBook = () => {
    if (!selectedArcana) return;
    onClose();
    onBookSession(service.bookingType, selectedArcana.title);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="featured-service-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-sand/20 shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #0F2346 0%, #1c1a3a 42%, #582045 100%)',
        }}
      >
        <div
          className="flex items-start justify-between gap-4 border-b border-sand/15 px-6 py-5"
        >
          <div>
            <p
              className="mb-1 uppercase tracking-[0.2em] text-teal/90"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
            >
              Service
            </p>
            <h2 id="featured-service-title" className="font-heading text-xl text-sand sm:text-2xl">
              {service.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded p-1 text-sand/50 transition-colors hover:text-sand"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {isArcana ? (
          arcanaView === 'types' ? (
            <div className="space-y-5 px-6 py-6">
              <p
                style={{
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'rgba(218,198,171,0.75)',
                  lineHeight: 1.7,
                }}
              >
                Choose the Arcana session type that matches your level of clarity right now.
              </p>

              <div className="space-y-3">
                {ARCANA_TYPES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setSelectedArcanaKey(t.key);
                      setArcanaView('details');
                    }}
                    className="w-full rounded-lg border border-sand/15 bg-navy/30 p-4 text-left transition-colors hover:border-teal/40"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '10px',
                            fontWeight: 500,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'rgba(37,96,96,0.95)',
                          }}
                        >
                          {t.sessionWindow ? `Sacred Session Window: ${t.sessionWindow}` : 'Quick session'}
                        </div>
                        <div className="mt-2 font-heading text-sand sm:text-lg" style={{ fontSize: '16px' }}>
                          {t.title}
                        </div>
                        {t.tagline ? (
                          <div
                            className="mt-1"
                            style={{
                              fontFamily: "'Gotham', system-ui, sans-serif",
                              fontSize: '12px',
                              fontWeight: 300,
                              color: 'rgba(218,198,171,0.7)',
                              lineHeight: 1.45,
                            }}
                          >
                            {t.tagline}
                          </div>
                        ) : null}

                      </div>

                      <div
                        className="shrink-0 self-start rounded-full border border-sand/20 px-3 py-1 text-teal/95"
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                        }}
                      >
                        Know more
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : selectedArcana ? (
            <div className="px-6 py-6 space-y-6">
              <button
                type="button"
                onClick={() => {
                  setArcanaView('types');
                  setSelectedArcanaKey(null);
                }}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sand/80 transition-colors hover:text-teal"
                style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px' }}
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
                Back to Arcana types
              </button>

              <div className="space-y-2">
                <p
                  style={{
                    fontFamily: "'Gotham', system-ui, sans-serif",
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(37,96,96,0.95)',
                  }}
                >
                  {selectedArcana.sessionWindow ? `Sacred Session Window: ${selectedArcana.sessionWindow}` : 'Quick session'}
                </p>
                <h3 className="font-heading text-2xl text-sand">{selectedArcana.title}</h3>
                {selectedArcana.tagline ? (
                  <p
                    style={{
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'rgba(218,198,171,0.75)',
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedArcana.tagline}
                  </p>
                ) : null}

              </div>

              <div className="space-y-4">
                {selectedArcana.intro.map((p, idx) => (
                  <p
                    key={`${selectedArcana.key}-intro-${idx}`}
                    style={{
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'rgba(218,198,171,0.86)',
                      lineHeight: 1.8,
                    }}
                  >
                    {p}
                  </p>
                ))}

                {selectedArcana.whatWeWorkOn?.length ? (
                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      What we uncover
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.75)',
                      }}
                    >
                      {selectedArcana.whatWeWorkOn.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedArcana.sessionStructure?.length ? (
                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      Session structure
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.75)',
                      }}
                    >
                      {selectedArcana.sessionStructure.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedArcana.whatYouReceive?.length ? (
                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      What you receive
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.75)',
                      }}
                    >
                      {selectedArcana.whatYouReceive.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedArcana.whoThisIsFor?.length ? (
                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      Who this is for
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.75)',
                      }}
                    >
                      {selectedArcana.whoThisIsFor.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedArcana.whatThisIsNot?.length ? (
                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      What this is not
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.7)',
                      }}
                    >
                      {selectedArcana.whatThisIsNot.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedArcana.notes?.length ? (
                  <div
                    className="rounded-lg border border-teal/25 bg-[rgba(37,96,96,0.08)] px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    {selectedArcana.notes.map((n) => (
                      <p
                        key={n}
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '14px',
                          fontWeight: 300,
                          color: 'rgba(218,198,171,0.86)',
                          lineHeight: 1.8,
                        }}
                      >
                        {n}
                      </p>
                    ))}
                  </div>
                ) : null}

                {selectedArcana.energyExchange ? (
                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-1 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      Energy exchange
                    </p>
                    <div className="flex flex-col items-start">
                      <div
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'rgba(218,198,171,0.45)',
                          textDecoration: 'line-through',
                        }}
                      >
                        INR {selectedArcana.energyExchange.original}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#256060',
                        }}
                      >
                        INR {selectedArcana.energyExchange.discounted}
                      </div>
                      {selectedArcana.energyExchange.note ? (
                        <div
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '10px',
                            fontWeight: 400,
                            letterSpacing: '0.06em',
                            color: 'rgba(218,198,171,0.55)',
                            marginTop: 2,
                            textTransform: 'uppercase',
                          }}
                        >
                          {selectedArcana.energyExchange.note}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null
        ) : (
          <>
            {serviceId === 'karmic' ? (
              <>
                <div className="space-y-6 px-6 py-6">
                  <div className="space-y-3">
                    <p
                      className="uppercase tracking-[0.2em] text-teal/90"
                      style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
                    >
                      Sacred Session Window: {KARMIC_CONTENT.sessionWindow}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '14px',
                        fontWeight: 300,
                        color: 'rgba(218,198,171,0.85)',
                        lineHeight: 1.75,
                      }}
                    >
                      {KARMIC_CONTENT.tagline}
                    </p>
                  </div>

                  {KARMIC_CONTENT.intro.map((p) => (
                    <p
                      key={p}
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '14px',
                        fontWeight: 300,
                        color: 'rgba(218,198,171,0.82)',
                        lineHeight: 1.75,
                      }}
                    >
                      {p}
                    </p>
                  ))}

                  <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      What this session reveals
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.78)',
                      }}
                    >
                      {KARMIC_CONTENT.reveals.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'rgba(218,198,171,0.82)',
                      lineHeight: 1.75,
                    }}
                  >
                    {KARMIC_CONTENT.experiences[0]}
                  </p>

                  <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      Who this is for
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.78)',
                      }}
                    >
                      {KARMIC_CONTENT.whoFor.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>

                  {KARMIC_CONTENT.transformation.map((p) => (
                    <p
                      key={p}
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '14px',
                        fontWeight: 300,
                        color: 'rgba(218,198,171,0.82)',
                        lineHeight: 1.75,
                      }}
                    >
                      {p}
                    </p>
                  ))}

                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      Sacred disclaimer
                    </p>
                    <ul
                      className="list-none space-y-2"
                      style={{
                        fontFamily: "'Gotham', system-ui, sans-serif",
                        fontSize: '13px',
                        color: 'rgba(218,198,171,0.78)',
                      }}
                    >
                      {KARMIC_CONTENT.disclaimer.map((x) => (
                        <li key={x}>• {x}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <p className="mb-1 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                      Energy exchange
                    </p>
                    <div className="flex flex-col">
                      <div
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'rgba(218,198,171,0.45)',
                          textDecoration: 'line-through',
                        }}
                      >
                        INR {KARMIC_CONTENT.energyExchange.original}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#256060',
                          letterSpacing: '0.02em',
                        }}
                      >
                        INR {KARMIC_CONTENT.energyExchange.discounted}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-sand/15 px-6 py-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-sand/25 px-5 py-2.5 text-sand/80 transition-colors hover:bg-sand/5"
                    style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.08em' }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleKarmicBook}
                    className="rounded-lg bg-teal px-5 py-2.5 font-semibold text-sand transition-opacity hover:opacity-90"
                    style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.12em' }}
                  >
                    Book this service
                  </button>
                </div>
              </>
            ) : null}

            {serviceId === 'alignment' ? (
              <>
                <div className="space-y-6 px-6 py-6">
                  {alignmentView === 'subtypes' ? (
                    <>
                      <div className="space-y-3">
                        <p
                          className="uppercase tracking-[0.22em] text-teal/90"
                          style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
                        >
                          Alignment Sessions
                        </p>
                        <p
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '14px',
                            fontWeight: 300,
                            color: 'rgba(218,198,171,0.85)',
                            lineHeight: 1.75,
                          }}
                        >
                          Align Your Energy. Attract Your Reality.
                        </p>
                        <p
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '14px',
                            fontWeight: 300,
                            color: 'rgba(218,198,171,0.82)',
                            lineHeight: 1.75,
                          }}
                        >
                          Manifestation is not just about desire—it is about alignment.
                          <br />
                          When your thoughts, emotions, and energy resonate with what you seek, the universe begins
                          to respond with effortless flow.
                          <br />
                          Alignment Sessions are designed to help you realign your inner world, so your outer reality
                          reflects the life you truly desire.
                        </p>
                      </div>

                      <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                          What this session focuses on
                        </p>
                        <ul
                          className="list-none space-y-2"
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '13px',
                            color: 'rgba(218,198,171,0.78)',
                          }}
                        >
                          <li>✨ Identifying energetic misalignment blocking your desires</li>
                          <li>✨ Clearing limiting beliefs and subconscious resistance</li>
                          <li>✨ Aligning your thoughts with your desired reality</li>
                          <li>✨ Strengthening your manifestation energy</li>
                          <li>✨ Activating clarity, confidence, and intention</li>
                        </ul>
                      </div>

                      <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                          What you will experience
                        </p>
                        <ul
                          className="list-none space-y-2"
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '13px',
                            color: 'rgba(218,198,171,0.78)',
                          }}
                        >
                          <li>✨ A deeply intuitive, personalized session</li>
                          <li>✨ Energetic and mindset alignment guidance</li>
                          <li>✨ Practical manifestation techniques tailored for you</li>
                          <li>✨ A renewed sense of clarity, belief, and direction</li>
                        </ul>
                      </div>

                      <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                          Who this is for
                        </p>
                        <ul
                          className="list-none space-y-2"
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '13px',
                            color: 'rgba(218,198,171,0.78)',
                          }}
                        >
                          <li>✨ Those trying to manifest love, money, or success</li>
                          <li>✨ Feeling stuck, blocked, or out of sync</li>
                          <li>✨ Losing motivation or belief in manifestation</li>
                          <li>✨ Ready to step into their next level reality</li>
                        </ul>
                      </div>

                      <div
                        className="rounded-lg border border-teal/25 bg-[rgba(37,96,96,0.08)] px-4 py-4"
                        style={{ backdropFilter: 'blur(8px)' }}
                      >
                        <p
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '13px',
                            fontWeight: 300,
                            color: 'rgba(218,198,171,0.82)',
                            lineHeight: 1.75,
                          }}
                        >
                          This is not about chasing outcomes—it is about becoming the version of you for whom those
                          outcomes are natural.
                          <br />
                          When alignment happens, manifestation becomes effortless.
                        </p>
                      </div>

                      <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="mb-2 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                          Sacred disclaimer
                        </p>
                        <ul
                          className="list-none space-y-2"
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '13px',
                            color: 'rgba(218,198,171,0.78)',
                          }}
                        >
                          <li>• This session offers spiritual and intuitive guidance</li>
                          <li>• Results may vary based on personal actions and mindset</li>
                          <li>• Not a substitute for medical, legal, or financial advice</li>
                        </ul>
                      </div>

                      <p
                        style={{
                          fontFamily: "'Gotham', system-ui, sans-serif",
                          fontSize: '13px',
                          fontWeight: 300,
                          color: 'rgba(218,198,171,0.78)',
                          lineHeight: 1.75,
                          fontStyle: 'italic',
                        }}
                      >
                        “You don’t attract what you want… you attract what you are aligned with.”
                      </p>

                      <div className="space-y-3">
                        <p className="font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                          Choose your Alignment experience
                        </p>

                        <div className="space-y-3">
                          {ALIGNMENT_SUBTYPES.map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => {
                                setSelectedAlignmentKey(s.key);
                                setAlignmentView('details');
                              }}
                              className="w-full rounded-lg border border-sand/15 bg-navy/30 px-4 py-4 text-left transition-colors hover:border-teal/40"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div
                                    style={{
                                      fontFamily: "'Gotham', system-ui, sans-serif",
                                      fontSize: '10px',
                                      fontWeight: 500,
                                      letterSpacing: '0.18em',
                                      textTransform: 'uppercase',
                                      color: 'rgba(37,96,96,0.95)',
                                    }}
                                  >
                                    {s.sacredWindow}
                                  </div>
                                  <div className="mt-2 font-heading text-sand" style={{ fontSize: '16px' }}>
                                    {s.title}
                                  </div>
                                  <div
                                    style={{
                                      fontFamily: "'Gotham', system-ui, sans-serif",
                                      fontSize: '12px',
                                      fontWeight: 300,
                                      color: 'rgba(218,198,171,0.7)',
                                      lineHeight: 1.45,
                                      marginTop: 2,
                                    }}
                                  >
                                    {s.tagline}
                                  </div>
                                </div>

                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : selectedAlignment ? (
                    <div className="space-y-6">
                      <button
                        type="button"
                        onClick={() => {
                          setAlignmentView('subtypes');
                          setSelectedAlignmentKey(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sand/80 transition-colors hover:text-teal"
                        style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px' }}
                      >
                        <ChevronLeft size={18} strokeWidth={1.5} />
                        Back to Alignment types
                      </button>

                      <div className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4" style={{ backdropFilter: 'blur(8px)' }}>
                        <p
                          className="uppercase tracking-[0.22em] text-teal/90"
                          style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
                        >
                          {selectedAlignment.sacredWindow}
                        </p>
                        <h3 className="font-heading text-sand" style={{ fontSize: '22px', marginTop: 8 }}>
                          {selectedAlignment.title}
                        </h3>

                        <p
                          style={{
                            fontFamily: "'Gotham', system-ui, sans-serif",
                            fontSize: '14px',
                            fontWeight: 300,
                            color: 'rgba(218,198,171,0.82)',
                            lineHeight: 1.75,
                            marginTop: 12,
                          }}
                        >
                          {selectedAlignment.description}
                        </p>

                        <div className="mt-4 flex flex-col">
                          <p className="mb-1 font-medium uppercase tracking-wider text-sand/50" style={{ fontSize: '10px' }}>
                            Energy exchange
                          </p>
                          <div
                            style={{
                              fontFamily: "'Gotham', system-ui, sans-serif",
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'rgba(218,198,171,0.45)',
                              textDecoration: 'line-through',
                            }}
                          >
                            INR {selectedAlignment.energyExchange.original}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Gotham', system-ui, sans-serif",
                              fontSize: '24px',
                              fontWeight: 900,
                              color: '#256060',
                            }}
                          >
                            INR {selectedAlignment.energyExchange.discounted}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 border-t border-sand/15 px-6 py-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-sand/25 px-5 py-2.5 text-sand/80 transition-colors hover:bg-sand/5"
                    style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.08em' }}
                  >
                    Close
                  </button>
                  {alignmentView === 'details' && selectedAlignment ? (
                    <button
                      type="button"
                      onClick={handleAlignmentBook}
                      className="rounded-lg bg-teal px-5 py-2.5 font-semibold text-sand transition-opacity hover:opacity-90"
                      style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.12em' }}
                    >
                      Book this service
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}

            {serviceId !== 'karmic' && serviceId !== 'alignment' ? (
              <>
                <div className="space-y-6 px-6 py-6">
                  <p
                    style={{
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'rgba(218,198,171,0.85)',
                      lineHeight: 1.75,
                    }}
                  >
                    {service.description}
                  </p>

                  <div
                    className="rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
                    style={{
                      fontFamily: "'Gotham', system-ui, sans-serif",
                      fontSize: '13px',
                      color: 'rgba(218,198,171,0.62)',
                      lineHeight: 1.65,
                    }}
                  >
                    <p className="mb-2 font-medium uppercase tracking-wider text-sand/45" style={{ fontSize: '10px' }}>
                      Fresh services coming soon
                    </p>
                    <p>
                      We&apos;re updating the session details for this offering. In the meantime, you can complete your booking using the button below.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-sand/15 px-6 py-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-sand/25 px-5 py-2.5 text-sand/80 transition-colors hover:bg-sand/5"
                    style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.08em' }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleBook}
                    className="rounded-lg bg-teal px-5 py-2.5 font-semibold text-sand transition-opacity hover:opacity-90"
                    style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.12em' }}
                  >
                    Book a session
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}

        {isArcana && arcanaView === 'details' && selectedArcana ? (
          <div className="flex flex-col gap-3 border-t border-sand/15 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-sand/25 px-5 py-2.5 text-sand/80 transition-colors hover:bg-sand/5"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.08em' }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleArcanaBook}
              className="rounded-lg bg-teal px-5 py-2.5 font-semibold text-sand transition-opacity hover:opacity-90"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', letterSpacing: '0.12em' }}
            >
              Book this service
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FeaturedServiceModal;
