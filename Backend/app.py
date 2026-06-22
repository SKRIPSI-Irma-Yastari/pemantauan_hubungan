from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load model dan encoder
model = joblib.load('model_cart.pkl')
encoder = joblib.load('encoder.pkl')


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


def safe_transform(encoder_col, val):
    if val is None:
        return 0
    if len(encoder_col.classes_) > 0:
        cls_type = type(encoder_col.classes_[0])
        try:
            # Handle numpy integer or float conversions
            if 'int' in cls_type.__name__ or 'float' in cls_type.__name__:
                val = int(float(val))
            else:
                val = cls_type(val)
        except Exception:
            pass

    if val in encoder_col.classes_:
        return encoder_col.transform([val])[0]
    else:
        # Fallback to the first class
        return 0


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json or {}

    try:
        # Encode input safely
        input_data = [
            safe_transform(encoder['Nama KKKS'], data.get('nama_kkks')),
            safe_transform(encoder['Tahun'], data.get('tahun')),
            safe_transform(encoder['Bulan'], data.get('bulan')),
            safe_transform(encoder['Jenis Interaksi'], data.get('jenis_interaksi')),
            safe_transform(encoder['Detail Aktivitas'], data.get('detail_aktivitas')),
            safe_transform(encoder['Keterangan'], data.get('keterangan'))
        ]

        # Prediksi
        hasil = model.predict([input_data])[0]

        # Ubah ke label asli
        status = encoder['Label'].inverse_transform([hasil])[0]

        return jsonify({
            "status": status
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)