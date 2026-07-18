type TrackProps = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Let tracking. Klar til GTM/Plausible — logger også i console i dev. */
export function track(event: string, props: TrackProps = {}) {
  const payload = { event, ...props, ts: Date.now() }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)

  window.dispatchEvent(new CustomEvent('staaklar:track', { detail: payload }))

  if (import.meta.env.DEV) {
    console.info('[track]', event, props)
  }
}
