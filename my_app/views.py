from django.shortcuts import render, get_object_or_404
from .models import Destination, Hotel, BlogPost, FAQ, Enquiry

def home(request):
    featured_destinations = Destination.objects.order_by('-rating')[:4]
    featured_hotels = Hotel.objects.order_by('-rating')[:4]
    faqs = FAQ.objects.all()
    context = {
        'featured_destinations': featured_destinations,
        'featured_hotels': featured_hotels,
        'faqs': faqs,
    }
    return render(request, 'index.html', context)

def destinations(request):
    destinations = Destination.objects.all()
    return render(request, 'destinations.html', {'destinations': destinations})

def destination_detail(request, slug):
    destination = get_object_or_404(Destination, slug=slug)
    return render(request, 'destination-details.html', {'destination': destination})

def hotels(request):
    hotels = Hotel.objects.all()
    return render(request, 'hotels.html', {'hotels': hotels})

def hotel_detail(request, slug):
    hotel = get_object_or_404(Hotel, slug=slug)
    return render(request, 'hotel-details.html', {'hotel': hotel})

def blog(request):
    posts = BlogPost.objects.order_by('-published_at')
    return render(request, 'blog.html', {'posts': posts})

def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    return render(request, 'blog-details.html', {'post': post})

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        Enquiry.objects.create(name=name, email=email, message=message)
        # You can add a success message here
    return render(request, 'contact.html')