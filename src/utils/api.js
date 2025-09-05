export async function postMode(mode) {
  try {
    await fetch('/api/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
  } catch (e) {
    // Swallow errors in dev; backend not required for UI responsiveness
    // console.warn('postMode failed', e)
  }
}

