from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.db import migrations
from django.utils import timezone


SAMPLE_PASSWORD = "SamplePass123!"
SAMPLE_EMAILS = [
    "ayesha.sample@sda.test",
    "bilal.sample@sda.test",
    "sana.sample@sda.test",
    "usman.sample@sda.test",
]
SAMPLE_MATERIAL_URLS = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.africau.edu/images/default/sample.pdf",
    "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf",
]


def get_or_create_user(User, email, username, date_of_birth, profile_image):
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": username,
            "password": make_password(SAMPLE_PASSWORD),
            "date_of_birth": date_of_birth,
            "profile_image": profile_image,
            "role": "user",
            "is_active": True,
        },
    )

    if not created:
        changed = False
        for field, value in {
            "username": username,
            "date_of_birth": date_of_birth,
            "profile_image": profile_image,
            "role": "user",
            "is_active": True,
        }.items():
            if getattr(user, field) != value:
                setattr(user, field, value)
                changed = True
        if changed:
            user.save()

    return user


def get_community(Community, name, description):
    community, _ = Community.objects.get_or_create(
        name=name,
        defaults={"description": description},
    )
    return community


def create_sample_data(apps, schema_editor):
    User = apps.get_model("api", "User")
    Community = apps.get_model("api", "Community")
    StudyPost = apps.get_model("api", "StudyPost")
    CarpoolPost = apps.get_model("api", "CarpoolPost")
    BloodDonationPost = apps.get_model("api", "BloodDonationPost")
    Comment = apps.get_model("api", "Comment")
    Like = apps.get_model("api", "Like")
    Material = apps.get_model("api", "Material")

    study = get_community(
        Community,
        "Study Guide",
        "Ask and answer study-related questions.",
    )
    carpool = get_community(
        Community,
        "Carpool",
        "Find and offer campus rides.",
    )
    blood = get_community(
        Community,
        "Blood Donation",
        "Request and coordinate blood donations.",
    )

    ayesha = get_or_create_user(
        User,
        "ayesha.sample@sda.test",
        "Ayesha Khan",
        "2002-04-12",
        "https://i.pravatar.cc/150?img=47",
    )
    bilal = get_or_create_user(
        User,
        "bilal.sample@sda.test",
        "Bilal Ahmed",
        "2001-09-03",
        "https://i.pravatar.cc/150?img=12",
    )
    sana = get_or_create_user(
        User,
        "sana.sample@sda.test",
        "Sana Malik",
        "2003-01-22",
        "https://i.pravatar.cc/150?img=32",
    )
    usman = get_or_create_user(
        User,
        "usman.sample@sda.test",
        "Usman Raza",
        "2000-11-18",
        "https://i.pravatar.cc/150?img=68",
    )

    now = timezone.now()

    study_posts = [
        {
            "user": ayesha,
            "community": study,
            "main_topic": "Database Normalization",
            "question_asked": "Can someone explain the difference between 2NF and 3NF with a university registration example?",
            "link_url": "https://www.geeksforgeeks.org/normal-forms-in-dbms/",
            "image_url": None,
            "created_at": now - timedelta(hours=6),
        },
        {
            "user": bilal,
            "community": study,
            "main_topic": "React State Management",
            "question_asked": "When should I use Zustand instead of prop drilling for a medium-sized Next.js app?",
            "link_url": "https://zustand-demo.pmnd.rs/",
            "image_url": None,
            "created_at": now - timedelta(days=1, hours=2),
        },
    ]

    carpool_posts = [
        {
            "user": sana,
            "community": carpool,
            "pickup_point": "Main Campus Gate",
            "dropoff_point": "Siraiki Town",
            "pickup_time": now + timedelta(hours=3),
            "preferred_gender": "female",
            "capacity": 2,
            "created_at": now - timedelta(hours=2),
        },
        {
            "user": usman,
            "community": carpool,
            "pickup_point": "Library Parking",
            "dropoff_point": "Bahawalpur Cantt",
            "pickup_time": now + timedelta(days=1, hours=1),
            "preferred_gender": "male",
            "capacity": 3,
            "created_at": now - timedelta(hours=10),
        },
    ]

    blood_posts = [
        {
            "user": bilal,
            "community": blood,
            "blood_type_required": "O+",
            "required_within": "2 days",
            "urgency": "High",
            "created_at": now - timedelta(hours=1),
        },
        {
            "user": ayesha,
            "community": blood,
            "blood_type_required": "B-",
            "required_within": "1 week",
            "urgency": "Medium",
            "created_at": now - timedelta(days=2),
        },
    ]

    created_posts = []

    for data in study_posts:
        post, _ = StudyPost.objects.get_or_create(
            main_topic=data["main_topic"],
            question_asked=data["question_asked"],
            defaults=data,
        )
        created_posts.append(post)

    for data in carpool_posts:
        post, _ = CarpoolPost.objects.get_or_create(
            pickup_point=data["pickup_point"],
            dropoff_point=data["dropoff_point"],
            pickup_time=data["pickup_time"],
            defaults=data,
        )
        created_posts.append(post)

    for data in blood_posts:
        post, _ = BloodDonationPost.objects.get_or_create(
            blood_type_required=data["blood_type_required"],
            required_within=data["required_within"],
            urgency=data["urgency"],
            defaults=data,
        )
        created_posts.append(post)

    comment_rows = [
        (created_posts[0], sana, "This clicked for me when I treated partial dependency separately from transitive dependency."),
        (created_posts[0], usman, "Try mapping Course, Student, and Enrollment tables first."),
        (created_posts[1], ayesha, "Zustand is helpful once sibling components need the same client-side state."),
        (created_posts[2], bilal, "I can join from the main gate today."),
        (created_posts[4], sana, "Sharing this in my class group as well."),
    ]

    for post, user, content in comment_rows:
        Comment.objects.get_or_create(
            post=post,
            user=user,
            content=content,
            defaults={"created_at": now - timedelta(minutes=30)},
        )

    like_rows = [
        (created_posts[0], bilal),
        (created_posts[0], usman),
        (created_posts[1], sana),
        (created_posts[2], ayesha),
        (created_posts[3], bilal),
        (created_posts[4], ayesha),
        (created_posts[4], usman),
        (created_posts[5], sana),
    ]

    for post, user in like_rows:
        Like.objects.get_or_create(post_id=post, user_id=user)

    material_rows = [
        {
            "title": "Database Systems",
            "description": "Normalization notes, ERD practice, and SQL revision material.",
            "file_url": SAMPLE_MATERIAL_URLS[0],
        },
        {
            "title": "Web Programming",
            "description": "React, Next.js, REST API, and deployment checklist.",
            "file_url": SAMPLE_MATERIAL_URLS[1],
        },
        {
            "title": "Software Design",
            "description": "SOLID principles, UML diagrams, and design pattern summaries.",
            "file_url": SAMPLE_MATERIAL_URLS[2],
        },
    ]

    for data in material_rows:
        Material.objects.get_or_create(
            title=data["title"],
            file_url=data["file_url"],
            defaults={
                "description": data["description"],
                "created_at": now,
            },
        )


def remove_sample_data(apps, schema_editor):
    User = apps.get_model("api", "User")
    Material = apps.get_model("api", "Material")

    User.objects.filter(email__in=SAMPLE_EMAILS).delete()
    Material.objects.filter(file_url__in=SAMPLE_MATERIAL_URLS).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0007_seed_communities"),
    ]

    operations = [
        migrations.RunPython(create_sample_data, remove_sample_data),
    ]
