#where the flask API is going to go

from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/<int:id>', methods=['GET'])
def get_example(id):
    ex = id
    return jsonify({'example': ex})

if __name__ == '__main__':
    app.run(debug=True)
