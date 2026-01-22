from app import create_app
from models import db
from models.pattern import Category, DifficultyLevel
from datetime import datetime

def seed_categories():
    """Seed initial categories"""
    
    categories_data = [
        {
            'name': 'Dresses',
            'description': 'Dress patterns including casual, formal, and special occasion dresses'
        },
        {
            'name': 'Tops & Blouses',
            'description': 'Shirt, blouse, and top patterns for various styles'
        },
        {
            'name': 'Bottoms',
            'description': 'Pants, skirts, shorts, and other bottom wear patterns'
        },
        {
            'name': 'Outerwear',
            'description': 'Jackets, coats, and other outer garment patterns'
        },
        {
            'name': 'Accessories',
            'description': 'Bags, hats, scarves, and other accessory patterns'
        },
        {
            'name': 'Sleepwear',
            'description': 'Pajamas, nightgowns, and loungewear patterns'
        },
        {
            'name': 'Activewear',
            'description': 'Sportswear and athletic clothing patterns'
        },
        {
            'name': 'Childrenswear',
            'description': 'Clothing patterns for babies and children'
        }
    ]
    
    print("Seeding categories...")
    for cat_data in categories_data:
        # Check if category already exists
        existing = Category.query.filter_by(name=cat_data['name']).first()
        if not existing:
            category = Category(**cat_data)
            db.session.add(category)
            print(f"  ✓ Added category: {cat_data['name']}")
        else:
            print(f"  - Category already exists: {cat_data['name']}")
    
    db.session.commit()
    print("Categories seeded successfully!\n")


def seed_difficulty_levels():
    """Seed initial difficulty levels"""
    
    levels_data = [
        {
            'name': 'Beginner',
            'description': 'Perfect for those new to sewing. Simple construction with basic techniques.',
            'order': 1
        },
        {
            'name': 'Easy',
            'description': 'For sewers with basic skills. Straightforward patterns with minimal fitting.',
            'order': 2
        },
        {
            'name': 'Intermediate',
            'description': 'Requires moderate sewing experience. Involves some fitting and detail work.',
            'order': 3
        },
        {
            'name': 'Advanced',
            'description': 'For experienced sewers. Complex construction and precise fitting required.',
            'order': 4
        },
        {
            'name': 'Expert',
            'description': 'Master level patterns. Intricate details and advanced techniques.',
            'order': 5
        }
    ]
    
    print("Seeding difficulty levels...")
    for level_data in levels_data:
        # Check if level already exists
        existing = DifficultyLevel.query.filter_by(name=level_data['name']).first()
        if not existing:
            level = DifficultyLevel(**level_data)
            db.session.add(level)
            print(f"  ✓ Added difficulty level: {level_data['name']}")
        else:
            print(f"  - Difficulty level already exists: {level_data['name']}")
    
    db.session.commit()
    print("Difficulty levels seeded successfully!\n")


def display_seeded_data():
    """Display the seeded data"""
    
    print("=" * 50)
    print("DATABASE CONTENTS")
    print("=" * 50)
    
    # Display categories
    categories = Category.query.all()
    print(f"\nCategories ({len(categories)} total):")
    print("-" * 50)
    for cat in categories:
        print(f"ID: {cat.id} | Name: {cat.name}")
    
    # Display difficulty levels
    levels = DifficultyLevel.query.order_by(DifficultyLevel.order).all()
    print(f"\nDifficulty Levels ({len(levels)} total):")
    print("-" * 50)
    for level in levels:
        print(f"ID: {level.id} | Order: {level.order} | Name: {level.name}")
    
    print("\n" + "=" * 50)


def main():
    """Main seeding function"""
    
    print("\n" + "=" * 50)
    print("SEEDING DATABASE")
    print("=" * 50 + "\n")
    
    # Create app context
    app = create_app('development')
    
    with app.app_context():
        # Seed categories
        seed_categories()
        
        # Seed difficulty levels
        seed_difficulty_levels()
        
        # Display results
        display_seeded_data()
        
        print("\n✅ Database seeding completed successfully!")
        print("=" * 50 + "\n")


if __name__ == '__main__':
    main()