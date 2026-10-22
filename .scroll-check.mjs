const { spawn } = await import('node:child_process')

const proc = spawn(
  'google-chrome',
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9333',
    '--user-data-dir=/tmp/zorge-chrome-scroll',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function version() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch('http://127.0.0.1:9333/json/version')
      if (res.ok) return res.json()
    } catch {
      await sleep(200)
    }
  }
  throw new Error('chrome debug port did not open')
}

const info = await version()
const ws = new WebSocket(info.webSocketDebuggerUrl)
let seq = 0
const pending = new Map()

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
})

await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve)
  ws.addEventListener('error', reject)
})

function send(method, params = {}, sessionId) {
  seq += 1
  const payload = { id: seq, method, params }
  if (sessionId) payload.sessionId = sessionId
  ws.send(JSON.stringify(payload))
  return new Promise((resolve) => pending.set(seq, resolve))
}

async function evaluate(sessionId, expression) {
  const response = await send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  )
  const result = response.result?.result
  if (result?.subtype === 'error') {
    throw new Error(result.description || 'evaluate failed')
  }
  return result?.value
}

const { result: { targetId } } = await send('Target.createTarget', {
  url: 'about:blank',
})
const { result: { sessionId } } = await send('Target.attachToTarget', {
  targetId,
  flatten: true,
})

await send(
  'Emulation.setDeviceMetricsOverride',
  { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  sessionId,
)
await send('Page.enable', {}, sessionId)
await send('Runtime.enable', {}, sessionId)
await send('Page.navigate', { url: 'http://127.0.0.1:5173/' }, sessionId)

const ready = await evaluate(
  sessionId,
  `new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      const btn = document.querySelector('.hero-project-btn--projects')
      if (btn) {
        resolve({ ok: true, ms: Date.now() - started })
        return
      }
      if (Date.now() - started > 20000) {
        resolve({
          ok: false,
          text: (document.body?.innerText || '').slice(0, 200),
        })
        return
      }
      setTimeout(tick, 250)
    }
    tick()
  })`,
)
console.log('ready', JSON.stringify(ready))

await evaluate(
  sessionId,
  `document.querySelector('.hero-project-btn--projects').click()`,
)
await sleep(400)
await evaluate(
  sessionId,
  `document.querySelector('.projects-overlay__card')?.click()`,
)

const onProject = await evaluate(
  sessionId,
  `new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      const page = document.querySelector('.project-page')
      if (page && (page.classList.contains('is-settled') || Date.now() - started > 4000)) {
        const wheel = new WheelEvent('wheel', {
          deltaY: 120,
          bubbles: true,
          cancelable: true,
        })
        page.dispatchEvent(wheel)
        page.scrollTop = 600
        const style = getComputedStyle(page)
        resolve({
          href: location.pathname,
          settled: page.classList.contains('is-settled'),
          client: page.clientHeight,
          scroll: page.scrollHeight,
          scrollTop: page.scrollTop,
          transform: style.transform,
          overflowY: style.overflowY,
          prevented: wheel.defaultPrevented,
          lenisStopped: !!window.__dayimLenis?.isStopped,
          bodyOverflow: document.body.style.overflow,
        })
        return
      }
      if (Date.now() - started > 8000) {
        resolve({ href: location.pathname, missing: true })
        return
      }
      setTimeout(tick, 200)
    }
    tick()
  })`,
)
console.log('project', JSON.stringify(onProject))

await evaluate(
  sessionId,
  `document.querySelector('.project-nav__home')?.click()`,
)

const home = await evaluate(
  sessionId,
  `new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      const page = document.querySelector('.project-page')
      const overlay = document.querySelector('.projects-overlay.is-open')
      if (!page && !overlay) {
        const wheel = new WheelEvent('wheel', {
          deltaY: 120,
          bubbles: true,
          cancelable: true,
        })
        document.body.dispatchEvent(wheel)
        window.__dayimLenis?.scrollTo?.(500, { immediate: true })
        resolve({
          href: location.pathname,
          lenisStopped: !!window.__dayimLenis?.isStopped,
          bodyOverflow: document.body.style.overflow,
          htmlOverflow: document.documentElement.style.overflow,
          prevented: wheel.defaultPrevented,
          lenisScroll: Math.round(window.__dayimLenis?.scroll || 0),
          ms: Date.now() - started,
        })
        return
      }
      if (Date.now() - started > 8000) {
        resolve({
          href: location.pathname,
          stillProject: !!page,
          overlay: !!overlay,
          lenisStopped: !!window.__dayimLenis?.isStopped,
          bodyOverflow: document.body.style.overflow,
        })
        return
      }
      setTimeout(tick, 200)
    }
    tick()
  })`,
)
console.log('home', JSON.stringify(home))

ws.close()
proc.kill()
process.exit(0)
