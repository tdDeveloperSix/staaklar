import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const navLinks = [
  { href: '#baggrund', label: 'Om os' },
  { href: '#ydelser', label: 'Ydelser' },
  { href: '#forlob', label: 'Sådan gør vi' },
  { href: '#kontakt', label: 'Kontakt' },
]

const credentials = [
  {
    title: 'Politimand',
    text: 'Vant til at læse en situation hurtigt og træffe beslutninger, når presset er højt. Den erfaring tager vi med, når vi hjælper jer med at blive klar.',
  },
  {
    title: 'Militærofficer',
    text: 'God til planer, der kan bruges i virkeligheden — ikke bare se pæne ud på papiret. Simpelt, tydeligt og til at følge, når det haster.',
  },
  {
    title: 'Brandmand & brandsikringsrådgiver',
    text: 'Har både slukket brande og rådgivet om, hvordan man undgår dem. Praktisk viden om brand, røg og sikring — før noget går galt, og hvis det gør.',
  },
]

const offerings = [
  {
    title: 'Hjemmeberedskab',
    price: 'Fra 4.900 kr.',
    text: 'Vi kigger på jeres hjem, laver en enkel plan for familien og øver det vigtigste, så I ved, hvad I gør, hvis noget sker.',
  },
  {
    title: 'Virksomhedsberedskab',
    price: 'Fra 14.900 kr.',
    text: 'Vi hjælper jer med at finde hullerne, lave en plan der kan bruges, og træne dem der skal tage ansvar, hvis noget går galt.',
  },
  {
    title: 'Brand & sikring',
    price: 'Efter aftale',
    text: 'Gennemgang af bygning og vaner, og konkrete råd I kan gå i gang med med det samme — uden unødvendigt bøvl.',
  },
  {
    title: 'Kurser & øvelser',
    price: 'Fra 2.400 kr.',
    text: 'Korte kurser i det, der betyder noget: brandslukning, førstehjælp og at holde hovedet koldt, når noget uventet sker.',
  },
]

const steps = [
  {
    title: 'Vi taler sammen',
    text: 'Først finder vi ud af, hvad I er bekymrede for, og hvad I allerede har styr på. Ingen lange rapporter — bare ærlig snak.',
  },
  {
    title: 'Plan og øvelse',
    text: 'I får en plan, der er til at forstå, og vi øver det vigtigste sammen, så det sidder i kroppen.',
  },
  {
    title: 'Vi holder det ved lige',
    text: 'Vi følger op, så planen ikke samler støv. Lidt genopfriskning en gang imellem gør en stor forskel.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [sent, setSent] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  const reveal = reduceMotion
    ? {}
    : {
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0.25 },
        variants: fadeUp,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <div className="site">
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a className="nav__brand" href="#top">
          STÅKLAR
        </a>
        <ul className="nav__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <a className="nav__cta" href="#kontakt">
          Book en snak
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero__media" aria-hidden="true">
            <img src="/hero.jpg" alt="" width={2400} height={1600} />
          </div>
          <div className="hero__shade" />
          <div className="hero__grain" />
          <div className="hero__content">
            <h1 className="hero__brand hero__reveal">
              STÅ<span>KLAR</span>
            </h1>
            <p className="hero__headline hero__reveal hero__reveal--2">
              Beredskab fra folk, der har prøvet det
            </p>
            <p className="hero__lead hero__reveal hero__reveal--3">
              Vi er tre: en politimand, en militærofficer og en brandmand, der også er brandsikringsrådgiver. Vi hjælper hjem og virksomheder med at være klar — uden dikkedarer.
            </p>
            <div className="hero__actions hero__reveal hero__reveal--4">
              <a className="btn btn--primary" href="#kontakt">
                Book en uforpligtende snak
              </a>
              <a className="btn btn--ghost" href="#ydelser">
                Se hvad vi tilbyder
              </a>
            </div>
          </div>
        </section>

        <section className="section usp" id="baggrund">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">Om os</p>
              <h2 className="section__title">Tre fagfolk. Én fælles sag.</h2>
              <p className="section__text">
                Vi har ikke lært det her fra en bog. Vi har arbejdet med det i politiet, forsvaret og brandvæsenet — og nu hjælper vi andre med at stå klar, når det gælder.
              </p>
            </motion.div>
            <div className="usp__grid">
              {credentials.map((item, index) => (
                <motion.article
                  className="usp__item"
                  key={item.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="usp__index">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section offer" id="ydelser">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">Ydelser</p>
              <h2 className="section__title">Det vi kan hjælpe med</h2>
              <p className="section__text">
                Fra en plan til familien derhjemme til beredskab på arbejdspladsen. Altid tilpasset jer — ikke en færdig skabelon.
              </p>
            </motion.div>
            <div className="offer__list">
              {offerings.map((item, index) => (
                <motion.article
                  className="offer__row"
                  key={item.title}
                  initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="offer__price">{item.price}</span>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process" id="forlob">
          <div className="section__inner">
            <motion.div {...reveal}>
              <p className="section__label">Sådan gør vi</p>
              <h2 className="section__title">Enkelt fra start til slut</h2>
              <p className="section__text">
                Vi holder det overskueligt. I skal vide, hvad der sker, hvem der gør hvad — og have prøvet det af.
              </p>
            </motion.div>
            <div className="process__steps">
              {steps.map((step, index) => (
                <motion.article
                  className="process__step"
                  key={step.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="proof" aria-label="Citat">
          <div className="proof__media" aria-hidden="true">
            <img src="/proof.jpg" alt="" width={2000} height={1200} />
          </div>
          <div className="proof__shade" />
          <motion.blockquote
            className="proof__quote"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              »Beredskab handler ikke om at være bange. Det handler om at vide, hvad I gør — så I kan beholde roen, hvis noget sker.«
            </p>
            <cite>Ståklar</cite>
          </motion.blockquote>
        </section>

        <section className="section contact" id="kontakt">
          <div className="section__inner contact__layout">
            <motion.div {...reveal}>
              <p className="section__label">Kontakt</p>
              <h2 className="section__title">Skal vi tage en snak?</h2>
              <p className="section__text" style={{ marginBottom: '2rem' }}>
                Skriv kort, hvad I har brug for. Vi vender tilbage inden for en hverdag.
              </p>

              {sent ? (
                <div className="form-success" role="status">
                  Tak for beskeden — vi vender tilbage snart.
                </div>
              ) : (
                <form className="contact__form" onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="name">Navn</label>
                    <input id="name" name="name" type="text" autoComplete="name" required />
                  </div>
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                  </div>
                  <div className="field">
                    <label htmlFor="interest">Hvad drejer det sig om?</label>
                    <select id="interest" name="interest" defaultValue="hjem">
                      <option value="hjem">Hjemmeberedskab</option>
                      <option value="virksomhed">Virksomhedsberedskab</option>
                      <option value="brand">Brand & sikring</option>
                      <option value="kursus">Kurser & øvelser</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="message">Besked</label>
                    <textarea id="message" name="message" placeholder="Fortæl gerne lidt om, hvad I gerne vil have styr på" />
                  </div>
                  <button className="btn btn--primary btn--block" type="submit">
                    Send besked
                  </button>
                  <p className="form-note">Formularen er til demo — den kan kobles til jeres mail senere.</p>
                </form>
              )}
            </motion.div>

            <aside className="contact__aside">
              <strong>Ring eller skriv</strong>
              <p style={{ marginBottom: '1.25rem' }}>
                Hellere en hurtig snak først? Det er også fint.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <a href="mailto:hej@staaklar.dk">hej@staaklar.dk</a>
              </p>
              <p>
                <a href="tel:+4552123456">+45 52 12 34 56</a>
              </p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__brand">STÅKLAR</span>
          <span>Politi · Forsvar · Brand</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
