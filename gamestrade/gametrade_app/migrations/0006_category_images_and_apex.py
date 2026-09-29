from django.db import migrations, models


CATEGORY_IMAGES = {
    "Valorant": "images/categories/valorant.png",
    "ROV (Realm of Valor)": "images/categories/rov.png",
    "League of Legends": "images/categories/lol.png",
    "Roblox": "images/categories/roblox.png",
    "Apex Legends": "images/categories/apex.png",
}


def set_category_images(apps, schema_editor):
    category_model = apps.get_model("gametrade_app", "GameCategory")
    categories = category_model.objects.using(schema_editor.connection.alias)
    for name, logo in CATEGORY_IMAGES.items():
        categories.update_or_create(name=name, defaults={"logo": logo})


class Migration(migrations.Migration):
    dependencies = [("gametrade_app", "0005_add_roblox_category")]

    operations = [
        migrations.AlterField(
            model_name="gamecategory",
            name="logo",
            field=models.CharField(max_length=500, verbose_name="รูปภาพโลโก้"),
        ),
        migrations.RunPython(set_category_images, migrations.RunPython.noop),
    ]
