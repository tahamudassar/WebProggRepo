from django.db import models

from django.db import models
from django.utils import timezone

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
    

class Community(models.Model):
    community_id = models.AutoField(primary_key=True)  # Unique identifier for each community
    name = models.CharField(max_length=100, unique=True)  # Name of the community
    description = models.TextField()  # Brief description of the community

    def __str__(self):
        return self.name

class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_type = models.CharField(max_length=10, choices=[('link', 'Link'), ('image', 'Image'), ('text', 'Text')])
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)

    class Meta:
        abstract = False  # This makes it an abstract base class

    def __str__(self):
        return f"Post by {self.user.username} in {self.community.name}"

# Link Post model
class LinkPost(Post):
    link_url = models.URLField()

    def __str__(self):
        return f"Link Post: {self.link_url}"

# Image Post model
class ImagePost(Post):
    image_url = models.URLField()

    def __str__(self):
        return f"Image Post: {self.image_url}"

# Text Post model
class TextPost(Post):
    def __str__(self):
        return f"Text Post: {self.content[:30]}..."  


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE,null=True)  # This will reference the concrete Post tables
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.user.username} on Post {self.post.post_id}"



class Like(models.Model):
    like_id = models.AutoField(primary_key=True)  # Unique identifier for each like
    post_id = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='likes')  # Link to the liked post
    user_id = models.ForeignKey('User', on_delete=models.CASCADE, related_name='likes')  # Link to the user who liked the post
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the like was created

    def __str__(self):
        return f"Like by {self.user_id.username} on post {self.post_id.post_id}"
    
class Share(models.Model):
    share_id = models.AutoField(primary_key=True)  # Unique identifier for each share
    post_id = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='shares')  # Link to the shared post
    user_id = models.ForeignKey('User', on_delete=models.CASCADE, related_name='shares')  # Link to the user who shared the post
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the share was created

    def __str__(self):
        return f"Share by {self.user_id.username} on post {self.post_id.post_id}"
    


class Follow(models.Model):
    follower = models.ForeignKey('User', on_delete=models.CASCADE, related_name='following')  # The user who is following
    followed_user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='followers')  # The user who is being followed
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of when the follow action occurred

    class Meta:
        unique_together = ('follower', 'followed_user')  # Ensures a user can't follow another user more than once

    def __str__(self):
        return f"{self.follower.username} follows {self.followed_user.username}"
    

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('friend_request', 'Friend Request'),
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('share', 'Share'),
    ]

    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True, blank=True)  # Nullable, links to Post
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sent_notifications')  # Nullable, identifies who triggered the notification
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username} - {self.type} from {self.from_user.username if self.from_user else 'N/A'}"
    

class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)  # Title of the resource
    description = models.TextField()  # Description of the material
    file_url = models.URLField()  # URL to the file or resource
    created_at = models.DateTimeField(default=timezone.now)  # Timestamp when the material was added
    

    def __str__(self):
        return self.title