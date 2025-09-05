from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from phonenumber_field.modelfields import PhoneNumberField
from tinymce.models import HTMLField


# --- Core Models for Destinations and Hotels ---


class Destination(models.Model):
    """
    Represents a travel destination, like a city or a region.
    """

    name = models.CharField(
        max_length=200,
        unique=True,
        help_text="The name of the destination (e.g., Paris, Goa).",
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        help_text="A unique slug for the destination URL, generated from the name.",
    )
    description = HTMLField(help_text="A captivating description of the destination.")
    country = models.CharField(max_length=100)
    image = models.ImageField(
        upload_to="destination_images/",
        help_text="A representative cover image for the destination.",
    )
    best_time_to_visit = models.CharField(
        max_length=100, help_text="e.g., 'October to March'"
    )
    is_featured = models.BooleanField(
        default=False, help_text="Feature this destination on the homepage."
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Destination"
        verbose_name_plural = "Destinations"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.country}"


class Itinerary(models.Model):
    """
    Represents a single day's plan within a destination's itinerary.
    """

    destination = models.ForeignKey(
        Destination, related_name="itinerary", on_delete=models.CASCADE
    )
    day = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    detail = models.TextField()

    def __str__(self):
        return f"Day {self.day}: {self.title}"

    class Meta:
        ordering = ["day"]


class Hotel(models.Model):
    """
    Represents a single hotel listing.
    """

    name = models.CharField(max_length=200, help_text="The name of the hotel.")
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        help_text="A unique slug for the hotel URL, generated from the name.",
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="hotels",
        help_text="The destination where the hotel is located.",
    )
    description = HTMLField(help_text="A detailed description of the hotel.")
    address = models.CharField(
        max_length=255, help_text="The physical address of the hotel."
    )
    phone_number = PhoneNumberField(
        blank=True, help_text="The contact phone number for the hotel."
    )
    email = models.EmailField(blank=True, help_text="The contact email for the hotel.")
    price_per_night = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Base cost for a one-night stay."
    )
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, help_text="Star rating from 1.0 to 5.0."
    )
    amenities = models.ManyToManyField(
        "Amenity",
        blank=True,
        related_name="hotels",
        help_text="Select the amenities available at this hotel.",
    )
    image = models.ImageField(
        upload_to="hotel_images/",
        help_text="The main representative (cover) image of the hotel.",
    )
    is_featured = models.BooleanField(
        default=False, help_text="Feature this hotel on the homepage."
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Designates whether the hotel is currently accepting bookings.",
    )

    class Meta:
        ordering = ["-rating", "name"]
        verbose_name = "Hotel"
        verbose_name_plural = "Hotels"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.destination.name}"


class Amenity(models.Model):
    """
    Represents a hotel amenity (e.g., Wi-Fi, Pool, Gym).
    """

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Amenity"
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    """
    Represents an image related to a Hotel or Destination.
    """

    caption = models.CharField(
        max_length=200, blank=True, help_text="Optional caption for the image."
    )
    image = models.ImageField(upload_to="gallery/", help_text="The image file.")
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name="gallery_images",
        null=True,
        blank=True,
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="gallery_images",
        null=True,
        blank=True,
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"

    def __str__(self):
        if self.hotel:
            return f"Image for {self.hotel.name}"
        if self.destination:
            return f"Image for {self.destination.name}"
        return self.caption or f"Gallery Image {self.id}"


# --- User Interaction Models ---


class Booking(models.Model):
    """
    Represents a hotel booking made by a user.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings"
    )
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="bookings")
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    num_guests = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"

    def __str__(self):
        return f"Booking for {self.hotel.name} by {self.user.username}"


class Enquiry(models.Model):
    """
    Stores customer enquiries from a contact form.
    """

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = PhoneNumberField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(
        default=False, help_text="Mark as true when the enquiry has been addressed."
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Enquiry"
        verbose_name_plural = "Enquiries"

    def __str__(self):
        return f"Enquiry from {self.name} - {self.subject}"


class Testimonial(models.Model):
    """
    Represents a customer testimonial for display on the site.
    """

    name = models.CharField(max_length=100, help_text="Name of the customer.")
    designation = models.CharField(
        max_length=100,
        blank=True,
        help_text="Customer's designation (e.g., 'Solo Traveler').",
    )
    content = models.TextField(help_text="The testimonial content.")
    rating = models.PositiveSmallIntegerField(
        default=5, help_text="Rating from 1 to 5."
    )
    is_approved = models.BooleanField(
        default=False, help_text="Only approved testimonials will be shown on the site."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"Testimonial by {self.name}"


class FAQ(models.Model):
    """
    Represents a frequently asked question.
    """

    question = models.CharField(max_length=300)
    answer = models.TextField()

    def __str__(self):
        return self.question


# --- Blog Models ---


class Category(models.Model):
    """
    Represents a blog category.
    """

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    """
    Represents a blog tag.
    """

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """
    Represents a single blog post.
    """

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )

    title = models.CharField(max_length=200, help_text="The title of the blog post.")
    slug = models.SlugField(
        max_length=255,
        unique_for_date="published_at",
        blank=True,
        help_text="A unique slug for the post URL, generated from the title.",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blog_posts",
        help_text="The author of the post.",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts",
        help_text="The primary category of the blog post.",
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="posts",
        help_text="Tags related to the blog post.",
    )
    content = HTMLField(help_text="The main content of the blog post.")
    excerpt = models.TextField(
        blank=True, help_text="A short summary of the post for list pages."
    )
    featured_image = models.ImageField(
        upload_to="blog_images/",
        blank=True,
        null=True,
        help_text="A representative image for the blog post.",
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    published_at = models.DateTimeField(
        default=timezone.now, help_text="The date and time the post is published."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.PositiveIntegerField(
        default=0, help_text="The number of times the post has been viewed."
    )

    class Meta:
        ordering = ["-published_at"]
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
