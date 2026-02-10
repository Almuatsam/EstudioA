import spacy
from models.pattern import Pattern
from models.history import History
from models import db
from sqlalchemy import func


nlp = spacy.load("en_core_web_sm")
def calculate_pattern_similarity(pattern1, pattern2):
    
    # Score 1: Category Match 
    category_score = 1.0 if pattern1.category_id == pattern2.category_id else 0.0
    
    # Score 2: Difficulty Match 
    difficulty_score = 1.0 if pattern1.difficulty_id == pattern2.difficulty_id else 0.0
    
    # Score 3: Tag Similarity 
    tags1 = set(pattern1.get_tags_list())
    tags2 = set(pattern2.get_tags_list())
    
    if tags1 and tags2:
        # Jaccard similarity: intersection / union
        common_tags = tags1.intersection(tags2)
        all_tags = tags1.union(tags2)
        tag_score = len(common_tags) / len(all_tags) if all_tags else 0.0
    else:
        tag_score = 0.0
    
    # Score 4: Description Similarity 
    desc1 = pattern1.description if pattern1.description else ""
    desc2 = pattern2.description if pattern2.description else ""
    
    if desc1 and desc2:
        doc1 = nlp(desc1)
        doc2 = nlp(desc2)
        semantic_score = doc1.similarity(doc2)
    else:
        semantic_score = 0.0
    
    # Combine all scores with weights
    total_score = (
        0.3 * category_score +
        0.1 * difficulty_score +
        0.3 * tag_score +
        0.3 * semantic_score
    )
    
    return total_score

def get_pattern_recommendations(pattern_id, limit=10, min_score=0.3):
    
    # Get the base pattern
    base_pattern = Pattern.query.get(pattern_id)
    
    if not base_pattern:
        return []
    
    # Get all other approved patterns 
    all_patterns = Pattern.query.filter(
        Pattern.is_approved == True,
        Pattern.is_active == True,
        Pattern.id != pattern_id
    ).all()
    
    # Calculate similarity for each pattern
    recommendations = []
    
    for pattern in all_patterns:
        similarity_score = calculate_pattern_similarity(base_pattern, pattern)
        
        # Only include if score is above minimum
        if similarity_score >= min_score:
            recommendations.append({
                'pattern': pattern,
                'score': round(similarity_score * 100, 2),  # Convert to percentage
                'recommendation_type': 'content_based'
            })
    
    # Sort by score (highest first)
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top N recommendations
    return recommendations[:limit]

def get_user_recommendations(user_id, limit=10):
    
    
    # Get user's most recent history 
    user_history = History.query.filter_by(user_id=user_id).order_by(
    History.created_at.desc()
    ).limit(20).all()
    
    if not user_history:
        # No history - return popular patterns instead
        return get_popular_patterns(limit)
    
    # Get pattern IDs from history
    viewed_pattern_ids = [h.pattern_id for h in user_history]
    
    # Collect all recommendations from viewed patterns
    all_recommendations = {}
    
    for pattern_id in viewed_pattern_ids:
        # Get recommendations for each pattern user viewed
        recs = get_pattern_recommendations(pattern_id, limit=5, min_score=0.4)
        
        for rec in recs:
            rec_pattern_id = rec['pattern'].id
            
            # Skip if user already viewed this pattern
            if rec_pattern_id in viewed_pattern_ids:
                continue
            
            # Accumulate scores if pattern appears multiple times
            if rec_pattern_id in all_recommendations:
                all_recommendations[rec_pattern_id]['score'] += rec['score']
                all_recommendations[rec_pattern_id]['count'] += 1
            else:
                all_recommendations[rec_pattern_id] = {
                    'pattern': rec['pattern'],
                    'score': rec['score'],
                    'count': 1,
                    'recommendation_type': 'personalized'
                }
    
    # Calculate average scores
    final_recommendations = []
    for rec_id, rec_data in all_recommendations.items():
        avg_score = rec_data['score'] / rec_data['count']
        final_recommendations.append({
            'pattern': rec_data['pattern'],
            'score': round(avg_score, 2),
            'recommendation_type': 'personalized',
            'based_on': rec_data['count']  # How many user patterns led to this
        })
    
    # Sort by score
    final_recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top N
    return final_recommendations[:limit]

def get_popular_patterns(limit=10):
    
    # Get all approved patterns
    patterns = Pattern.query.filter_by(
        is_approved=True,
        is_active=True
    ).all()
    
    popular_patterns = []
    
    for pattern in patterns:
        # Calculate popularity score
        # Downloads are worth more than views (2:1 ratio)
        popularity_score = (pattern.download_count * 2) + pattern.view_count
        
        popular_patterns.append({
            'pattern': pattern,
            'score': popularity_score,
            'recommendation_type': 'popular'
        })
    
    # Sort by popularity (highest first)
    popular_patterns.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top N
    return popular_patterns[:limit]