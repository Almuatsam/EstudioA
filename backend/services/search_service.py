import spacy
from rapidfuzz import fuzz
from models.pattern import Pattern
nlp = spacy.load("en_core_web_sm")

def fuzzy_search_patterns(search_term, threshold=60):
    """
    Find patterns with similar spelling to the search term
    
    Args:
        search_term: What the user typed (e.g., "blu dres")
        threshold: Minimum similarity score (0-100). Default is 60%
    
    Returns:
        List of patterns with their similarity scores
    """
    results = []
    
    # Get all patterns from database
    all_patterns = Pattern.query.filter_by(is_approved=True, is_active=True).all()
    
    # Check each pattern
    for pattern in all_patterns:
        # Compare search term to pattern title
        title_score = fuzz.ratio(search_term.lower(), pattern.title.lower())
        
        # Compare search term to pattern tags
        tags_text = pattern.tags if pattern.tags else ""
        tags_score = fuzz.ratio(search_term.lower(), tags_text.lower())
        
        # Use the better score
        best_score = max(title_score, tags_score)
        
        # If score is good enough, add to results
        if best_score >= threshold:
            results.append({
                'pattern': pattern,
                'score': best_score,
                'match_type': 'fuzzy'
            })
    
    return results

def semantic_search_patterns(search_term, threshold=0.5):
    """
    Find patterns with similar MEANING to the search term
    
    Args:
        search_term: What the user typed (e.g., "evening gown")
        threshold: Minimum similarity score (0.0-1.0). Default is 0.5
    
    Returns:
        List of patterns with their similarity scores
    """
    results = []
    
    # Convert search term to spaCy document (understands meaning)
    search_doc = nlp(search_term)
    
    # Get all patterns from database
    all_patterns = Pattern.query.filter_by(is_approved=True, is_active=True).all()
    
    # Check each pattern
    for pattern in all_patterns:
        # Convert pattern description to spaCy document
        description_text = pattern.description if pattern.description else ""
        
        # Skip if no description
        if not description_text:
            continue
        
        pattern_doc = nlp(description_text)
        
        # Compare meaning (similarity score between 0.0 and 1.0)
        similarity = search_doc.similarity(pattern_doc)
        
        # If similar enough, add to results
        if similarity >= threshold:
            results.append({
                'pattern': pattern,
                'score': int(similarity * 100),  # Convert to 0-100 scale
                'match_type': 'semantic'
            })
    
    return results

def search_patterns(search_term, use_fuzzy=True, use_semantic=True, limit=20):
    """
    Search patterns using both fuzzy and semantic matching
    
    Args:
        search_term: What the user is searching for
        use_fuzzy: Enable fuzzy (spelling) matching
        use_semantic: Enable semantic (meaning) matching
        limit: Maximum number of results to return
    
    Returns:
        List of unique patterns sorted by score (highest first)
    """
    all_results = []
    
    # 1. Fuzzy search (spelling similarity)
    if use_fuzzy:
        fuzzy_results = fuzzy_search_patterns(search_term, threshold=60)
        all_results.extend(fuzzy_results)
    
    # 2. Semantic search (meaning similarity)
    if use_semantic:
        semantic_results = semantic_search_patterns(search_term, threshold=0.5)
        all_results.extend(semantic_results)
    
    # 3. Remove duplicates (pattern might match both ways)
    unique_patterns = {}
    for result in all_results:
        pattern_id = result['pattern'].id
        
        # If we've seen this pattern before, keep the higher score
        if pattern_id in unique_patterns:
            if result['score'] > unique_patterns[pattern_id]['score']:
                unique_patterns[pattern_id] = result
        else:
            unique_patterns[pattern_id] = result
    
    # 4. Convert back to list and sort by score (highest first)
    final_results = list(unique_patterns.values())
    final_results.sort(key=lambda x: x['score'], reverse=True)
    
    # 5. Limit number of results
    return final_results[:limit]