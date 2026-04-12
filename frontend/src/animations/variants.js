/**
 * EstudioA — Framer Motion animation variants
 * Shared easing: ease-out-expo (matches --ease-out-expo design token)
 */

const ease = [0.19, 1, 0.22, 1]

// ─── Word-level blur + rise (BlurText) ───────────────────────────────────────

export const blurWord = {
  hidden: { opacity: 0, y: 45, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, ease },
  },
}

// Parent container for word stagger — accepts delayChildren and staggerChildren
export const wordContainer = (delayChildren = 0, staggerChildren = 0.09) => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})

// ─── Body text / paragraph ────────────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease },
  },
}

// ─── CTA / buttons ───────────────────────────────────────────────────────────

export const ctaVariant = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease },
  },
}

// ─── Card (scale + elevation) ────────────────────────────────────────────────

export const cardItem = {
  hidden: { opacity: 0, y: 32, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease },
  },
}

// ─── Feature card (depth — requires perspective on parent) ───────────────────

export const featureCard = {
  hidden: { opacity: 0, y: 40, rotateX: 8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.6, ease },
  },
}

// ─── Image / media reveal ────────────────────────────────────────────────────

export const imageReveal = {
  hidden: { opacity: 0, scale: 1.06, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease },
  },
}

// ─── Stagger grid container ──────────────────────────────────────────────────

export const staggerContainer = (delayChildren = 0.05, staggerChildren = 0.1) => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})
