#where the flask API is going to go

from flask import Flask, jsonify
from firebase import firebase
from flask_mqtt import Mqtt
import json
from pyrebase import pyrebase
import datetime
import uuid

config = {
    "apiKey": "AIzaSyAt1m7mt1XAT_Ppe_skwsvheWp7m4sf25E",
    "authDomain": "hacs-9caa0.firebaseapp.com",
    "databaseURL": "https://hacs-9caa0.firebaseio.com",
    "storageBucket": "hacs-9caa0.appspot.com",
}
firebase2 = pyrebase.initialize_app(config)
db = firebase2.database()
firebase = firebase.FirebaseApplication('https://hacs-9caa0.firebaseio.com/')
result = firebase.get('/users',None)
print (result)


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
    date = datetime.datetime.now().strftime("%B%d%Y")
    time = datetime.datetime.now().strftime("%I:%M%p")
    data_to_firebase = {"date":date,"time":time,"values":data['payload']}
    #db.child("events").child(bstring[2]).push(data_to_firebase)

#date should be "Month ##, ####"
@app.route('/events-get-date/<string:date>',methods=['GET'])
def get_event_by_date(date):
    event_date = date
    event_by_date = db.child("users").order_by_child("name").equal_to(event_date).get()
    return jsonify(event_by_date)

@app.route('/<int:id>', methods=['GET'])
def get_example(id):
    ex = id
    return jsonify({'example': ex})

@app.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    wanteduser = firebase.get('/users/' + username,None)
    return jsonify({'user':wanteduser})

@app.route('/users/',methods=['GET'])
def get_users():
    users = firebase.get('/users/',None)
    return jsonify({'user':users})
if __name__ == '__main__':
    app.run(debug=True)

# When entering a user in the system make the url string have
# attributes be seperated by '-'.
# Order for post is userid-email-name-camera-control-phone-username

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
    return jsonify({'userId':user})


#string should be 'userid-attribute_name-attribute_data'
@app.route('/post-user-attribute/<string:attribute_json>')
def put_user_attribute(attribute_json):
    attributes = attribute_json.split('-')
    a = attributes[1]
    user = attributes[0]
    db.child("users").child(user).update({a:attributes[2]})
    return jsonify({'userid': user,'attribute name':attributes[1],'attribute':attributes[2]})

# String order should be deviceId-attributes-location-nickname-type
@app.route('/post-device/<string:device_json>')
def put_device(device_json):
    attrs = device_json.split('-')
    for x in range(0, 5-len(attrs)):
        attrs.append("null")
    deviceId = attrs[0]
    attributes = attrs[1]
    location = attrs[2]
    nickname = attrs[3]
    type_device = attrs[4]
    data = {"attributes":attributes,"location":location,"nickname":nickname,"type":type_device}
    db.child("devices").child(deviceId).set(data)
    return jsonify({'deviceId':deviceId})

@app.route('/delete-device/<string:device_name>')
def delete_device(device_name):
    device = device_name
    db.child("devices").child(device).remove()
    return jsonify(result)

@app.route('/delete-user/<string:user_name>')
def delete_user(user_name):
    user = user_name
    db.child("users").child(user).remove()
    return jsonify(result)
    


