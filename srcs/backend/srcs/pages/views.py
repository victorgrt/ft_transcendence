from django.shortcuts import render
from django.http import HttpResponse

# Hello World
def home_page_view(request):
    print(request)
    return HttpResponse("Hello, World!")