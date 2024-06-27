from django.db import models

#dep: pip install Pillow (for loading images in db)
 
#Creating Account table
class AccTable(models.Model):
    #id = models.IntegerField() AutoField key
    name = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
    email = models.CharField(max_length=150)
    avatar = models.ImageField(upload_to='img_avatars/')
    def __str__(self):
        return self.name