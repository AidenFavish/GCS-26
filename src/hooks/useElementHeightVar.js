import { useEffect } from 'react'

export function useElementHeightVar(ref, cssVarName) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const node = ref.current
    const root = document.documentElement
    if (!node || !root) return

    const update = () => {
      root.style.setProperty(cssVarName, `${node.offsetHeight}px`)
    }

    update()

    let frame
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        if (frame) cancelAnimationFrame(frame)
        frame = requestAnimationFrame(update)
      })
      observer.observe(node)

      const cleanup = () => {
        if (frame) cancelAnimationFrame(frame)
        observer.disconnect()
        root.style.removeProperty(cssVarName)
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', update)
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', update)
        }
        cleanup()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', update)
      }
      root.style.removeProperty(cssVarName)
    }
  }, [ref, cssVarName])
}
