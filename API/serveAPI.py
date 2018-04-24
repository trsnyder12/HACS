#where the flask API is going to go

from flask import Flask, jsonify
from firebase import firebase
from flask_mqtt import Mqtt
import json
from pyrebase import pyrebase
import datetime
import uuid
import re

config = {
    "apiKey": "AIzaSyAt1m7mt1XAT_Ppe_skwsvheWp7m4sf25E",
    "authDomain": "hacs-9caa0.firebaseapp.com",
    "databaseURL": "https://hacs-9caa0.firebaseio.com",
    "storageBucket": "hacs-9caa0.appspot.com",
}
firebase2 = pyrebase.initialize_app(config)
db = firebase2.database()


app = Flask(__name__)
app.config['MQTT_BROKER_URL'] = 'mqtt.bartrug.me'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_KEEPALIVE'] = 5
app.config['MQTT_TLS_ENABLED'] = False

mqtt = Mqtt(app)

fs = open("sensors.txt")
sensors = fs.read();
for i in sensors.split('\n'):
    mqtt.subscribe('/devices/'+i+'/events')
    print(i)
    print("subscribed")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    astring = data['topic']
    bstring = astring.split('/')
    eventId = uuid.uuid4()
    from pytz import timezone
    tz = timezone('EST') 
    date = datetime.datetime.now().strftime("%B%d%Y")
    event_date = re.split('(\d+)',date)
    time = datetime.datetime.now(tz).strftime("%I:%M%p")
    data_to_firebase = {"values":data['payload']}
    send_data_to_fb(data_to_firebase,bstring[2],event_date[1],event_date[2])
    

#helper funciton for thresholds and data
def send_data_to_fb(data_to_firebase,device,month,day):
	threshold = db.child("devices").child(bstring[2]).child("threshold").get()
	new_data = data_to_firebase.split(':')
	
	if threshold>= new_data[1]:
		db.child("devices").child(device).child("currentData").set(data_to_firebase)
		db.child("events").child(device).child(month).child(day).child(time).set(data_to_firebase)
    


# sample url 'api.bartrug.me/get-events-by-date/"'device'-'Month'ddyyyy"'
@app.route('/get-events-by-date/<string:device_date>',methods=['GET'])
def get_event_by_date(device_date):
    astring = device_date.split('-')
    device = astring[0]
    event_date = re.split('(\d+)',astring[1])

    event_by_date = db.child("events").child(device).child(event_date[0]).child(event_date[1]).get()
    response = jsonify(event_by_date.val())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

#url should be "'device'-'Month'"
#returns json of each day collected in the desired month. Each day has every event inside of it based off of the time
@app.route('/get-events-for-month/<string:device_month>',methods=['GET'])
def get_events_by_month(device_month):
    astring = device_month.split('-')
    device = astring[0]
    event_month = astring[1]
    event_by_month = db.child("events").child(device).child(event_month).get()
    response = jsonify(event_by_month.val())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# sample url 'api.bartrug.me/users/"username"'
@app.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    wanteduser = db.child("users").child(username).get()
    respone = jsonify({'user':wanteduser.val()})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# sample url 'api.bartrug.me/devices/'
@app.route('/devices/',methods=['GET'])
def get_devices():
    devices = db.child("devices").get()
    response =  jsonify({'devices':devices.val()})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# sample url 'api.bartrug.me/users/'
@app.route('/users/',methods=['GET'])
def get_users():
    users = db.child("users").get()
    response =  jsonify({'users':users.val()})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)

# sample url 'api.bartrug.me/devices-get-currData/"device_name"'
@app.route('/devices-get-currData/<string:device_name>',methods=['GET'])
def get_device_attribute(device_name):
    device = db.child("devices").child(device_name).child("currentData").get()
    response = jsonify({'DeviceData':device.val()})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# When entering a user in the system make the url string have
# attributes be seperated by '-'.
# Order for post is userid-email-name-camera-control-phone-username
# sample url 'api.bartrug.me/post-user/"userid-email-name-camera-control-phone-username"'

@app.route('/post-user/<string:user_json>')
def put_user(user_json):
    attributes = user_json.split('-')
    for x in range(0, 7-len(attributes)):
        attributes.append("null")
    user = attributes[0]
    email = attributes[1]
    name = attributes[2]
    camera = attributes[3]
    control = attributes[4]
    phone = attributes[5]
    username = attributes[6]
    data = {"name":name,"email":email,"phone":phone,"username":username}
    db.child("users").child(user).set(data)
    permissions = {"camera":camera,"control":control}
    db.child("users").child(user).child("permissions").set(permissions)
    response = jsonify({'userId':user})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

#string should be 'userid-attribute_name-attribute_data'
#sample url 'api.bartrug.me/post-user-attributes/"userid-attribute_name-attribute_data"'
@app.route('/post-user-attribute/<string:attribute_json>')
def put_user_attribute(attribute_json):
    attributes = attribute_json.split('-')
    a = attributes[1]
    user = attributes[0]
    db.child("users").child(user).update({a:attributes[2]})
    response = jsonify({'userid': user,'attribute name':attributes[1],'attribute':attributes[2]})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# url call should be as follows 'api.bartrug.me/get-device/"devicename"'
@app.route('/get-device/<string:device_name>', methods=['GET'])
def get_device(device_name):
    device = db.child('devices').child(device_name).get()
    response = jsonify(device.val())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# String order should be deviceId-attributes-location-nickname-type
# Sample url 'api.bartrug.me/post-device/"deviceId-threshold-location-nickname-type"'
@app.route('/post-device/<string:device_json>')
def put_device(device_json):
    attrs = device_json.split('-')
    for x in range(0, 5-len(attrs)):
        attrs.append("null")
    deviceId = attrs[0]
    threshold = attrs[1]
    location = attrs[2]
    nickname = attrs[3]
    type_device = attrs[4]
    data = {"threshold":thseshold,"location":location,"nickname":nickname,"type":type_device,"currentData":"null"}
    db.child("devices").child(deviceId).set(data)
    response = jsonify({'deviceId':deviceId})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# sample url 'api.bartrug.me/delete-device/"device_name"'
@app.route('/delete-device/<string:device_name>')
def delete_device(device_name):
    device = device_name
    db.child("devices").child(device).remove()
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# sample url 'api.bartrug.me/delete-user/"username"'
@app.route('/delete-user/<string:user_name>')
def delete_user(user_name):
    user = user_name
    db.child("users").child(user).remove()
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response    


