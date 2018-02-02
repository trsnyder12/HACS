#where the flask API is going to go

from flask import Flask, jsonify
from firebase import firebase


firebase = firebase.FirebaseApplication('https://hacs-9caa0.firebaseio.com/')
result = firebase.get('/users',None)
print (result)

app = Flask(__name__)

@app.route('/<int:id>', methods=['GET'])
def get_example(id):
    ex = id
    return jsonify({'example': ex})

@app.route('/users', methods=['GET'])
def get_user(username):
    wantedUser = firebase.get('/users/' + username,None)
    return jsonify({'user':wantedUser})

@app.route('/users',methods=['PUT'])
def put_user_attribute(attributeName,attribute):
    response = firebase.put('/users/'+ attributeName,'value',attribute )
    print(response)
    return jsonify({'attribute':response})

if __name__ == '__main__':
    app.run(debug=True)
