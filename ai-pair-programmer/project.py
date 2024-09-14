from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import simplejson as json

app = Flask(__name__)

@app.route('/clean', methods=['POST'])
def clean_data():
    try:
        # Read the CSV file from the request
        file = request.files['file']

        # Check if the file extension is csv
        if not file.filename.endswith('.csv'):
            return "Invalid file extension. Only .csv files are allowed.", 500

        df = pd.read_csv(file)

        # Remove columns with missing values in more than 50% of the rows
        threshold = len(df) * 0.5
        df = df.dropna(thresh=threshold, axis=1)

        # Normalize numerical columns between 0 and 1
        numerical_cols = df.select_dtypes(include=['float64', 'int64']).columns
        numerical_cols = numerical_cols.drop('Age', errors='ignore')
        df[numerical_cols] = (df[numerical_cols] - df[numerical_cols].min()) / (df[numerical_cols].max() - df[numerical_cols].min())

        # Convert string columns into integer enum values
        string_cols = df.select_dtypes(include=['object']).columns
        for col in string_cols:
            df[col] = pd.Categorical(df[col])
            df[col] = df[col].cat.codes

        # Return the cleaned data as JSON
        cleaned_data = df.to_dict(orient='records')
        response = json.dumps(cleaned_data, ignore_nan=True)
        print(response)
        return response, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(e)
        return str(e), 500

@app.route('/foo')
def index():
    print("hmm")
    return send_from_directory('', 'index.html')

if __name__ == '__main__':
    app.run()