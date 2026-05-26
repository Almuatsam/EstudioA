import spacy
from models.pattern import Pattern
from models.history import History
from models import db

nlp = spacy.load("en_core_web_sm")


def calculate_pattern_similarity(pattern1, pattern2):
    """
    Score similarity between two patterns across four dimensions:
    category, difficulty, shared tags (Jaccard), and description semantics.
    Returns a weighted float in [0.0, 1.0].
    """
    category_score = 1.0 if pattern1.category_id == pattern2.category_id else 0.0
    difficulty_score = 1.0 if pattern1.difficulty_id == pattern2.difficulty_id else 0.0

    tags1 = set(pattern1.get_tags_list())
    tags2 = set(pattern2.get_tags_list())
    if tags1 and tags2:
        # Jaccard similarity: intersection / union
        tag_score = len(tags1 & tags2) / len(tags1 | tags2)
    else:
        tag_score = 0.0

    desc1 = pattern1.description or ""
    desc2 = pattern2.description or ""
    semantic_score = nlp(desc1).similarity(nlp(desc2)) if desc1 and desc2 else 0.0

    return (
        0.3 * category_score +
        0.1 * difficulty_score +
        0.3 * tag_score +
        0.3 * semantic_score
    )


def get_pattern_recommendations(pattern_id, limit=10, min_score=0.3):
    """Return patterns most similar to the given pattern, sorted by similarity score."""
    base_pattern = Pattern.query.get(pattern_id)
    if not base_pattern:
        return []

    candidates = Pattern.query.filter(
        Pattern.is_approved == True,
        Pattern.is_active == True,
        Pattern.id != pattern_id
    ).all()

    recommendations = []
    for pattern in candidates:
        score = calculate_pattern_similarity(base_pattern, pattern)
        if score >= min_score:
            recommendations.append({
                'pattern': pattern,
                'score': round(score * 100, 2),
                'recommendation_type': 'content_based'
            })

    recommendations.sort(key=lambda x: x['score'], reverse=True)
    return recommendations[:limit]


def get_user_recommendations(user_id, limit=10):
    """
    Build personalized recommendations from the user's view history.
    Aggregates content-based scores across recently viewed patterns.
    Falls back to popular patterns when the user has no history.
    """
    user_history = History.query.filter_by(user_id=user_id)\
        .order_by(History.created_at.desc())\
        .limit(20).all()

    if not user_history:
        return get_popular_patterns(limit)

    viewed_ids = {h.pattern_id for h in user_history}
    aggregated = {}

    for pattern_id in viewed_ids:
        for rec in get_pattern_recommendations(pattern_id, limit=5, min_score=0.4):
            pid = rec['pattern'].id
            if pid in viewed_ids:
                continue
            if pid in aggregated:
                aggregated[pid]['score'] += rec['score']
                aggregated[pid]['count'] += 1
            else:
                aggregated[pid] = {
                    'pattern': rec['pattern'],
                    'score': rec['score'],
                    'count': 1
                }

    results = [
        {
            'pattern': data['pattern'],
            'score': round(data['score'] / data['count'], 2),
            'recommendation_type': 'personalized',
            'based_on': data['count']
        }
        for data in aggregated.values()
    ]

    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:limit]


def get_popular_patterns(limit=10):
    """Rank patterns by weighted popularity: downloads count double views."""
    patterns = Pattern.query.filter_by(is_approved=True, is_active=True).all()

    ranked = [
        {
            'pattern': p,
            'score': (p.download_count * 2) + p.view_count,
            'recommendation_type': 'popular'
        }
        for p in patterns
    ]

    ranked.sort(key=lambda x: x['score'], reverse=True)
    return ranked[:limit]
