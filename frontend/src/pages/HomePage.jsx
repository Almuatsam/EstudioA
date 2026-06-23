import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import BlurText from '../components/BlurText'
import { Dress, Shirt, Pants, Coat, Bag, Moon, Running, Baby } from '../components/Icons'
import { patternsAPI } from '../services/api'
import {
  blurWord,
  wordContainer,
  cardItem,
  featureCard,
  imageReveal,
  staggerContainer,
} from '../animations/variants'
import './HomePage.css'

const IMAGE_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://127.0.0.1:5000'
const MotionLink = motion.create(Link)
const EASE = [0.19, 1, 0.22, 1]

const CATEGORIES = [
  { name: 'Dresses',        id: 1, Icon: Dress   },
  { name: 'Tops & Blouses', id: 2, Icon: Shirt   },
  { name: 'Bottoms',        id: 3, Icon: Pants   },
  { name: 'Outerwear',      id: 4, Icon: Coat    },
  { name: 'Accessories',    id: 5, Icon: Bag     },
  { name: 'Sleepwear',      id: 6, Icon: Moon    },
  { name: 'Activewear',     id: 7, Icon: Running },
  { name: 'Childrenswear',  id: 8, Icon: Baby    },
]

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [trending, setTrending] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()
  const canUpload = user?.role === 'designer' || user?.role === 'admin'

  useEffect(() => {
    patternsAPI.getPatterns({ sort_by: 'views', per_page: 4 })
      .then(data => setTrending(data.patterns || []))
      .catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${searchQuery}`)
    }
  }

  return (
    <div className="home-page">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="container container-narrow">

          {/* Heading — word-by-word blur reveal, on mount (heroMode) */}
          <h1 className="display-1 text-center mb-6">
            <motion.span
              style={{ display: 'block' }}
              initial="hidden"
              animate="visible"
              variants={wordContainer(0.1)}
            >
              {['Discover', 'Beautiful'].map((word, i) => (
                <motion.span
                  key={i}
                  variants={blurWord}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>

            <motion.span
              className="home-hero-accent"
              style={{ display: 'block' }}
              initial="hidden"
              animate="visible"
              variants={wordContainer(0.3)}
            >
              {['Sewing', 'Patterns'].map((word, i) => (
                <motion.span
                  key={i}
                  variants={blurWord}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="body-large text-center text-secondary mb-10"
            initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.52 }}
          >
            AI-powered search to find the perfect pattern for your next creation
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            className="home-search-form"
            initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.68 }}
          >
            <Input
              type="text"
              placeholder="Search for dress patterns, blouses, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="primary" size="large">
              Search
            </Button>
          </motion.form>

          {/* Action buttons */}
          <motion.div
            className="home-hero-actions"
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.84 }}
          >
            <Link to="/browse">
              <Button variant="primary" size="large" fullWidth>
                Browse All Patterns
              </Button>
            </Link>
            {canUpload && (
              <Link to="/upload">
                <Button variant="secondary" size="large" fullWidth>
                  Upload Your Pattern
                </Button>
              </Link>
            )}
          </motion.div>

        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="container">

          <BlurText as="h2" text="Browse by Category" className="h1 text-center mb-4" />

          <motion.p
            className="body-large text-center text-secondary mb-12"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Find exactly what you're looking for
          </motion.p>

          <motion.div
            className="home-categories-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer(0.05, 0.08)}
          >
            {CATEGORIES.map((cat) => (
              <MotionLink
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className="home-category-card"
                variants={cardItem}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="home-category-icon"><cat.Icon width={32} height={32} /></span>
                <span className="home-category-name">{cat.name}</span>
              </MotionLink>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ─── TRENDING ─────────────────────────────────────────────────── */}
      <section className="home-section home-trending">
        <div className="container">

          <BlurText as="h2" text="Most Popular This Week" className="h1 text-center mb-4" />

          <motion.p
            className="body-large text-center text-secondary mb-12"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            See what the community is loving
          </motion.p>

          <motion.div
            className="home-trending-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer(0.05, 0.1)}
          >
            {trending.map((pattern) => (
              <MotionLink
                key={pattern.id}
                to={`/pattern/${pattern.id}`}
                className="home-trending-card"
                variants={cardItem}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Image animates with blur reveal as a nested variant */}
                <motion.div className="home-trending-image" variants={imageReveal}>
                  {pattern.preview_image ? (
                    <img
                      src={IMAGE_BASE + pattern.preview_image}
                      alt={pattern.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h18v18H3z"/>
                      <path d="M9 9h6v6H9z"/>
                    </svg>
                  )}
                </motion.div>

                <div className="home-trending-content">
                  <h3 className="h4">{pattern.title}</h3>
                  <div className="home-trending-meta">
                    <span>{pattern.difficulty?.name || 'All levels'}</span>
                    <span className="home-trending-downloads">{pattern.view_count} views</span>
                  </div>
                </div>
              </MotionLink>
            ))}

            {trending.length === 0 && (
              <p className="body text-secondary" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                No patterns yet — be the first to upload!
              </p>
            )}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
            viewport={{ once: true, amount: 0.8 }}
          >
            <Link to="/browse">
              <Button variant="primary" size="large">View All Patterns</Button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="container">

          <BlurText as="h2" text="Smart Features for Sewers" className="h1 text-center mb-4" />

          <motion.p
            className="body-large text-center text-secondary mb-12"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Powered by artificial intelligence
          </motion.p>

          {/* perspective enables the rotateX depth effect on children */}
          <motion.div
            className="home-features-grid"
            style={{ perspective: 1000 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.05, 0.15)}
          >

            <motion.div className="home-feature-card" variants={featureCard}>
              <div className="home-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 className="h3 mb-4">Smart Search</h3>
              <p className="body">
                Find patterns even with typos using AI-powered fuzzy matching and NLP
              </p>
            </motion.div>

            <motion.div className="home-feature-card" variants={featureCard}>
              <div className="home-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2v20M2 12h20"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <h3 className="h3 mb-4">AI Recommendations</h3>
              <p className="body">
                Get personalized pattern suggestions based on your interests and history
              </p>
            </motion.div>

            <motion.div className="home-feature-card" variants={featureCard}>
              <div className="home-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3 className="h3 mb-4">Easy Uploads</h3>
              <p className="body">
                Share your patterns with the community and help fellow sewers
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
