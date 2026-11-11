"""
Seed script to initialize INFOVET Software Development Company database.
Populates company profile, services, technologies, sample showcase projects, team, and testimonials.
"""

from datetime import date
from app.database import SessionLocal
from app.models.company import CompanyProfile
from app.models.project import Project, ProjectImage
from app.models.service import Service
from app.models.team_member import TeamMember
from app.models.technology import Technology
from app.models.testimonial import Testimonial


def seed_company_data():
    db = SessionLocal()
    try:
        # 1. Company Profile
        if not db.query(CompanyProfile).first():
            profile = CompanyProfile(
                company_name="INFOVET",
                tagline="We Build Digital Solutions That Move Businesses Forward.",
                short_description="INFOVET is a modern software development startup and digital engineering company building scalable web apps, mobile solutions, and enterprise platforms.",
                about_markdown=(
                    "INFOVET is an innovative software development company and digital engineering partner. "
                    "We specialize in crafting custom web applications, mobile platforms, cloud-native backend systems, and AI-driven automation for forward-thinking enterprises and fast-growing startups.\n\n"
                    "Our engineering philosophy centers around clean architecture, modern frameworks (React, FastAPI, PostgreSQL), agile collaboration, and continuous delivery. "
                    "Whether you're launching an MVP or scaling an enterprise platform, we bring technical excellence to every stage of product development."
                ),
                mission="To empower visionary businesses with dependable, scalable, and beautifully engineered software products.",
                vision="To be the premier digital engineering studio renowned for craftsmanship, reliability, and business impact.",
                experience_years=5,
                projects_completed=48,
                satisfied_clients=42,
                primary_email="contact@infovet.in",
                phone="+91 98765 43210",
                address="Bengaluru, Karnataka, India",
                linkedin_url="https://linkedin.com/company/infovet",
                github_url="https://github.com/infovet",
                twitter_url="https://twitter.com/infovet",
            )
            db.add(profile)
            print("✓ Seeded Company Profile")

        # 2. Services
        if db.query(Service).count() == 0:
            services = [
                Service(
                    title="Web Development",
                    slug="web-development",
                    icon="Globe",
                    short_description="High-performance, modern single-page applications and responsive websites built with React and modern web standards.",
                    full_description="We engineer fast, scalable, and secure web applications tailored to your business workflows. From complex enterprise dashboards to high-conversion customer portals, our solutions deliver unmatched speed, accessibility, and reliability.",
                    features=[
                        "Single Page Applications (React, Next.js)",
                        "Progressive Web Apps (PWA)",
                        "Interactive Real-Time Dashboards",
                        "Performance & Core Web Vitals Optimization",
                        "SEO & Semantic Accessibility",
                    ],
                    technologies=["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite"],
                    display_order=1,
                    is_active=True,
                ),
                Service(
                    title="Mobile App Development",
                    slug="mobile-app-development",
                    icon="Smartphone",
                    short_description="Cross-platform iOS and Android applications with native performance, fluid animations, and offline capabilities.",
                    full_description="Transform your mobile strategy with fluid, intuitive, and responsive mobile applications. We use React Native and Flutter to build high-grade iOS and Android apps from a unified codebase, reducing time-to-market without compromising native experience.",
                    features=[
                        "Cross-Platform iOS & Android Apps",
                        "Offline-First Architecture & Sync",
                        "Push Notifications & Deep Linking",
                        "Biometric Authentication & Security",
                        "App Store & Play Store Deployment",
                    ],
                    technologies=["React Native", "Flutter", "TypeScript", "Firebase", "SQLite"],
                    display_order=2,
                    is_active=True,
                ),
                Service(
                    title="Custom Software Development",
                    slug="custom-software-development",
                    icon="Code",
                    short_description="Tailored digital platforms, CRM systems, ERPs, and workflow tools designed specifically for your operational requirements.",
                    full_description="Off-the-shelf software rarely fits unique business models. We build bespoke software systems that automate manual tasks, streamline data flows, and scale seamlessly as your operations expand.",
                    features=[
                        "Custom CRM & ERP Solutions",
                        "Role-Based Access Control & Multi-Tenancy",
                        "Internal Operations & Workflow Tools",
                        "Database Migration & Modernization",
                        "Scalable Cloud Deployment",
                    ],
                    technologies=["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
                    display_order=3,
                    is_active=True,
                ),
                Service(
                    title="E-Commerce Platforms",
                    slug="ecommerce-development",
                    icon="ShoppingBag",
                    short_description="Headless e-commerce stores, custom cart engines, payment gateway integrations, and inventory management.",
                    full_description="Build a friction-free shopping experience with custom e-commerce engines. We implement secure payment workflows, multi-currency pricing, automated invoicing, and real-time order tracking.",
                    features=[
                        "Headless Commerce & Custom Frontends",
                        "Secure Payment Gateways (Stripe, Razorpay)",
                        "Inventory & Catalog Management",
                        "Discount, Coupon & Loyalty Engines",
                        "Automated Transactional Emails",
                    ],
                    technologies=["React", "Node.js", "FastAPI", "PostgreSQL", "Stripe"],
                    display_order=4,
                    is_active=True,
                ),
                Service(
                    title="API & Backend Engineering",
                    slug="api-backend-engineering",
                    icon="Server",
                    short_description="Robust RESTful and GraphQL APIs, asynchronous microservices, database design, and cloud architecture.",
                    full_description="The backbone of any reliable application is a rock-solid backend. We design resilient REST and event-driven APIs using FastAPI, Python, and PostgreSQL with connection pooling, caching, and comprehensive test coverage.",
                    features=[
                        "High-Throughput RESTful APIs",
                        "Database Architecture & Connection Pooling",
                        "JWT & OAuth2 Secure Authentication",
                        "Background Task Processing & Webhooks",
                        "Comprehensive OpenAPI Documentation",
                    ],
                    technologies=["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Redis"],
                    display_order=5,
                    is_active=True,
                ),
                Service(
                    title="UI/UX Product Design",
                    slug="ui-ux-design",
                    icon="Palette",
                    short_description="User-centered product design, interactive prototypes, design systems, and conversion-optimized interfaces.",
                    full_description="We turn complex workflows into intuitive, engaging user experiences. Through wireframing, interactive prototyping, and modern design systems, we ensure every interaction is delightful and frictionless.",
                    features=[
                        "User Journey Mapping & Wireframing",
                        "Design Systems & Component Libraries",
                        "Interactive Figma Prototyping",
                        "Responsive Desktop & Mobile Layouts",
                        "Usability Testing & Design Audits",
                    ],
                    technologies=["Figma", "Design Systems", "Tailwind CSS", "Storybook"],
                    display_order=6,
                    is_active=True,
                ),
                Service(
                    title="AI & Automation Solutions",
                    slug="ai-automation",
                    icon="Cpu",
                    short_description="Intelligent process automation, LLM integration, automated document processing, and smart business bots.",
                    full_description="Integrate cutting-edge AI into your daily operations. We build tailored automation pipelines, AI-driven assistants, document parsers, and predictive workflows that eliminate repetitive human effort.",
                    features=[
                        "LLM & Generative AI Integration",
                        "Automated Data Extraction & OCR",
                        "Intelligent Chatbots & Customer Assistants",
                        "Workflow & Webhook Automations",
                        "Custom Machine Learning Pipelines",
                    ],
                    technologies=["Python", "OpenAI / Gemini API", "FastAPI", "Celery", "LangChain"],
                    display_order=7,
                    is_active=True,
                ),
            ]
            db.add_all(services)
            print("✓ Seeded Services")

        # 3. Technologies
        if db.query(Technology).count() == 0:
            techs = [
                Technology(name="React", slug="react", category="Frontend", icon="Code", description="Interactive UI library for building dynamic web applications.", is_featured=True, display_order=1),
                Technology(name="TypeScript", slug="typescript", category="Frontend", icon="Code", description="Typed JavaScript for robust, scalable applications.", is_featured=True, display_order=2),
                Technology(name="Next.js", slug="nextjs", category="Frontend", icon="Globe", description="Full-stack React framework with SSR and static generation.", is_featured=True, display_order=3),
                Technology(name="Tailwind CSS", slug="tailwind", category="Frontend", icon="Palette", description="Utility-first CSS framework for rapid modern UI development.", is_featured=True, display_order=4),
                Technology(name="Python", slug="python", category="Backend", icon="Terminal", description="Versatile, readable programming language powering modern backend systems.", is_featured=True, display_order=5),
                Technology(name="FastAPI", slug="fastapi", category="Backend", icon="Zap", description="High-performance async web framework for building APIs with Python.", is_featured=True, display_order=6),
                Technology(name="Node.js", slug="nodejs", category="Backend", icon="Server", description="JavaScript runtime for building scalable network applications.", is_featured=True, display_order=7),
                Technology(name="PostgreSQL", slug="postgresql", category="Database", icon="Database", description="World's most advanced open-source relational database.", is_featured=True, display_order=8),
                Technology(name="Redis", slug="redis", category="Database", icon="Database", description="In-memory data structure store used for caching and queues.", is_featured=True, display_order=9),
                Technology(name="Docker", slug="docker", category="DevOps & Cloud", icon="Box", description="Containerization platform for consistent development and deployment.", is_featured=True, display_order=10),
                Technology(name="AWS", slug="aws", category="DevOps & Cloud", icon="Cloud", description="Comprehensive cloud computing platform.", is_featured=True, display_order=11),
                Technology(name="React Native", slug="react-native", category="Mobile", icon="Smartphone", description="Framework for building native mobile apps using React.", is_featured=True, display_order=12),
                Technology(name="Flutter", slug="flutter", category="Mobile", icon="Smartphone", description="UI toolkit for building natively compiled cross-platform apps.", is_featured=True, display_order=13),
            ]
            db.add_all(techs)
            print("✓ Seeded Technologies")

        # 4. Showcase Projects
        if db.query(Project).count() == 0:
            projects = [
                Project(
                    title="PulseCloud — Cloud Observability & Metrics SaaS",
                    slug="pulsecloud-observability-saas",
                    category="SaaS Platform",
                    client_name="PulseCloud Technologies",
                    short_description="An enterprise observability and performance monitoring dashboard tracking distributed services, latency metrics, and automated alerts.",
                    full_description=(
                        "PulseCloud is a real-time observability platform engineered to help DevOps and engineering teams visualize application telemetry, API latency, and server utilization.\n\n"
                        "INFOVET designed and developed the entire application from architecture to release, featuring real-time WebSocket metric streaming, custom customizable dashboard widgets, role-based access control, and automated Slack/Email alert dispatchers."
                    ),
                    objectives="Deliver a sub-second latency analytics dashboard capable of aggregating millions of daily server events without browser slowdown.",
                    features=[
                        "Real-time WebSocket telemetry charts",
                        "Custom widget layout builder with drag-and-drop",
                        "Multi-tenant organization management",
                        "Automated alert escalation rules",
                        "Exportable PDF and CSV compliance reports",
                    ],
                    technologies=["React", "FastAPI", "PostgreSQL", "Redis", "Docker", "Tailwind CSS"],
                    thumbnail_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
                    live_url="https://pulsecloud-demo.infovet.in",
                    github_url="https://github.com/infovet/pulsecloud-showcase",
                    start_date=date(2024, 2, 1),
                    completion_date=date(2024, 6, 15),
                    status="Completed",
                    is_featured=True,
                    is_published=True,
                    display_order=1,
                ),
                Project(
                    title="OmniCart — Headless Omnichannel E-Commerce Engine",
                    slug="omnicart-ecommerce-engine",
                    category="E-Commerce",
                    client_name="Apex Retail Group",
                    short_description="A modern headless commerce solution with instant product filtering, unified shopping cart, Stripe integration, and warehouse sync.",
                    full_description=(
                        "OmniCart was built for a high-growth lifestyle retail brand needing to replace a sluggish monolithic storefront with an ultra-fast headless shopping experience.\n\n"
                        "We implemented a React frontend connected to an optimized FastAPI backend with Redis caching, resulting in a 400% improvement in mobile page load speeds and a 32% increase in checkout conversions."
                    ),
                    objectives="Build an omnichannel e-commerce store with sub-500ms catalog search and seamless multi-currency checkout.",
                    features=[
                        "Instant client-side catalog search & faceted filtering",
                        "Multi-step checkout with Stripe & Apple Pay",
                        "Real-time inventory synchronization with central ERP",
                        "Automated invoice PDF generation & order notifications",
                        "Comprehensive admin management portal",
                    ],
                    technologies=["React", "FastAPI", "PostgreSQL", "Stripe", "Redis", "Tailwind CSS"],
                    thumbnail_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
                    live_url="https://omnicart-demo.infovet.in",
                    github_url=None,
                    start_date=date(2024, 5, 10),
                    completion_date=date(2024, 9, 20),
                    status="Completed",
                    is_featured=True,
                    is_published=True,
                    display_order=2,
                ),
                Project(
                    title="FinTrack Mobile — Wealth Management & Portfolio App",
                    slug="fintrack-wealth-management-app",
                    category="Mobile App",
                    client_name="FinTrack Digital",
                    short_description="A cross-platform financial application providing real-time net-worth tracking, automated expense categorization, and SIP forecasting.",
                    full_description=(
                        "FinTrack is an intuitive wealth companion designed for modern investors. "
                        "The app securely aggregates investment accounts, mutual funds, and fixed deposits into a unified financial dashboard.\n\n"
                        "INFOVET built the mobile app using React Native, implementing bank-grade AES-256 encryption, biometric authentication, and interactive portfolio performance charts."
                    ),
                    objectives="Provide consumers with a secure, beautifully visual mobile interface to monitor and forecast long-term wealth.",
                    features=[
                        "Biometric authentication (FaceID & Fingerprint)",
                        "Interactive net worth breakdown and asset allocation charts",
                        "Automated expense categorization via rule engine",
                        "SIP and compound interest goal projections",
                        "Encrypted local vault for offline financial records",
                    ],
                    technologies=["React Native", "TypeScript", "Python", "PostgreSQL", "FastAPI"],
                    thumbnail_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
                    live_url="https://fintrack-demo.infovet.in",
                    github_url="https://github.com/infovet/fintrack-mobile",
                    start_date=date(2024, 7, 1),
                    completion_date=date(2024, 10, 30),
                    status="Completed",
                    is_featured=True,
                    is_published=True,
                    display_order=3,
                ),
                Project(
                    title="NeuralFlow — Document Intelligence & Workflow Automation",
                    slug="neuralflow-document-automation",
                    category="AI & Automation",
                    client_name="Veritas Legal & Compliance",
                    short_description="An AI-powered document processing engine that extracts, classifies, and audits corporate contracts in seconds.",
                    full_description=(
                        "NeuralFlow replaces hundreds of hours of manual contract review. "
                        "Leveraging modern LLM APIs and optical character recognition, the system automatically identifies non-standard legal clauses, contract expiration dates, and compliance discrepancies.\n\n"
                        "The platform features an intuitive drag-and-drop document upload interface, clause diffing tools, and audit-ready PDF report generation."
                    ),
                    objectives="Accelerate legal and compliance document verification from days to minutes with high accuracy.",
                    features=[
                        "Drag-and-drop PDF and Word document ingestion",
                        "Automated key clause extraction & risk scoring",
                        "Side-by-side original vs. highlighted clause viewer",
                        "Exportable executive risk summaries",
                        "Webhook integrations for enterprise DMS systems",
                    ],
                    technologies=["Python", "FastAPI", "React", "PostgreSQL", "Gemini API", "Docker"],
                    thumbnail_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
                    live_url="https://neuralflow-demo.infovet.in",
                    github_url=None,
                    start_date=date(2024, 8, 15),
                    completion_date=date(2024, 11, 5),
                    status="Completed",
                    is_featured=True,
                    is_published=True,
                    display_order=4,
                ),
            ]
            db.add_all(projects)
            db.commit()

            # Add sample screenshots to projects
            for p in projects:
                db.refresh(p)
                imgs = [
                    ProjectImage(project_id=p.id, image_url=p.thumbnail_url, caption="Main Application Overview", display_order=1),
                    ProjectImage(project_id=p.id, image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80", caption="Analytics & Reporting Workspace", display_order=2),
                ]
                db.add_all(imgs)

            print("✓ Seeded Showcase Projects and Images")

        # 5. Testimonials
        if db.query(Testimonial).count() == 0:
            testimonials = [
                Testimonial(
                    client_name="Arjun Mehta",
                    client_company="PulseCloud Tech",
                    client_role="Co-Founder & CTO",
                    client_avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                    rating=5,
                    content="INFOVET transformed our complex data architecture into an intuitive, lightning-fast SaaS product. Their engineering rigor, transparent sprints, and proactive problem solving exceeded all our expectations.",
                    project_title="PulseCloud SaaS",
                    is_featured=True,
                    display_order=1,
                ),
                Testimonial(
                    client_name="Sarah Jenkins",
                    client_company="Apex Retail Global",
                    client_role="VP of Digital Commerce",
                    client_avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
                    rating=5,
                    content="Working with INFOVET felt like having an elite in-house engineering team. Our e-commerce conversion jumped by 32% within two months of launching the new headless platform.",
                    project_title="OmniCart Engine",
                    is_featured=True,
                    display_order=2,
                ),
                Testimonial(
                    client_name="Rajesh Verma",
                    client_company="FinTrack Digital",
                    client_role="Managing Director",
                    client_avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                    rating=5,
                    content="The mobile app INFOVET built has received over 4.8 stars on both app stores. Clean code, rock-solid security, and an exceptionally polished UI.",
                    project_title="FinTrack Mobile",
                    is_featured=True,
                    display_order=3,
                ),
            ]
            db.add_all(testimonials)
            print("✓ Seeded Testimonials")

        # 6. Team Members
        if db.query(TeamMember).count() == 0:
            team = [
                TeamMember(
                    name="Irshad Mohammad",
                    role="Founder & Chief Architect",
                    bio="10+ years engineering scalable cloud systems, full-stack architectures, and high-performance web applications.",
                    photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                    linkedin_url="https://linkedin.com",
                    github_url="https://github.com",
                    display_order=1,
                    is_active=True,
                ),
                TeamMember(
                    name="Priya Sharma",
                    role="Head of Product & UI/UX",
                    bio="Specializes in user research, design systems, and converting intricate business logic into effortless human interfaces.",
                    photo_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                    linkedin_url="https://linkedin.com",
                    github_url=None,
                    display_order=2,
                    is_active=True,
                ),
                TeamMember(
                    name="Vikram Patel",
                    role="Principal Backend Engineer",
                    bio="Expert in Python, FastAPI, distributed database architectures, asynchronous microservices, and DevOps.",
                    photo_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                    linkedin_url="https://linkedin.com",
                    github_url="https://github.com",
                    display_order=3,
                    is_active=True,
                ),
            ]
            db.add_all(team)
            print("✓ Seeded Team Members")

        db.commit()
        print("✓ All INFOVET Software Development Company seed data applied successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding company data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_company_data()

