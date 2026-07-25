import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { track } from './lib/track'

const navLinks = [
  { href: '#tanker', label: 'Overvejelser' },
  { href: '#sandt', label: 'Løsningen' },
  { href: '#fagligheder', label: 'Faglighederne' },
  { href: '#om-os', label: 'Om os' },
  { href: '#snak', label: 'Kontakt' },
]

const accusations = [
  'I har allerede leverandører og ansvarlige på de enkelte områder.',
  'De enkelte planer fungerer måske udmærket hver for sig.',
  'Et samlet beredskab kan lyde som et stort og tungt projekt.',
  'I ønsker ikke endnu et rådgivningsforløb, der ender i en mappe.',
]

const disciplines = [
  {
    role: 'Brandsikkerhed',
    line: 'Forebyggelse, beredskab og tydelige handlinger, der beskytter mennesker, bygninger og drift ved brand.',
  },
  {
    role: 'Fysisk sikkerhed',
    line: 'Beskyttelse af mennesker, adgang, bygninger og kritiske funktioner med fokus på at reducere sårbarheder.',
  },
  {
    role: 'Cybersikkerhed',
    line: 'Overblik over digitale risici, afhængigheder og reaktioner, når systemer eller data bliver påvirket.',
  },
  {
    role: 'Krisestyring',
    line: 'Klare roller, beslutningsveje og kommunikation, så ledelsen kan handle samlet under pres.',
  },
]

const personas = [
  {
    name: 'Karsten',
    area: 'Brand og forebyggelse',
    role: 'Brandmand og uddannet brandsikringsrådgiver',
    line: 'Karsten ser brandsikkerhed fra begge sider: den akutte indsats, når det brænder, og det grundige arbejde, der skal forhindre, at det sker. Han bidrager med et praktisk blik på mennesker, bygninger og beredskab.',
  },
  {
    name: 'Claus',
    area: 'Politi og beredskab',
    role: 'Politimand med 25 års erfaring',
    line: 'Claus har 25 års erfaring fra politiet, blandt andet fra beredskabspatruljer. Han bidrager med situationsforståelse og et skarpt blik for, hvordan mennesker, ansvar og beslutninger fungerer under pres.',
  },
  {
    name: 'Mikkel',
    area: 'Forsvar og sikkerhed',
    role: 'Tidligere major i Forsvaret',
    line: 'Mikkel er tidligere major i Forsvaret og har arbejdet professionelt med fysisk og virtuel sikkerhed på topledelsesniveau. Han bidrager med strategisk overblik og blik for sammenhængen mellem risiko, sikkerhed og ledelsesansvar.',
  },
]

const truths = [
  {
    q: 'Det skal I beskytte',
    a: 'Mennesker, drift, bygninger, data og tillid.',
  },
  {
    q: 'Det skal I undgå',
    a: 'Uklare ansvar, modstridende planer og beslutninger, der først bliver koordineret under en hændelse.',
  },
  {
    q: 'Det skaber sammenhæng',
    a: 'Fælles prioriteringer, tydelige roller og handlinger, der er afstemt på tværs af faglighederne.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const subject = encodeURIComponent(`Henvendelse fra ${name}`)
    const body = encodeURIComponent(`Navn: ${name}\nE-mail: ${email}\n\n${message}`)
    track('form_submit')
    window.location.href = `mailto:hej@staaklar.dk?subject=${subject}&body=${body}`
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
            <span className="nav__cta-full">Tag en kort snak</span>
            <span className="nav__cta-short">Kontakt</span>
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
            Tag en kort snak
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
            <p className="hero__eyebrow hero__reveal">Sammenhængende beredskab for virksomheder</p>
            <p className="hero__brand hero__reveal">
              STÅ<span>KLAR</span>
            </p>
            <h1 className="hero__question hero__reveal hero__reveal--2">
              Har I fire sikkerhedsløsninger — eller ét samlet beredskab?
            </h1>
            <p className="hero__lead hero__reveal hero__reveal--3">
              Ståklar samler brandsikkerhed, fysisk sikkerhed, cybersikkerhed og krisestyring. I får én partner, ét samlet risikobillede og en plan, der hænger sammen på tværs.
            </p>
            <div className="hero__actions hero__reveal hero__reveal--4">
              <a
                className="btn btn--primary"
                href="#bevis"
                onClick={() => track('hero_sounds_familiar')}
              >
                Se, hvordan vi arbejder
              </a>
              <a
                className="btn btn--ghost"
                href="#snak"
                onClick={() => track('hero_skip_to_talk')}
              >
                Tag den korte snak
              </a>
            </div>
          </div>
        </section>

        <section className="day" id="bevis">
          <div className="day__inner">
            <motion.div className="day__copy" {...reveal}>
              <p className="day__kicker">Krisen følger ikke jeres organisationsdiagram</p>
              <h2 className="day__title">Hændelsen rammer på tværs. Beredskabet skal gøre det samme.</h2>
              <p className="day__text">
                En alvorlig hændelse påvirker sjældent kun ét område. Den kan berøre mennesker, bygninger, adgang, digitale systemer og den daglige drift på samme tid. Samtidig skal ledelsen kunne prioritere, beslutte og kommunikere under pres.
              </p>
              <p className="day__text day__text--soft">
                Når fagområderne har hver deres ansvarlige, leverandør og plan, kan der opstå huller mellem dem. Ståklar samler områderne, så ansvar, afhængigheder og handlinger hænger sammen.
              </p>
            </motion.div>
            <motion.aside className="day__aside" {...reveal}>
              <p className="day__model-label">Det betyder i praksis</p>
              <ul className="day__model">
                <li>Én indgang</li>
                <li>Ét samlet blik på risikoen</li>
                <li>Én fælles retning</li>
              </ul>
              <a className="day__link" href="#tanker" onClick={() => track('proof_continue')}>
                Fortsæt →
              </a>
            </motion.aside>
          </div>
        </section>

        <section className="audit" id="tanker">
          <div className="audit__inner">
            <motion.h2 className="audit__title" {...reveal}>
              Det her tænker I måske allerede
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
              Det er forståeligt. Områderne har ofte forskellige ejere, budgetter og leverandører. Det er netop derfor, mellemrummene let bliver overset.
            </motion.p>
          </div>
        </section>

        <section className="right" id="sandt">
          <div className="right__stage">
            <motion.h2 className="right__quote" {...reveal}>
              I mangler ikke nødvendigvis flere specialister.
            </motion.h2>
            <motion.p className="right__confirm" {...reveal}>
              I har brug for, at den eksisterende viden arbejder ud fra det samme risikobillede og den samme retning. Det er forskellen på fire separate ydelser og ét samlet beredskab.
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

        <section className="who" id="fagligheder">
          <div className="who__intro">
            <motion.h2 className="who__title" {...reveal}>
              Fire fagligheder. Én fælles retning.
            </motion.h2>
            <motion.p className="who__text" {...reveal}>
              Hvert fagområde har sit eget fokus. Ståklars styrke er ikke kun de fire fagligheder, men arbejdet mellem dem. Her bliver afhængigheder tydelige, ansvar afstemt og løsninger vurderet som en del af virksomhedens samlede beredskab.
            </motion.p>
          </div>

          <div className="who__lanes">
            {disciplines.map((discipline, index) => (
              <motion.article
                key={discipline.role}
                className="who__lane"
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="who__num" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{discipline.role}</h3>
                <p>{discipline.line}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="about" id="om-os">
          <div className="about__inner">
            <div className="about__header">
              <motion.div {...reveal}>
                <p className="about__kicker">Mikkel, Claus og Karsten</p>
                <h2 className="about__title">Tre mennesker. Ét fælles ansvar.</h2>
              </motion.div>
              <motion.p className="about__intro" {...reveal}>
                Bag Ståklar står tre mennesker med hver deres vej ind i sikkerhed og beredskab. Karsten kommer fra brandvæsenet, Claus fra politiet og Mikkel fra Forsvaret og arbejdet med sikkerhed på ledelsesniveau. Sammen ser de både den konkrete hændelse, den menneskelige reaktion og ledelsens ansvar.
              </motion.p>
            </div>

            <div className="about__grid">
              {personas.map((person, index) => (
                <motion.article
                  key={person.role}
                  className="about__card"
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="about__card-top">
                    <span className="about__num" aria-hidden="true">0{index + 1}</span>
                    <span className="about__area">{person.area}</span>
                  </div>
                  <h3>{person.name}</h3>
                  <p className="about__role">{person.role}</p>
                  <p>{person.line}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="deal" id="hvad">
          <div className="deal__panel">
            <motion.div {...reveal}>
              <h2 className="deal__title">Fra fire fagområder til én fælles retning</h2>
            </motion.div>
            <ol className="deal__steps">
              <motion.li {...reveal}>
                <strong>Vi skaber overblik.</strong> Hvad skal I beskytte? Hvad har I allerede? Hvem har ansvaret, og hvor er I mest i tvivl?
              </motion.li>
              <motion.li {...reveal}>
                <strong>Vi finder mellemrummene.</strong> Vi ser på afhængigheder, overdragelser og beslutninger mellem brandsikkerhed, fysisk sikkerhed, cybersikkerhed og krisestyring.
              </motion.li>
              <motion.li {...reveal}>
                <strong>Vi prioriterer næste skridt.</strong> I får en tydelig retning for de tiltag, planer og øvelser, der skal hænge sammen på tværs af de relevante områder.
              </motion.li>
            </ol>
            <motion.p className="deal__note" {...reveal}>
              Indsatsen tager udgangspunkt i jeres virksomhed, jeres eksisterende beredskab og de risici, der er vigtigst at håndtere. Hvis vi ikke er det rette match, siger vi det.
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
              Ville det være en dårlig idé at få et blik udefra på, hvor jeres beredskab ikke hænger sammen?
            </motion.h2>
            <motion.p className="close__help" {...reveal}>
              I behøver ikke have defineret opgaven på forhånd. En kort samtale er nok til at afklare, om der er noget, vi bør se nærmere på sammen.
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
                  Nej — lad os tage en snak
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    track('close_not_sure')
                    setSaidNo('curious')
                  }}
                >
                  Jeg er ikke klar endnu
                </button>
              </motion.div>
            ) : null}

            {saidNo === 'curious' ? (
              <motion.div className="close__nudge" {...reveal}>
                <p>Det er helt fair. I behøver ikke have defineret opgaven på forhånd. Beskriv kort, hvad I er i tvivl om, så kan vi tage udgangspunkt i det.</p>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    track('close_yes_after_nudge')
                    setSaidNo('yes')
                  }}
                >
                  Beskriv det kort
                </button>
              </motion.div>
            ) : null}

            {saidNo === 'yes' ? (
              <motion.div className="close__form-wrap" {...reveal}>
                <form className="contact__form" onSubmit={handleSubmit}>
                  <p className="close__form-lead">Udfyld de tre felter, så åbner vi henvendelsen i jeres mailprogram.</p>
                  <div className="field">
                    <label htmlFor="name">Navn</label>
                    <input id="name" name="name" type="text" autoComplete="name" required />
                  </div>
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                  </div>
                  <div className="field">
                    <label htmlFor="message">Hvad vil I gerne have afklaret?</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Beskriv kort den risiko, hændelse eller udfordring, I gerne vil have styr på."
                      required
                    />
                  </div>
                  <button className="btn btn--primary btn--block" type="submit">
                    Åbn henvendelse i mail
                  </button>
                </form>
              </motion.div>
            ) : null}

            <aside className="close__direct">
              <p>Hellere tage den direkte?</p>
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
          <span className="footer__meta">Fire fagligheder. Ét beredskab.</span>
          <span className="footer__copy">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
