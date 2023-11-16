import os

#flasky flask
from flask import Flask, flash, redirect, render_template, request, url_for


#configure application
app = Flask(__name__, static_folder='static')

#index page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'GET':
        return render_template("index.html")
    elif request.method == 'POST':
        return render_template("index.html")
    
if __name__ == '__main__':
        app.run()