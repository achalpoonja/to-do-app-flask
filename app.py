from flask import Flask, render_template, jsonify
from flask import request
from flask_cors import CORS, cross_origin
import urllib.request
import json
import hashlib
from datetime import date

app=Flask(__name__, template_folder='views')

cors=CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

#Homepage
@app.route('/',methods=['GET'])
@cross_origin()
def home():
    return render_template('index.html')

#Login page
@app.route('/login',methods=['GET'])
@cross_origin()
def login():
    return render_template('login.html')

#Students page
@app.route('/students',methods=['GET'])
@cross_origin()
def students():
    return render_template('users.html')

@app.route('/login',methods=['POST'])
@cross_origin()
def loginUser():
    username=request.form['username']
    password=request.form['password'].encode('utf-8')
    md5_hash=hashlib.md5()
    md5_hash.update(password)
    password=md5_hash.hexdigest()
    with open('users/user.txt','r') as fp:
        json_file=json.load(fp)
        for user in json_file['users']:
            if user['username']==username:
                if user['password']==password:
                    return jsonify({"Status":"Success"})
    return jsonify({"Status":"Failed"})
     
#Add student Information
@app.route('/add-student',methods=['POST'])
@cross_origin()
def addStudent():
    student_name=request.form['student_name']
    student_usn=request.form['student_usn']
    try:
        with open('students/students.txt','r') as fp:
            json_file=json.load(fp)
        json_file['students'].append(
            {
                'student_name':student_name,
                'student_usn':student_usn
            }
        )
    except:
        json_file={}
        json_file['students']=[]
        json_file['students'].append(
            {
                'student_name':student_name,
                'student_usn':student_usn
            }
        )    
    with open('students/students.txt','w') as outfile:
        json.dump(json_file, outfile, indent=4)
    return jsonify({"Status":"Success"})

#Get Student Information
@app.route('/get-students',methods=['GET'])
@cross_origin()
def getStudents():
    with open('students/students.txt','r') as fp:
        json_file=json.load(fp)
    return jsonify(json_file)

#Remove Student
@app.route('/remove-student/<student_usn>',methods=['DELETE'])
@cross_origin()
def removeStudent(student_usn):
    with open('students/students.txt','r') as fp:
        json_file=json.load(fp)
    student_list=json_file['students']
    for i in student_list:
        if i['student_usn']==student_usn:
            del student_list[student_list.index(i)]
    json_file['students']=student_list
    with open('students/students.txt','w') as outfile:
        json.dump(json_file, outfile, indent=4)
    return jsonify({"Status":"Success"})

#Add task for a student
@app.route('/add-task',methods=['POST'])
@cross_origin()
def addTask():
    task_name=request.form['task_name']
    task_deadline=request.form['task_deadline']
    timestamp=str(date.today())
    student_usn=request.form['student_usn']
    student_name=getStudentInformation(student_usn)
    try:
        with open('tasks/tasks.txt','r') as fp:
            json_file=json.load(fp)
            json_file['tasks'].append({
                "task":task_name,
                "deadline":task_deadline,
                "timestamp":timestamp,
                "student_usn":student_usn,
                "student_name":student_name
            })
    except:
        json_file={}
        json_file['tasks']=[]
        json_file['tasks'].append({
                "task":task_name,
                "deadline":task_deadline,
                "timestamp":timestamp,
                "student_usn":student_usn,
                "student_name":student_name
            })
    with open('tasks/tasks.txt','w') as fp:
        json.dump(json_file,fp,indent=4)
    return jsonify({"Status":"Success"})        

#Get All Added tasks
@app.route('/get-tasks',methods=['GET'])
@cross_origin()
def getTasks():
    with open('tasks/tasks.txt','r') as fp:
        json_file=json.load(fp)
    return jsonify(json_file)


#Get particular student information
def getStudentInformation(query_usn):
    with open('students/students.txt','r') as fp:
        json_file=json.load(fp)
    for student in json_file['students']:
        if student['student_usn']==query_usn:
            return student['student_name']