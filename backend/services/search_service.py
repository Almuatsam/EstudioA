import spacy
from rapidfuzz import fuzz
from models.pattern import Pattern

nlp = spacy.load("en_core_web_sm")


def fuzzy_search_patterns(search_term, threshold=60):
    """Find patterns matching by spelling similarity (title and tags)."""
    results = []
    all_patterns = Pattern.query.filter_by(is_approved=True, is_active=True).all()

    for pattern in all_patterns:
        # partial_ratio handles substrings and minor typos
        title_score = fuzz.partial_ratio(search_term.lower(), pattern.title.lower())

        tags_text = pattern.tags if pattern.tags else ""
        tags_score = max(
            (fuzz.partial_ratio(search_term.lower(), tag.strip().lower())
             for tag in tags_text.split(',') if tag.strip()),
            default=0
        )

        best_score = max(title_score, tags_score)
        if best_score >= threshold:
            results.append({
                'pattern': pattern,
                'score': best_score,
                'match_type': 'fuzzy'
            })

    return results


def semantic_search_patterns(search_term, threshold=0.5):
    """Find patterns matching by semantic meaning of the description."""
    results = []
    search_doc = nlp(search_term)
    all_patterns = Pattern.query.filter_by(is_approved=True, is_active=True).all()

    for pattern in all_patterns:
        description_text = pattern.description if pattern.description else ""
        if not description_text:
            continue

        similarity = search_doc.similarity(nlp(description_text))
        if similarity >= threshold:
            results.append({
                'pattern': pattern,
                'score': int(similarity * 100),  # normalize to 0–100
                'match_type': 'semantic'
            })

    return results


def search_patterns(search_term, use_fuzzy=True, use_semantic=True, limit=20):
    """
    Combine fuzzy and semantic search results.
    When a pattern matches both strategies, the higher score wins.
    Returns patterns sorted by score, highest first.
    """
    all_results = []

    if use_fuzzy:
        all_results.extend(fuzzy_search_patterns(search_term, threshold=60))
    if use_semantic:
        all_results.extend(semantic_search_patterns(search_term, threshold=0.5))

    # Deduplicate — a pattern can match both strategies
    unique_patterns = {}
    for result in all_results:
        pid = result['pattern'].id
        if pid not in unique_patterns or result['score'] > unique_patterns[pid]['score']:
            unique_patterns[pid] = result

    final_results = sorted(unique_patterns.values(), key=lambda x: x['score'], reverse=True)
    return final_results[:limit]
