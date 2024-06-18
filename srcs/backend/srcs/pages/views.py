from django.shortcuts import render
from django.http import HttpResponse

# # Hello World
# def home_page_view(request):
#     print(request)
#     return HttpResponse("Hello, World!")

def starting_page(request):
    return render(request, 'pages/base.html')

def game(request):
    return render(request, 'pages/game.html')