from flask import Flask, jsonify, request  # Added request to handle query parameters
from flask_cors import CORS  # Import CORS
from prophet import Prophet
import yfinance as yf
import pandas as pd
import datetime

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/forecast', methods=['GET'])
def get_forecast():
    # Get the currency pair from query parameters, default to "INR=X" if not specified
    currency_pair = request.args.get('pair', 'INR=X')
    
    # Set the date range for the last 30 days
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=30)

    # Fetch the last 30 days of data for the specified currency pair
    data = yf.download(currency_pair, start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d"))
    
    # Check if data is retrieved successfully
    if data.empty:
        return jsonify({"error": "Data not available for the selected currency pair"}), 404

    # Prepare the data for Prophet
    df = data.reset_index()[['Date', 'Close']]
    df['Date'] = df['Date'].dt.tz_localize(None)
    df.columns = ['ds', 'y']

    # Train the Prophet model
    model = Prophet()
    model.fit(df)

    # Forecast for the next 30 days
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    # Combine last 30 days actual data with next 30 days forecast
    result = {
        "historical": df.tail(30).to_dict(orient="records"),
        "forecast": forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30).to_dict(orient="records")
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
