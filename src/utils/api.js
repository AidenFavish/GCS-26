const BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '')

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

export async function postChecklistAction(section, item) {
  try {
    const url = BASE ? `${BASE}/api/checklist` : '/api/checklist'
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, item }),
    })
  } catch (e) {
    // Swallow errors in dev; backend not required for UI responsiveness
    // console.warn('postChecklistAction failed', e)
  }
}

export async function postArmScriptAction(timestamp) {
  try {
    const url = BASE ? `${BASE}/api/arm-script` : '/api/arm-script'
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp }),
    })
  } catch (e) {
    // Swallow errors in dev; backend not required for UI responsiveness
    // console.warn('postChecklistAction failed', e)
  }
}
