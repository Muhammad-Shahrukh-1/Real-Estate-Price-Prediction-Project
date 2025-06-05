from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
real_estate_project = client["real_estate_project"]
contacts = real_estate_project["contacts"]


# Load model and data once
model = pickle.load(open('LinearRegression.pkl', 'rb'))
df_cleaned = pd.read_csv('Cleaned_Data.csv')
df_cleaned['Address_Code'] = df_cleaned['Address'].astype('category').cat.codes

@app.route('/areas', methods=['GET'])
def get_areas():
    unique_areas = df_cleaned['Address'].unique().tolist()
    return jsonify({"uniqueAreas": unique_areas})  # Wrap in a dictionary with the correct key


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    selected_area = data.get('selectedArea')
    property_type = data.get('propertyType')
    floor = int(data.get('floor', 0))
    bedrooms = int(data.get('bedrooms'))
    bathrooms = bedrooms
    area_sq = int(data.get('areaSqYards'))

    area_code = df_cleaned[df_cleaned['Address'] == selected_area]['Address_Code'].iloc[0]

    input_data = pd.DataFrame([[area_code, bedrooms, bathrooms, area_sq]],
                              columns=['Address_Code', 'NoOfBedrooms', 'NoOfBathrooms', 'AreaSqYards'])
    predicted_price = model.predict(input_data)[0]

    if property_type == "Flat":
        adjusted_price = predicted_price * (1 - 0.50 - ((floor - 1) * 0.03))
    else:
        adjusted_price = predicted_price

    adjusted_price += 20000000  # Add base offset

    # Recommendations
    user_input = pd.DataFrame([[selected_area, bedrooms, bathrooms, area_sq, adjusted_price]],
                              columns=['Address', 'NoOfBedrooms', 'NoOfBathrooms', 'AreaSqYards', 'Price'])

    similarity_df = pd.concat([df_cleaned, user_input], ignore_index=True)
    similarity_features = similarity_df[['NoOfBedrooms', 'NoOfBathrooms', 'AreaSqYards', 'Price']]
    cos_sim = cosine_similarity(similarity_features)
    similarity_scores = cos_sim[-1, :-1]
    most_similar_indices = similarity_scores.argsort()[-3:-1][::-1]
    recommended_properties = df_cleaned.iloc[most_similar_indices][['Address', 'Price']]

    recs = recommended_properties.to_dict(orient='records')

    return jsonify({
        'predictedPrice': predicted_price,
        'adjustedPrice': adjusted_price,
        'recommendations': recs
    })



@app.route('/post_contact_data', methods=['POST'])
def post_contact_data():
    data = request.get_json()

    # Basic validation
    if not all(k in data for k in ("name", "email", "message")):
        return jsonify({"error": "Missing fields"}), 400

    # Insert into MongoDB
    contact = {
        "name": data["name"],
        "email": data["email"],
        "message": data["message"]
    }
    contacts.insert_one(contact)
    return jsonify({"message": "Contact saved successfully"}), 201




# GET all messages
@app.route('/get_all_messages', methods=['GET'])
def get_all_messages():
    messages = list(contacts.find())
    
    # Convert ObjectId to string
    for msg in messages:
        msg['_id'] = str(msg['_id'])
    
    return jsonify(messages), 200


if __name__ == '__main__':
    app.run(debug=True)
