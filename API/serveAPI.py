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

fs = open("sensor.txt")
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

@app.route('/users/<string:userId>/<string:username>',methods=['POST'])
def create_user(userId,username):
    response = firebase.post('/users/'+ userId,'value',username )
    print(response)
    return jsonify({'attribute':response})





if __name__ == '__main__':
    app.run(debug=True)
