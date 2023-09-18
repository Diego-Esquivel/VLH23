# save this as app.py
import os
from flask import Flask, request, render_template, make_response, send_file #were working with this. don't ask my why, itd take too long
import requests


###########################################################################################################################################################
"""
REALLY IMPORTANT FORM DATA HTTP INFORMATION
"""
REQUEST_FORM_DATA_BOUNDARY = "REQUEST_FORM_DATA_BOUNDARY"
FORM_DATA_STARTING_PAYLOAD = '--{0}\r\nContent-Disposition: form-data; name=\\"'.format(REQUEST_FORM_DATA_BOUNDARY)
FORM_DATA_MIDDLE_PAYLOAD = '\"\r\n\r\n'
FORM_DATA_ENDING_PAYLOAD = '--{0}--'.format(REQUEST_FORM_DATA_BOUNDARY)
###########################################################################################################################################################

project_root = os.path.dirname('VLH23') #the directory the project is located in. I don't know when i might need to change this.
template_path = os.path.join(project_root, '.') #the folder the app should look in when running the 'render_template' function.
app = Flask('flasktest', template_folder=template_path) #This command initializes our Flask instance with arg variables.

CREATE,READ,UPDATE,DELETE = "create","read","update","delete" #ill implement this when it makes sense to.
AVAILABLECOMMANDS = {
    'create' : CREATE,
    'read' : READ,
    'update' : UPDATE,
    'delete' : DELETE
} #implement this when it makes sense to.

#the default route to the flask front-end. This route is actually the ONLY route because of the choice to make this a SPA (Single Page Application) app.
@app.route('/', methods = ['GET','POST'])
#hello function: reads request method and directs the program to the right path.
def hello():
    #Verify the method is 'post' method. if it is not 'post' then something extraordinary is happening.
    if request.method == 'POST':
        #in the admin.html we set this header 'idppeppp' to the write command so we use the header to set the command values here.
        cmd = request.headers.get("idppeppp")
        if cmd == 'pass':
            #The command is to return my test.
            retval = passed()
            return make_response(retval,200) #f"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n{retval}"
    return render_template("index.html")
#end hello function
@app.route('/demo.css', methods = ['GET'])
def getCSS1():
    return make_response(open("demo.css",'r').read(),200)

@app.route('/styles.css', methods = ['GET'])
def getCSS2():
    return make_response(open("styles.css",'r').read(),200)
@app.route('/template.css', methods = ['GET'])
def getCSS3():
    return make_response(open("template.css",'r').read(),200)
@app.route('/demo.js', methods = ['GET'])
def getjs():
    return make_response(open("demo.js",'r').read(),200)
@app.route('/img/ev.svg', methods = ['GET'])
def getgas():
    return send_file("img/ev.svg")
#create function: applies logic to create the write item(s). Takes no args because we access the request.form flask object data in the function to uncover what the client intends to create.

def passed():
    return f"98"

@app.route('/onsub.js', methods = ['GET','POST'])
#the route to get the script for the html
def getJavascriptSub():
    #Verify the method is 'post' method. if it is not 'post' then something extraordinary is happening.
    if request.method == 'GET':
        return make_response(open("script/onsub.js",'r').read(),200) #f"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n{retval}"
    return render_template("admin.html")

@app.route('/script/j-query.js', methods = ['GET','POST'])
#the route to get the script for the html
def getJavascriptQuery():
    #Verify the method is 'post' method. if it is not 'post' then something extraordinary is happening.
    if request.method == 'GET':
        return make_response(open("script/j-query.js",'r').read(),200) #f"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n{retval}"
    return render_template("admin.html")

@app.route('/script/script.js', methods = ['GET','POST'])
#the route to get the script for the html
def getJavascriptScript():
    #Verify the method is 'post' method. if it is not 'post' then something extraordinary is happening.
    if request.method == 'GET':
        return make_response(open("script/script.js",'r').read(),200) #f"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n{retval}"
    return render_template("admin.html")
    
@app.route('/style.css', methods = ['GET','POST'])
#the route to get the script for the html
def getCSS():
    #Verify the method is 'post' method. if it is not 'post' then something extraordinary is happening.
    if request.method == 'GET':
        return make_response(open("front-end/style.css",'r').read(),200) #f"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n{retval}"
    return render_template("admin.html")
    
if __name__ == '__main__':
    app.run(debug=True)