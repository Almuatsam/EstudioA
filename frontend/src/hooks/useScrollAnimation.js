import { useEffect } from 'react'

/**
 * Custom hook for scroll-based animations
 * @param {Array} dependencies - Dependencies that trigger re-observation
 * @param {Object} options - IntersectionObserver options
 */
export function useScrollAnimation(dependencies = [], options = {}) {
  useEffect(() => {
    const {
      threshold = 0.15,
      rootMargin = '0px 0px -80px 0px',
      animationDelay = 50
    } = options

    const elements = document.querySelectorAll(
      '.animate-on-scroll, .animate-scale, .animate-left, .animate-right, .animate-blur'
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('show')
            }, animationDelay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
}
