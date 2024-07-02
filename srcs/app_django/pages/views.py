from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.shortcuts import render, redirect

# # Hello World
# def home_page_view(request):
#     print(request)
#     return HttpResponse("Hello, World!")

def starting_page(request):
    return render(request, 'pages/base.html')

def pong(request):
    return render(request, 'pages/partials/pong.html')

def account(request):
    return render(request, 'pages/partials/account.html')

def home_page(request):
    return render(request, 'pages/partials/home_page.html')

def chat(request):
    return render(request, 'pages/partials/chat.html')
