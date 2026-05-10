from django.db import migrations


COMMUNITIES = [
    ("Study Guide", "Ask and answer study-related questions."),
    ("Carpool", "Find and offer campus rides."),
    ("Blood Donation", "Request and coordinate blood donations."),
]


def seed_communities(apps, schema_editor):
    Community = apps.get_model("api", "Community")

    for name, description in COMMUNITIES:
        Community.objects.get_or_create(
            name=name,
            defaults={"description": description},
        )


def unseed_communities(apps, schema_editor):
    Community = apps.get_model("api", "Community")
    Community.objects.filter(name__in=[name for name, _ in COMMUNITIES]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0006_alter_material_description"),
    ]

    operations = [
        migrations.RunPython(seed_communities, unseed_communities),
    ]
