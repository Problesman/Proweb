from django.db import migrations


def add_roblox_category(apps, schema_editor):
    categories = apps.get_model("gametrade_app", "GameCategory")
    categories.objects.using(schema_editor.connection.alias).get_or_create(
        name="Roblox",
        defaults={
            "logo": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=120&h=120&q=80"
        },
    )


class Migration(migrations.Migration):
    dependencies = [("gametrade_app", "0004_remove_retired_game_categories")]

    operations = [migrations.RunPython(add_roblox_category, migrations.RunPython.noop)]
