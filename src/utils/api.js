const BASE = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')

export async function postMode(mode) {
  try {
    const url = BASE ? `${BASE}/api/mode` : '/api/mode'
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
  } catch (e) {
    // Swallow errors in dev; backend not required for UI responsiveness
    // console.warn('postMode failed', e)
  }
}
