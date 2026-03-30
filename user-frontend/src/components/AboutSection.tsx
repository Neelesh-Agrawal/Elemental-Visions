import React from 'react';

export const AboutSection: React.FC = () => (
  <section
    id="about"
    className="relative bg-sand py-24 px-4 sm:px-6"
    data-aos="fade-up"
  >
    {/* Top / bottom ornament lines */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-plum/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />

    <div className="relative mx-auto max-w-6xl">

      {/* ── SECTION HEADER ── */}
      <header className="mb-16 text-center">
        <p
          className="mb-3 uppercase tracking-[0.28em] text-teal"
          style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
        >
          Meet Sakshi
        </p>
        <h2 className="font-heading text-4xl text-plum sm:text-5xl">About Me</h2>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3" style={{ opacity: 0.35 }}>
          <div className="h-px w-16 bg-plum" />
          <div className="h-1.5 w-1.5 rotate-45 bg-plum flex-shrink-0" />
          <div className="h-px w-16 bg-plum" />
        </div>
      </header>

      {/* ══════════════════════════════════
          PART 1 — Photo LEFT + Story RIGHT
          Photo is sticky so left col stays
          filled while right col scrolls.
      ══════════════════════════════════ */}
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16 mb-16">

        {/* ── Photo col ── */}
        <aside className="flex justify-center lg:col-span-4 lg:justify-start">
          <figure className="w-full max-w-[300px] lg:max-w-none lg:sticky lg:top-28">
            <div className="relative">
              <div
                className="absolute inset-0 bg-plum/20"
                style={{ transform: 'translate(8px, 8px)', borderRadius: '14px' }}
                aria-hidden
              />
              <img
                src="/sakshi-about.png"
                alt="Sakshi — tarot, crystals, and intuitive guidance"
                className="relative z-10 w-full object-cover"
                style={{
                  aspectRatio: '4 / 5',
                  borderRadius: '14px',
                  boxShadow: '0 16px 48px -8px rgba(15,35,70,0.22)',
                }}
              />
            </div>
            <figcaption
              className="mt-5 text-center"
              style={{ borderTop: '1px solid rgba(88,32,69,0.18)', paddingTop: '14px' }}
            >
              <span
                className="block text-navy"
                style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em' }}
              >
                Sakshi
              </span>
              <span
                className="mt-1 block text-navy/55"
                style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '11px', fontWeight: 300, letterSpacing: '0.14em' }}
              >
                Tarot · Intuition · Elemental Vision
              </span>
            </figcaption>
          </figure>
        </aside>

        {/* ── Story col ── */}
        <div className="lg:col-span-8 space-y-8">

          {/* Opening */}
          <p
            className="text-navy/85"
            style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '17px', fontWeight: 300, lineHeight: 1.9 }}
          >
            There was a time when everything looked &ldquo;fine&rdquo; on the outside&hellip;
            but within, there were questions that refused to stay silent.
          </p>

          {/* Questions — left border */}
          <div className="border-l-[3px] border-plum/35 pl-7 space-y-4 py-1">
            <p
              className="uppercase tracking-[0.22em] text-plum"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '11px', fontWeight: 500 }}
            >
              Questions that stayed
            </p>
            {[
              'Why do patterns repeat?',
              'Why do some connections feel destined, yet difficult?',
              'Why does clarity come so late, after the lesson hurts?',
            ].map((q) => (
              <p
                key={q}
                className="text-navy/90"
                style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '16px', fontWeight: 300, lineHeight: 1.7 }}
              >
                {q}
              </p>
            ))}
          </div>

          {/* Born in that space */}
          <p
            className="text-navy/80"
            style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '16px', fontWeight: 300, lineHeight: 1.9 }}
          >
            Elemental Vision was born in that space &mdash; between confusion and awakening.
            Not from a place of perfection, but from a deep desire to understand life beyond the surface.
          </p>

          {/* ── What we give you — fills the lower left gap ── */}
          <div
            className="space-y-5 p-7"
            style={{
              background: 'rgba(37,96,96,0.06)',
              border: '1px solid rgba(37,96,96,0.18)',
              borderRadius: '14px',
            }}
          >
            <p
              className="text-navy/85"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '15px', fontWeight: 300, lineHeight: 1.8 }}
            >
              Here, we don&apos;t believe in fear-based readings.
              We don&apos;t give you dependency.
            </p>

            <p
              className="uppercase tracking-[0.22em] text-teal"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
            >
              We give you
            </p>

            <div className="grid grid-cols-2 gap-3">
              {['Clarity', 'Awareness', 'Alignment', 'Tools to take your power back'].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 bg-sand"
                  style={{
                    border: '1px solid rgba(37,96,96,0.2)',
                    borderRadius: '8px',
                    fontFamily: "'Gotham', system-ui, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(15,35,70,0.85)',
                  }}
                >
                  <span className="h-1.5 w-1.5 rotate-45 bg-teal flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <div className="pt-1 space-y-1">
              <p
                className="text-navy/70"
                style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '14px', fontWeight: 300 }}
              >
                Because you are not here to feel lost.
              </p>
              <p className="font-heading text-xl text-plum sm:text-2xl">
                You are here to evolve consciously
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          PART 2 — The Journey (full width)
      ══════════════════════════════════ */}
      <div
        className="p-8 sm:p-10 space-y-8 mb-10"
        style={{
          background: 'rgba(88,32,69,0.04)',
          border: '1px solid rgba(88,32,69,0.14)',
          borderRadius: '16px',
        }}
      >
        <div>
          <p
            className="uppercase tracking-[0.22em] text-plum mb-3"
            style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
          >
            The path
          </p>
          <h3 className="font-heading text-3xl text-navy sm:text-4xl">The journey</h3>
        </div>

        <p
          className="text-navy/75"
          style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '16px', fontWeight: 300, lineHeight: 1.85 }}
        >
          The journey began with curiosity&hellip; but soon transformed into something much deeper.
        </p>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            'Tarot was not just cards.',
            'Crystals were not just objects.',
            'Energy was not just a concept.',
          ].map((text) => (
            <div
              key={text}
              className="text-center px-5 py-5 bg-sand"
              style={{
                border: '1px solid rgba(37,96,96,0.2)',
                borderRadius: '10px',
                fontFamily: "'Gotham', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                color: 'rgba(15,35,70,0.8)',
                lineHeight: 1.65,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        <p
          className="text-navy"
          style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '15px', fontWeight: 500, letterSpacing: '0.02em' }}
        >
          They became languages of the soul.
        </p>

        <p
          className="text-navy/75"
          style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '16px', fontWeight: 300, lineHeight: 1.85 }}
        >
          With every reading, every pattern decoded, every alignment restored &mdash; one truth became clear:
        </p>

        {/* Blockquote */}
        <blockquote className="border-l-[3px] border-plum pl-7 py-1">
          <p className="font-heading text-2xl text-plum sm:text-3xl" style={{ lineHeight: 1.5 }}>
            Life is always speaking to us.
            <br />
            We&apos;re just not always listening.
          </p>
        </blockquote>
      </div>

      {/* ══════════════════════════════════
          PART 3 — Soul of Elemental Vision
      ══════════════════════════════════ */}
      <div
        className="p-8 sm:p-12"
        style={{ background: '#0F2346', borderRadius: '16px' }}
      >
        <div
          className="p-6 sm:p-8 space-y-6"
          style={{ border: '1px solid rgba(218,198,171,0.18)', borderRadius: '10px' }}
        >
          <div>
            <p
              className="uppercase tracking-[0.22em] text-teal mb-4"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
            >
              The Soul of Elemental Vision
            </p>
            <h3 className="font-heading text-3xl text-sand sm:text-4xl">
              Where elements meet clarity
            </h3>
          </div>

          <div
            className="space-y-5"
            style={{
              fontFamily: "'Gotham', system-ui, sans-serif",
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(218,198,171,0.78)',
            }}
          >
            <p>
              &ldquo;Elemental&rdquo; represents the core forces within you &mdash;
              earth (stability), air (thoughts), fire (action), water (emotions).
            </p>
            <p>
              &ldquo;Vision&rdquo; represents clarity &mdash;
              the ability to see your life with truth and purpose.
            </p>
          </div>

          <div
            className="pt-6"
            style={{ borderTop: '1px solid rgba(218,198,171,0.15)' }}
          >
            <p className="font-heading text-xl text-sand sm:text-2xl" style={{ lineHeight: 1.65 }}>
              Elemental Vision &mdash; where your inner elements align with your highest path.
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
);