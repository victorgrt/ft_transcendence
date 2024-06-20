from django.shortcuts import render
from django.http import HttpResponse

# # Hello World
# def home_page_view(request):
#     print(request)
#     return HttpResponse("Hello, World!")

def starting_page(request):
    return render(request, 'pages/base.html')

def pong(request):
    return render(request, 'pages/partials/pong.html')

def acount(request):
    return render(request, 'pages/partials/acount.html')

def home_page(request):
    return render(request, 'pages/partials/home_page.html')