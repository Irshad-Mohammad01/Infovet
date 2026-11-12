"""
Data seeder for initial Infovate categories, sample jobs, and default admin account.
Run with: python seed_data.py
"""

from datetime import datetime, timezone
import sys

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.category import Category
from app.models.job import Job
from app.models.user import User
from app.services.settings import get_or_create_platform_settings


def seed_database():
    db: Session = SessionLocal()
    try:
        print("Starting Infovate database seeding...")

        # 1. Seed Admin Users
        admin_emails = ["admin@infovate.in", "admin@infovate.io", "admin@inofovet.in", "admin@infovet.in", "admin@infovet.io"]
        for admin_email in admin_emails:
            admin_user = db.query(User).filter(User.email == admin_email).first()
            if not admin_user:
                admin_user = User(
                    email=admin_email,
                    hashed_password=hash_password("Admin@123456"),
                    full_name="Infovate Administrator",
                    role="admin",
                    is_active=True,
                    is_verified=True,
                    headline="Platform Administrator",
                )
                db.add(admin_user)
                db.commit()
                print(f"Created default admin account: {admin_email}")
            else:
                admin_user.role = "admin"
                admin_user.is_active = True
                db.commit()
                print(f"Admin account already active: {admin_email}")

        # 2. Seed Categories
        categories_data = [
            {
                "name": "Software Engineering",
                "slug": "software-engineering",
                "icon": "Code",
                "description": "Frontend, Backend, Full Stack, Mobile, Cloud, and Systems Engineering.",
                "display_order": 1,
            },
            {
                "name": "Product & Design",
                "slug": "product-design",
                "icon": "Palette",
                "description": "UI/UX, Product Management, Interaction Design, and User Research.",
                "display_order": 2,
            },
            {
                "name": "Data & AI",
                "slug": "data-ai",
                "icon": "Cpu",
                "description": "Machine Learning, Artificial Intelligence, Data Science, and Analytics.",
                "display_order": 3,
            },
            {
                "name": "Sales & Marketing",
                "slug": "sales-marketing",
                "icon": "Megaphone",
                "description": "Growth, Performance Marketing, Content, B2B Sales, and Account Management.",
                "display_order": 4,
            },
            {
                "name": "Finance & Operations",
                "slug": "finance-operations",
                "icon": "BarChart3",
                "description": "Corporate Finance, Accounting, Business Operations, and Strategy.",
                "display_order": 5,
            },
            {
                "name": "Human Resources",
                "slug": "human-resources",
                "icon": "Users",
                "description": "Talent Acquisition, People Operations, Compensation, and Employee Experience.",
                "display_order": 6,
            },
        ]

        cat_map = {}
        for cat_info in categories_data:
            cat = db.query(Category).filter(Category.slug == cat_info["slug"]).first()
            if not cat:
                cat = Category(**cat_info, is_active=True)
                db.add(cat)
                db.commit()
                db.refresh(cat)
                print(f"Created category: {cat.name}")
            cat_map[cat.slug] = cat.id

        # 3. Seed Sample Jobs
        sample_jobs = [
            {
                "title": "Senior Full Stack Engineer",
                "slug": "senior-full-stack-engineer-techflow",
                "company_name": "TechFlow Systems",
                "company_website": "https://techflow.example.com",
                "location": "Bengaluru, India",
                "workplace_type": "Remote",
                "job_type": "Full-time",
                "experience_level": "Senior Level",
                "salary_min": 2400000,
                "salary_max": 3600000,
                "salary_currency": "INR",
                "category_id": cat_map.get("software-engineering"),
                "is_featured": True,
                "is_active": True,
                "tags": "React, Python, FastAPI, PostgreSQL, Docker",
                "description": (
                    "TechFlow Systems is seeking an experienced Senior Full Stack Engineer to lead "
                    "the architecture and development of our next-generation cloud workflow automation platform. "
                    "You will work closely with cross-functional teams to build high-scale, resilient services."
                ),
                "requirements": (
                    "• 5+ years of production experience in full stack web development.\n"
                    "• Strong proficiency with React.js, TypeScript, and modern frontend tooling.\n"
                    "• Deep hands-on experience with Python (FastAPI/Django) and relational databases (PostgreSQL).\n"
                    "• Experience designing scalable REST APIs and event-driven microservices.\n"
                    "• Solid understanding of CI/CD pipelines, containerization (Docker), and cloud deployments."
                ),
                "benefits": (
                    "• Competitive compensation with annual performance bonus.\n"
                    "• Flexible remote-first work culture with flexible working hours.\n"
                    "• Comprehensive health, dental, and vision insurance for you and dependents.\n"
                    "• ₹1,00,000 annual learning and certification allowance.\n"
                    "• Home office setup stipend."
                ),
            },
            {
                "title": "Lead UI/UX Product Designer",
                "slug": "lead-product-designer-apex",
                "company_name": "Apex Digital Labs",
                "company_website": "https://apexdigital.example.com",
                "location": "Mumbai, India",
                "workplace_type": "Hybrid",
                "job_type": "Full-time",
                "experience_level": "Director / Lead",
                "salary_min": 2000000,
                "salary_max": 3000000,
                "salary_currency": "INR",
                "category_id": cat_map.get("product-design"),
                "is_featured": True,
                "is_active": True,
                "tags": "Figma, Design Systems, UX Research, Prototyping",
                "description": (
                    "Apex Digital Labs is looking for a visionary Lead Product Designer to champion "
                    "user experience across our enterprise SaaS suites. You will define design principles, "
                    "maintain our global design system, and craft intuitive interfaces."
                ),
                "requirements": (
                    "• 6+ years of dedicated UI/UX design experience for SaaS applications.\n"
                    "• Mastery of Figma, component libraries, and interactive prototyping.\n"
                    "• Demonstrated experience conducting user research, usability testing, and journey mapping.\n"
                    "• Strong visual design sensibility with deep knowledge of typography and accessibility.\n"
                    "• Strong portfolio showcasing real-world shipped digital products."
                ),
                "benefits": (
                    "• Top-tier salary and equity participation.\n"
                    "• Hybrid work flexibility (2 days office, 3 days remote).\n"
                    "• High-end workstation equipment (MacBook Pro + 4K display).\n"
                    "• Wellness stipend and premium health coverage."
                ),
            },
            {
                "title": "AI & Machine Learning Engineer",
                "slug": "ai-ml-engineer-neuraledge",
                "company_name": "NeuralEdge Corp",
                "company_website": "https://neuraledge.example.com",
                "location": "Hyderabad, India",
                "workplace_type": "Remote",
                "job_type": "Full-time",
                "experience_level": "Mid Level",
                "salary_min": 1800000,
                "salary_max": 2800000,
                "salary_currency": "INR",
                "category_id": cat_map.get("data-ai"),
                "is_featured": True,
                "is_active": True,
                "tags": "Python, PyTorch, LLMs, NLP, Vector DBs",
                "description": (
                    "Join NeuralEdge to build state-of-the-art NLP and Large Language Model applications. "
                    "You will design retrieval pipelines, fine-tune models, and deploy production inference endpoints."
                ),
                "requirements": (
                    "• 3+ years experience with Python and machine learning frameworks (PyTorch, HuggingFace).\n"
                    "• Hands-on experience building RAG architectures and working with vector databases (Qdrant, Pinecone).\n"
                    "• Solid understanding of transformer architectures and model evaluation metrics.\n"
                    "• Experience deploying models with FastAPI, Triton, or ONNX Runtime."
                ),
                "benefits": (
                    "• 100% remote anywhere in India.\n"
                    "• Generous GPU compute allowances for research experiments.\n"
                    "• Conference travel support (NeurIPS, ICML, CVPR).\n"
                    "• Comprehensive medical coverage."
                ),
            },
            {
                "title": "Growth Marketing Specialist",
                "slug": "growth-marketing-specialist-scaleup",
                "company_name": "ScaleUp Media",
                "company_website": "https://scaleup.example.com",
                "location": "Gurugram, India",
                "workplace_type": "On-site",
                "job_type": "Full-time",
                "experience_level": "Mid Level",
                "salary_min": 1000000,
                "salary_max": 1600000,
                "salary_currency": "INR",
                "category_id": cat_map.get("sales-marketing"),
                "is_featured": False,
                "is_active": True,
                "tags": "SEO, SEM, Google Ads, Analytics, Content",
                "description": (
                    "ScaleUp Media is hiring a data-driven Growth Marketer to lead customer acquisition "
                    "and performance marketing across multiple high-traffic channels."
                ),
                "requirements": (
                    "• 3+ years managing paid acquisition channels (Google Search, Meta, LinkedIn).\n"
                    "• Proficiency with Google Analytics 4, Mixpanel, and data visualization tools.\n"
                    "• Experience running A/B conversion rate optimization tests on landing pages.\n"
                    "• Exceptional copy writing and communication skills."
                ),
                "benefits": (
                    "• Attractive performance-linked quarterly incentives.\n"
                    "• Modern collaborative office in Cyber City with catered lunches.\n"
                    "• Annual paid team retreats."
                ),
            },
            {
                "title": "Financial Analyst & Strategy Associate",
                "slug": "financial-analyst-apex-capital",
                "company_name": "Apex Horizon Ventures",
                "company_website": "https://apexhorizon.example.com",
                "location": "Mumbai, India",
                "workplace_type": "Hybrid",
                "job_type": "Full-time",
                "experience_level": "Mid Level",
                "salary_min": 1400000,
                "salary_max": 2000000,
                "salary_currency": "INR",
                "category_id": cat_map.get("finance-operations"),
                "is_featured": False,
                "is_active": True,
                "tags": "Financial Modeling, Valuation, Excel, Strategy",
                "description": (
                    "Apex Horizon is seeking a detail-oriented Financial Analyst to build forecasting models, "
                    "prepare investor decks, and evaluate prospective growth opportunities."
                ),
                "requirements": (
                    "• 2-4 years in corporate finance, investment banking, or management consulting.\n"
                    "• Advanced financial modeling skills in Excel.\n"
                    "• Degree in Finance, Economics, or related discipline (CFA/CA a plus)."
                ),
                "benefits": (
                    "• Comprehensive medical and life insurance.\n"
                    "• Performance bonus and retirement matching.\n"
                    "• Hybrid schedule with flexible commute hours."
                ),
            },
        ]

        for job_info in sample_jobs:
            existing_job = db.query(Job).filter(Job.slug == job_info["slug"]).first()
            if not existing_job:
                job = Job(**job_info)
                db.add(job)
                db.commit()
                print(f"Created job: {job.title} at {job.company_name}")
            else:
                print(f"Job '{job_info['title']}' already exists.")

        # 4. Seed Platform Settings
        settings_rec = get_or_create_platform_settings(db)
        print(f"Platform settings verified: {settings_rec.platform_name}")

        print("Database seeding completed successfully!")
    except Exception as exc:
        print("Error during database seeding:", exc)
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

