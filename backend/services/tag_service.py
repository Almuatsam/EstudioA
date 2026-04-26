"""
Auto-tagging service for sewing patterns.
Uses keyword matching against a preset tag vocabulary.
spaCy (already loaded) is used for noun extraction to catch
keywords that aren't an exact match.
"""

import re
import spacy

_nlp = spacy.load("en_core_web_sm")

# ---------------------------------------------------------------------------
# Preset vocabulary
# ---------------------------------------------------------------------------

# All valid tags the system can assign
PRESET_TAGS = [
    # Garment types
    "dress", "gown", "blouse", "shirt", "top", "tunic", "skirt", "pants",
    "trousers", "shorts", "jacket", "coat", "cardigan", "vest", "cape",
    "kimono", "jumpsuit", "romper", "leggings", "sweater", "pullover",
    "pyjamas", "nightgown", "robe", "swimsuit", "bikini",
    # Styles
    "casual", "formal", "elegant", "bohemian", "vintage", "modern",
    "minimalist", "classic", "sporty", "romantic", "chic", "boho",
    # Seasons / weather
    "summer", "winter", "spring", "autumn", "fall", "all-season",
    # Fabrics
    "cotton", "linen", "silk", "wool", "denim", "velvet", "chiffon",
    "jersey", "satin", "knit", "fleece", "leather", "suede", "polyester",
    "rayon", "georgette", "muslin",
    # Occasions
    "wedding", "bridal", "party", "everyday", "office", "work",
    "beach", "outdoor", "evening", "cocktail", "prom", "festival",
    # Silhouette / fit
    "fitted", "loose", "flowy", "structured", "tailored", "oversized",
    "wrap", "gathered", "pleated", "ruffled", "tiered", "a-line",
    "straight", "flared", "empire", "balloon", "peplum",
    # Techniques / skill
    "beginner-friendly", "quick-sew", "hand-sew", "machine-sew",
    "embroidery", "smocking", "quilting", "lined", "unlined",
    "advanced", "intermediate",
    # Demographics
    "children", "kids", "baby", "plus-size", "maternity", "men",
    # Accessories category
    "bag", "hat", "scarf", "belt", "purse", "tote",
]

# Exact-match aliases: if this word appears in text → add this tag
KEYWORD_MAP = {
    # aliases → canonical tag
    "maxi": "dress",
    "mini dress": "dress",
    "sundress": "dress",
    "halter": "dress",
    "shift dress": "dress",
    "shirt dress": "dress",
    "midi": "dress",
    "gown": "gown",
    "ballgown": "gown",
    "blouse": "blouse",
    "button-up": "shirt",
    "button up": "shirt",
    "t-shirt": "shirt",
    "tshirt": "shirt",
    "polo": "shirt",
    "pant": "pants",
    "trouser": "trousers",
    "slacks": "trousers",
    "jeans": "denim",
    "denim": "denim",
    "jacket": "jacket",
    "blazer": "jacket",
    "anorak": "jacket",
    "parka": "coat",
    "overcoat": "coat",
    "trench": "coat",
    "hoodie": "sweater",
    "sweatshirt": "sweater",
    "knitted": "knit",
    "crochet": "knit",
    "fleece": "fleece",
    "lingerie": "robe",
    "pajamas": "pyjamas",
    "pjs": "pyjamas",
    "nightwear": "pyjamas",
    "sleepwear": "pyjamas",
    "activewear": "sporty",
    "athletic": "sporty",
    "yoga": "sporty",
    "gym": "sporty",
    "workout": "sporty",
    "sportswear": "sporty",
    "boho": "bohemian",
    "bohemian": "bohemian",
    "retro": "vintage",
    "old-fashioned": "vintage",
    "bridal": "wedding",
    "bride": "wedding",
    "formal wear": "formal",
    "party wear": "party",
    "easy": "beginner-friendly",
    "simple": "beginner-friendly",
    "quick": "quick-sew",
    "fast": "quick-sew",
    "ruffle": "ruffled",
    "pleats": "pleated",
    "gathered": "gathered",
    "smocked": "smocking",
    "embroider": "embroidery",
    "quilt": "quilting",
    "lined": "lined",
    "unlined": "unlined",
    "baby": "baby",
    "infant": "baby",
    "toddler": "children",
    "child": "children",
    "kid": "children",
    "boy": "children",
    "girl": "children",
    "plus size": "plus-size",
    "curvy": "plus-size",
    "maternity": "maternity",
    "pregnant": "maternity",
}

# Category name → tags always added for that category
CATEGORY_TAGS = {
    "dresses":          ["dress"],
    "tops & blouses":   ["top"],
    "bottoms":          ["skirt"],
    "outerwear":        ["coat"],
    "accessories":      [],
    "sleepwear":        ["pyjamas"],
    "activewear":       ["sporty"],
    "childrenswear":    ["children"],
}

# Difficulty name → tags
DIFFICULTY_TAGS = {
    "beginner": ["beginner-friendly"],
    "easy":     ["beginner-friendly"],
    "advanced": ["advanced"],
    "expert":   ["advanced"],
}


# ---------------------------------------------------------------------------
# Core function
# ---------------------------------------------------------------------------

def generate_tags(
    title: str,
    description: str,
    category_name: str = "",
    difficulty_name: str = "",
    max_tags: int = 10,
) -> list[str]:
    """
    Return a deduplicated list of auto-suggested tags.
    Priority order:
      1. Category-based tags (always included)
      2. Difficulty-based tags
      3. Keyword / alias matches from title + description
    """
    tags: set[str] = set()

    # 1. Category tags
    cat_key = category_name.lower().strip()
    for key, cat_tags in CATEGORY_TAGS.items():
        if key in cat_key or cat_key in key:
            tags.update(cat_tags)
            break

    # 2. Difficulty tags
    diff_key = difficulty_name.lower().strip()
    for key, diff_tags in DIFFICULTY_TAGS.items():
        if key in diff_key:
            tags.update(diff_tags)
            break

    # 3. Keyword matching on combined text
    text = f"{title} {description}".lower()
    # Normalize punctuation
    text = re.sub(r"['\"\-]", " ", text)

    # Alias map (longest first to avoid partial matches)
    for alias, tag in sorted(KEYWORD_MAP.items(), key=lambda x: -len(x[0])):
        if alias in text and tag in PRESET_TAGS:
            tags.add(tag)

    # Direct preset tag matches
    for tag in PRESET_TAGS:
        normalized = tag.replace("-", " ")
        if normalized in text or tag in text:
            tags.add(tag)

    # 4. Deduplicate and cap
    result = list(tags)[:max_tags]
    return sorted(result)


# ---------------------------------------------------------------------------
# Optional spaCy enhancement (noun extraction)
# ---------------------------------------------------------------------------

def _extract_nouns_spacy(text: str) -> list[str]:
    """Extract nouns from text using spaCy, return lowercase."""
    try:
        doc = _nlp(text[:1000])
        return [token.lemma_.lower() for token in doc if token.pos_ in ("NOUN", "PROPN")]
    except Exception:
        return []


def generate_tags_enhanced(
    title: str,
    description: str,
    category_name: str = "",
    difficulty_name: str = "",
    max_tags: int = 10,
) -> list[str]:
    """
    Like generate_tags but also uses spaCy noun extraction to catch
    keywords that aren't exact matches in the preset list.
    Falls back silently if spaCy is unavailable.
    """
    base_tags = set(generate_tags(title, description, category_name, difficulty_name, max_tags))

    nouns = _extract_nouns_spacy(f"{title} {description}")
    for noun in nouns:
        if noun in PRESET_TAGS and len(base_tags) < max_tags:
            base_tags.add(noun)

    return sorted(list(base_tags))
