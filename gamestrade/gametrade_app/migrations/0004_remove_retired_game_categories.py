from django.db import migrations


RETIRED_GAMES = ("EA FC Mobile", "FC Mobile", "Genshin Impact", "Free Fire")


def remove_retired_games(apps, schema_editor):
    categories = apps.get_model("gametrade_app", "GameCategory")
    posts = apps.get_model("gametrade_app", "GamePost")
    rooms = apps.get_model("gametrade_app", "ChatRoom")

    category_ids = list(
        categories.objects.using(schema_editor.connection.alias)
        .filter(name__in=RETIRED_GAMES)
        .values_list("category_id", flat=True)
    )
    if not category_ids:
        return

    post_ids = list(
        posts.objects.using(schema_editor.connection.alias)
        .filter(category_id__in=category_ids)
        .values_list("post_id", flat=True)
    )
    if post_ids:
        # These rooms would otherwise survive with related_post set to NULL.
        rooms.objects.using(schema_editor.connection.alias).filter(
            related_post_id__in=post_ids
        ).delete()

    # Post and order records are removed by their CASCADE relationships.
    categories.objects.using(schema_editor.connection.alias).filter(
        category_id__in=category_ids
    ).delete()


class Migration(migrations.Migration):
    dependencies = [("gametrade_app", "0003_alter_order_slip_image")]

    operations = [migrations.RunPython(remove_retired_games, migrations.RunPython.noop)]
