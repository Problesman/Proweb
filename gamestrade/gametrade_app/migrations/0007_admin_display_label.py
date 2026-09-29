from django.db import migrations, models


def rename_support_rooms(apps, schema_editor):
    rooms = apps.get_model("gametrade_app", "ChatRoom")
    rooms.objects.using(schema_editor.connection.alias).filter(
        related_post__isnull=True, title="ติดต่อผู้ดูแล"
    ).update(title="ติดต่อแอดมิน")


class Migration(migrations.Migration):
    dependencies = [("gametrade_app", "0006_category_images_and_apex")]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("Member", "Member (สมาชิกผู้ซื้อ/ผู้ขาย)"),
                    ("Admin", "แอดมิน (คนกลาง Escrow)"),
                ],
                default="Member",
                max_length=20,
            ),
        ),
        migrations.RunPython(rename_support_rooms, migrations.RunPython.noop),
    ]
