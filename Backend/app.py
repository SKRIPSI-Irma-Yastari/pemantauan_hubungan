from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load model dan encoder
model = joblib.load('model_cart.pkl')
encoder = joblib.load('encoder.pkl')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Encode input
    input_data = [
        encoder['Nama KKKS'].transform([data['nama_kkks']])[0],
        encoder['Tahun'].transform([data['tahun']])[0],
        encoder['Bulan'].transform([data['bulan']])[0],
        encoder['Jenis Interaksi'].transform([data['jenis_interaksi']])[0],
        encoder['Detail Aktivitas'].transform([data['detail_aktivitas']])[0],
        encoder['Keterangan'].transform([data['keterangan']])[0]
    ]

    # Prediksi
    hasil = model.predict([input_data])[0]

    # Ubah ke label asli
    status = encoder['Label'].inverse_transform([hasil])[0]

    return jsonify({
        "status": status
    })


if __name__ == "__main__":
    app.run(debug=True)