import { motion } from 'framer-motion'
import { blurWord, wordContainer } from '../animations/variants'

/**
 * BlurText — splits text into words and animates each with blur + rise + fade.
 *
 * @param {string}  text          - The text string to animate
 * @param {string}  className     - CSS class applied to the wrapper element
 * @param {string}  as            - HTML tag for the wrapper ('h1','h2','h3','p','span',…)
 * @param {number}  delayChildren - Seconds before stagger begins (for sequencing after siblings)
 * @param {boolean} heroMode      - true → animate on mount (no viewport trigger); false → whileInView
 */
function BlurText({ text, className, as = 'span', delayChildren = 0, heroMode = false }) {
  const words = text.split(' ')
  const MotionTag = motion[as]

  const trigger = heroMode
    ? { initial: 'hidden', animate: 'visible' }
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.4 },
      }

  return (
    <MotionTag
      className={className}
      style={{ display: 'block' }}
      {...trigger}
      variants={wordContainer(delayChildren)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={blurWord}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  )
}

export default BlurText
