import os

#flasky flask
import flask, import Flask, render_template, request


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