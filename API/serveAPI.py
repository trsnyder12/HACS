#where the flask API is going to go

from flask import Flask, jsonify
from firebase import firebase
from flask_mqtt import Mqtt

firebase = firebase.FirebaseApplication('https://hacs-9caa0.firebaseio.com/')
result = firebase.get('/users',None)
print (result)


app = Flask(__name__)
app.config['MQTT_BROKER_URL'] = '192.168.1.22'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_KEEPALIVE'] = 5
app.config['MQTT_TLS_ENABLED'] = False

mqtt = Mqtt(app)

fs = open("sensors.txt")
sensors = fs.read();
for i in sensors:
    mqtt.subscribe('/devices/'+i+'/events')

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    print(data)

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
    result = firebase.put('users/' + user,'name',name)
    result = firebase.put('users/' + user,'email',email)
    result = firebase.put('users/' + user + '/permissions','camera',camera)
    result = firebase.put('users/' + user + '/permissions','control',control)
    result = firebase.put('users/' + user,'phone',phone)
    result = firebase.put('users/' + user,'username',username)
    return jsonify({'userId':user})


#string should be 'userid-attribute_name-attribute_data'
@app.route('/post-user-attribute/<string:attribute_json>')
def put_user_attribute(attribute_json):
    attributes = attribute_json.split('-')
    a = attributes[1]
    user = attributes[0]
    if a == 'name':
        result = firebase.put('users/' + user,'name',attributes[2])
    elif a == 'email':
        result = firebase.put('users/' + user,'email',attributes[2])
    elif a == 'camera':
        result = firebase.put('users/' + user + '/permissions','camera',attributes[2])
    elif a == 'control':
        result = firebase.put('users/' + user + '/permissions','control',attributes[2])
    elif a == 'phone':
        result = firebase.put('users/' + user,'phone',attributes[2])
    elif a == 'username':
        result = firebase.put('users/' + user,'username',attributes[2])
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
    result = firebase.put('devices/' + deviceId,'attributes',attributes)
    result = firebase.put('devices/' + deviceId,'location',location)
    result = firebase.put('devices/' + deviceId,'nickname',nickname)
    result = firebase.put('devices/' + deviceId,'type',type_device)
    return jsonify({'deviceId':deviceId})



@app.route('/delete/<string:user_name>')
def delete_user(user_name):
    user = user_name
    result = firebase.delete('/users',user)
    return jsonify(result)
    


