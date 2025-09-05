from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

# Import all models from your models.py file
from .models import (
    Destination,
    Hotel,
    Amenity,
    GalleryImage,
    Booking,
    Enquiry,
    Testimonial,
    Category,
    Tag,
    BlogPost,
    Itinerary,
    FAQ,
)


# --- Configuration for Core Models ---


class GalleryImageInline(admin.TabularInline):
    """
    Allows editing GalleryImage models directly from the Hotel or Destination admin page.
    This provides a more integrated and efficient workflow.
    """

    model = GalleryImage
    extra = 1  # Number of empty forms to display
    readonly_fields = ("image_preview",)
    fields = ("image", "image_preview", "caption")

    def image_preview(self, obj):
        """Renders a thumbnail of the image."""
        if obj.image:
            return format_html(
                '<img src="{}" width="150" height="auto" />', obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Image Preview"


class ItineraryInline(admin.TabularInline):
    """
    Allows editing of Itinerary models directly within the Destination admin page.
    """

    model = Itinerary
    extra = 1  # Number of empty forms to display


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Destinations.
    """

    list_display = ("name", "country", "is_featured", "image_preview")
    list_filter = ("country", "is_featured")
    search_fields = ("name", "country")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [GalleryImageInline, ItineraryInline]
    readonly_fields = ("image_preview",)
    fieldsets = (
        (None, {"fields": ("name", "slug", "country", "is_featured")}),
        ("Content", {"fields": ("description", "best_time_to_visit")}),
        ("Media", {"fields": ("image", "image_preview")}),
    )

    def image_preview(self, obj):
        """Renders a thumbnail of the main destination image."""
        if obj.image:
            return format_html(
                '<img src="{}" width="150" height="auto" />', obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Cover Image"


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Hotels.
    """

    list_display = (
        "name",
        "destination",
        "price_per_night",
        "rating",
        "is_featured",
        "is_available",
    )
    list_filter = ("destination", "is_featured", "is_available", "rating")
    search_fields = ("name", "destination__name", "address")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("amenities",)  # Better UI for ManyToMany fields
    inlines = [GalleryImageInline]
    readonly_fields = ("image_preview",)
    fieldsets = (
        (
            None,
            {"fields": ("name", "slug", "destination", "is_featured", "is_available")},
        ),
        (
            "Details",
            {"fields": ("description", "price_per_night", "rating", "amenities")},
        ),
        ("Contact Information", {"fields": ("address", "phone_number", "email")}),
        ("Media", {"fields": ("image", "image_preview")}),
    )

    def image_preview(self, obj):
        """Renders a thumbnail of the main hotel image."""
        if obj.image:
            return format_html(
                '<img src="{}" width="150" height="auto" />', obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Cover Image"


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Amenities.
    """

    list_display = ("name",)
    search_fields = ("name",)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    """
    Admin interface for managing all Gallery Images.
    """

    list_display = ("__str__", "image_preview", "related_object_link")
    list_filter = ("hotel", "destination")
    search_fields = ("caption", "hotel__name", "destination__name")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        """Renders a thumbnail of the gallery image."""
        if obj.image:
            return format_html(
                '<img src="{}" width="150" height="auto" />', obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Image Preview"

    def related_object_link(self, obj):
        """Creates a link to the related Hotel or Destination admin page."""
        if obj.hotel:
            url = reverse("admin:my_app_hotel_change", args=[obj.hotel.id])
            return format_html('<a href="{}">{}</a>', url, obj.hotel)
        if obj.destination:
            url = reverse("admin:my_app_destination_change", args=[obj.destination.id])
            return format_html('<a href="{}">{}</a>', url, obj.destination)
        return "N/A"

    related_object_link.short_description = "Related To"


# --- Configuration for User Interaction Models ---


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """
    Admin interface for viewing Bookings.
    It's mostly read-only as bookings should be managed by the system.
    """

    list_display = ("id", "user", "hotel", "check_in_date", "check_out_date", "status")
    list_filter = ("status", "created_at", "hotel")
    search_fields = ("user__username", "hotel__name", "user__email")
    readonly_fields = [
        f.name for f in Booking._meta.fields
    ]  # Makes all fields read-only

    def has_add_permission(self, request):
        return False  # Disable adding new bookings from the admin

    def has_delete_permission(self, request, obj=None):
        return False  # Disable deleting bookings from the admin


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    """
    Admin interface for managing customer Enquiries, acting as a mini-CRM.
    """

    list_display = ("name", "subject", "created_at", "is_resolved")
    list_filter = ("is_resolved", "created_at")
    search_fields = ("name", "email", "subject", "message")
    list_per_page = 20
    readonly_fields = (
        "name",
        "email",
        "phone_number",
        "subject",
        "message",
        "created_at",
        "contact_actions",
    )
    fieldsets = (
        (
            "Enquiry Details",
            {
                "fields": (
                    "name",
                    "email",
                    "phone_number",
                    "subject",
                    "message",
                    "created_at",
                )
            },
        ),
        (
            "Admin Actions",
            {
                "fields": (
                    "is_resolved",
                    "contact_actions",
                )
            },
        ),
    )

    def contact_actions(self, obj):
        actions = []
        if obj.email:
            email_button_style = "background-color: #417690; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none; margin-right: 5px;"
            actions.append(
                format_html(
                    '<a style="{}" href="mailto:{}" target="_blank">Send Email</a>',
                    email_button_style,
                    obj.email,
                )
            )
        if obj.phone_number:
            call_button_style = "background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none;"
            actions.append(
                format_html(
                    '<a style="{}" href="tel:{}" target="_blank">Call Now</a>',
                    call_button_style,
                    obj.phone_number,
                )
            )
        if not actions:
            return "No contact info"
        return format_html("".join(actions))

    contact_actions.short_description = "Actions"
    contact_actions.allow_tags = True

    def has_add_permission(self, request):
        return False  # Enquiries should only come from the contact form


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Testimonials with approval action.
    """

    list_display = ("name", "rating", "is_approved", "created_at")
    list_filter = ("is_approved", "rating")
    search_fields = ("name", "content")
    actions = ["approve_testimonials"]

    def approve_testimonials(self, _request, queryset):
        """Custom admin action to approve selected testimonials."""
        queryset.update(is_approved=True)

    approve_testimonials.short_description = "Approve selected testimonials"


# --- Configuration for Blog Models ---


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin interface for Blog Categories."""

    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Admin interface for Blog Tags."""

    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Blog Posts.
    """

    list_display = (
        "title",
        "author",
        "category",
        "status",
        "published_at",
        "image_preview",
    )
    list_filter = ("status", "category", "author", "created_at")
    search_fields = ("title", "content", "excerpt")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("tags",)
    date_hierarchy = "published_at"
    actions = ["publish_posts"]
    readonly_fields = ("image_preview",)
    fieldsets = (
        (None, {"fields": ("title", "slug", "author", "status")}),
        ("Content", {"fields": ("content", "excerpt")}),
        ("Organization", {"fields": ("category", "tags")}),
        ("Media", {"fields": ("featured_image", "image_preview")}),
        ("Scheduling", {"fields": ("published_at",)}),
    )

    def image_preview(self, obj):
        """Renders a thumbnail of the featured image."""
        if obj.featured_image:
            return format_html(
                '<img src="{}" width="150" height="auto" />', obj.featured_image.url
            )
        return "No Image"

    image_preview.short_description = "Featured Image"

    def publish_posts(self, _request, queryset):
        """Custom admin action to publish selected draft posts."""
        queryset.update(status="published")

    publish_posts.short_description = "Publish selected posts"


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    """
    Admin interface for managing FAQs.
    """

    list_display = ("question",)
    search_fields = ("question", "answer")