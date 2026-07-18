import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { track } from './lib/track'

const navLinks = [
  { href: '#tanker', label: 'Det I tænker' },
  { href: '#sandt', label: 'Det der er sandt' },
  { href: '#hvem', label: 'Hvem vi er' },
  { href: '#snak', label: 'En snak' },
]

const accusations = [
  'At det her er paranoia.',
  'At I har styr på det i forvejen.',
  'At det aldrig sker for jer.',
  'At en mappe på hylden er det samme som at være klar.',
  'At I ikke har tid til endnu et “projekt”.',
]

const people = [
  {
    role: 'Politimand',
    line: 'Jeg har set, hvad der sker, når folk skal beslutte under pres — uden en plan.',
  },
  {
    role: 'Militærofficer',
    line: 'Jeg laver planer, man kan bruge, når hovedet ikke er klart. Ikke planer, der ser pæne ud.',
  },
  {
    role: 'Brandmand & brandsikringsrådgiver',
    line: 'Jeg har både slukket brande og hjulpet folk med at undgå dem. Begge dele tæller.',
  },
]

const truths = [
  {
    q: 'Hvad I egentlig vil',
    a: 'Ikke være bange. Bare vide, hvad I gør, hvis noget sker.',
  },
  {
    q: 'Hvad I ikke vil',
    a: 'En tyk rapport. Et kursus, I glemmer. En følelse af, at nogen taler ned til jer.',
  },
  {
    q: 'Hvad der faktisk virker',
    a: 'En enkel plan. Lidt øvelse. Og nogen, der har stået i det før.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [saidNo, setSaidNo] = useState<null | 'yes' | 'curious'>(null)
  const reduceMotion = useReducedMotion()
  const menuId = useId()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    track('page_view')
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    track('form_submit')
    setSent(true)
  }

  const reveal = reduceMotion
    ? {}
    : {
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0.2 },
        variants: fadeUp,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Spring til indhold
      </a>

      <header className={`nav${scrolled || menuOpen ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
        <a className="nav__brand" href="#top" onClick={closeMenu}>
          STÅ<span>KLAR</span>
        </a>

        <nav className="nav__desktop" aria-label="Primær">
          <ul className="nav__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <a
            className="nav__cta"
            href="#snak"
            onClick={() => {
              track('nav_cta')
              closeMenu()
            }}
          >
            <span className="nav__cta-full">Er det en dårlig idé?</span>
            <span className="nav__cta-short">En snak?</span>
          </a>
          <button
            type="button"
            className={`nav__toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id={menuId}
        className={`nav__drawer${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        <nav aria-label="Mobilmenu">
          <ul className="nav__drawer-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            className="btn btn--primary btn--block"
            href="#snak"
            onClick={() => {
              track('nav_cta', { source: 'drawer' })
              closeMenu()
            }}
          >
            Nej — lad os snakke
          </a>
        </nav>
      </div>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero__media" aria-hidden="true">
            <img src="/hero.jpg" alt="" width={2400} height={1600} fetchPriority="high" />
          </div>
          <div className="hero__shade" />
          <div className="hero__grain" />
          <div className="hero__content">
            <h1 className="hero__brand hero__reveal">
              STÅ<span>KLAR</span>
            </h1>
            <p className="hero__question hero__reveal hero__reveal--2">
              Har I egentlig en plan — eller bare en god fornemmelse?
            </p>
            <p className="hero__lead hero__reveal hero__reveal--3">
              Ikke en mappe. Ikke et kursus, I glemmer. En plan I kan bruge — fra folk, der har stået i det.
            </p>
            <div className="hero__actions hero__reveal hero__reveal--4">
              <a
                className="btn btn--primary"
                href="#bevis"
                onClick={() => track('hero_sounds_familiar')}
              >
                Det lyder bekendt
              </a>
              <a
                className="btn btn--ghost"
                href="#snak"
                onClick={() => track('hero_skip_to_talk')}
              >
                Spring til snakken
              </a>
            </div>
          </div>
        </section>

        {/* Proof early + daylight contrast */}
        <section className="day" id="bevis">
          <div className="day__inner">
            <motion.div className="day__copy" {...reveal}>
              <p className="day__kicker">Et konkret eksempel</p>
              <h2 className="day__title">En eftermiddag. Tre aftaler. Ro i maven.</h2>
              <p className="day__text">
                Vi hjalp en familie i et rækkehus med tre ting: hvor brandslukkeren skal stå, hvem der henter børnene, og hvad I gør, hvis strømmen går. Ingen mappe på 40 sider. Bare noget, alle kunne huske — også børnene.
              </p>
              <p className="day__text day__text--soft">
                Det er sådan vi arbejder. Småt. Tydeligt. Til at bruge.
              </p>
            </motion.div>
            <motion.aside className="day__aside" {...reveal}>
              <p className="day__stat">3</p>
              <p className="day__stat-label">aftaler, familien kunne gentage samme aften</p>
              <a className="day__link" href="#tanker" onClick={() => track('proof_continue')}>
                Fortsæt →
              </a>
            </motion.aside>
          </div>
        </section>

        <section className="audit" id="tanker">
          <div className="audit__inner">
            <motion.h2 className="audit__title" {...reveal}>
              I tænker sikkert…
            </motion.h2>
            <ul className="audit__list">
              {accusations.map((line, index) => (
                <motion.li
                  key={line}
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="audit__dash" aria-hidden="true">
                    —
                  </span>
                  {line}
                </motion.li>
              ))}
            </ul>
            <motion.p className="audit__close" {...reveal}>
              Hvis noget af det rammer, er I ikke svære. I er normale.
            </motion.p>
          </div>
        </section>

        <section className="right" id="sandt">
          <div className="right__stage">
            <motion.blockquote className="right__quote" {...reveal}>
              <p>
                »Vi vil ikke være bange. Vi vil bare vide, hvad vi gør — så vi kan beholde roen, hvis noget sker.«
              </p>
            </motion.blockquote>
            <motion.p className="right__confirm" {...reveal}>
              Hvis det lyder rigtigt, behøver I ikke sige ja. Det er nok, at det føles sandt.
            </motion.p>
          </div>

          <div className="right__grid">
            {truths.map((item, index) => (
              <motion.article
                key={item.q}
                className="right__card"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="who" id="hvem">
          <div className="who__intro">
            <motion.h2 className="who__title" {...reveal}>
              Tre mennesker. Ingen slides.
            </motion.h2>
            <motion.p className="who__text" {...reveal}>
              En politimand, en militærofficer og en brandmand, der også er brandsikringsrådgiver. Vi siger det, andre pakker ind.
            </motion.p>
          </div>

          <div className="who__lanes">
            {people.map((person, index) => (
              <motion.article
                key={person.role}
                className="who__lane"
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="who__num" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{person.role}</h3>
                <p>{person.line}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="deal" id="hvad">
          <div className="deal__panel">
            <motion.div {...reveal}>
              <h2 className="deal__title">Hvis vi snakker, ser det sådan ud</h2>
            </motion.div>
            <ol className="deal__steps">
              <motion.li {...reveal}>
                <strong>Vi lytter først.</strong> Hvad bekymrer jer? Hvad har I allerede?
              </motion.li>
              <motion.li {...reveal}>
                <strong>Vi siger det ligeud.</strong> Hvad der mangler — og hvad der er spild af tid.
              </motion.li>
              <motion.li {...reveal}>
                <strong>I får noget, I kan bruge.</strong> Plan og øvelse, tilpasset jer. Hjem fra 4.900 kr. Virksomhed fra 14.900 kr.
              </motion.li>
            </ol>
            <motion.p className="deal__note" {...reveal}>
              Ingen binding i første snak. Hvis det ikke er jer, siger vi det også.
            </motion.p>
          </div>
        </section>

        <section className="close" id="snak">
          <div className="close__visual" aria-hidden="true">
            <img src="/proof.jpg" alt="" width={2000} height={1200} loading="lazy" />
            <div className="close__shade" />
          </div>

          <div className="close__content">
            <motion.h2 className="close__question" {...reveal}>
              Er det en dårlig idé at tage en uforpligtende snak?
            </motion.h2>
            <motion.p className="close__help" {...reveal}>
              Det sikre svar er ofte nej. Nej til at udskyde. Nej til at gætte.
            </motion.p>

            {saidNo === null ? (
              <motion.div className="close__choices" {...reveal}>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    track('close_yes_talk')
                    setSaidNo('yes')
                  }}
                >
                  Nej — lad os snakke
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    track('close_not_sure')
                    setSaidNo('curious')
                  }}
                >
                  Jeg er ikke sikker endnu
                </button>
              </motion.div>
            ) : null}

            {saidNo === 'curious' ? (
              <motion.div className="close__nudge" {...reveal}>
                <p>Fair. Usikkerhed er ikke et nej — det er ofte tegn på, at noget her betyder noget.</p>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    track('close_yes_after_nudge')
                    setSaidNo('yes')
                  }}
                >
                  Okay — så skriv alligevel
                </button>
              </motion.div>
            ) : null}

            {saidNo === 'yes' || sent ? (
              <motion.div className="close__form-wrap" {...reveal}>
                {sent ? (
                  <div className="form-success" role="status">
                    Tak. Vi vender tilbage inden for en hverdag — med et konkret næste skridt.
                  </div>
                ) : (
                  <form className="contact__form" onSubmit={handleSubmit}>
                    <p className="close__form-lead">Godt. Tre felter — så tager vi den derfra.</p>
                    <div className="field">
                      <label htmlFor="name">Navn</label>
                      <input id="name" name="name" type="text" autoComplete="name" required />
                    </div>
                    <div className="field">
                      <label htmlFor="email">E-mail</label>
                      <input id="email" name="email" type="email" autoComplete="email" required />
                    </div>
                    <div className="field">
                      <label htmlFor="message">Hvad fylder?</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Hvad bekymrer jer — eller hvad vil I have styr på?"
                        required
                      />
                    </div>
                    <button className="btn btn--primary btn--block" type="submit">
                      Send
                    </button>
                  </form>
                )}
              </motion.div>
            ) : null}

            <aside className="close__direct">
              <p>Hellere ringe?</p>
              <a href="tel:+4552123456" onClick={() => track('click_phone')}>
                +45 52 12 34 56
              </a>
              <a href="mailto:hej@staaklar.dk" onClick={() => track('click_email')}>
                hej@staaklar.dk
              </a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__brand">
            STÅ<span>KLAR</span>
          </span>
          <span className="footer__meta">Klarhed uden dikkedarer.</span>
          <span className="footer__copy">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
