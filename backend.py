from flask import Flask, jsonify, request
from flask_cors import CORS
from prophet import Prophet
import yfinance as yf
import pandas as pd
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/forecast', methods=['GET'])
def get_forecast():
    currency_pair = request.args.get('pair', 'INR=X')  # Default to INR=X if not provided
    forecast_days = request.args.get('days', default=30, type=int)  # Default forecast period
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=30)

    try:
        # Fetch historical data
        data = yf.download(currency_pair, start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d"))
        
        if data.empty:
            return jsonify({"error": "Data not available for the selected currency pair"}), 404

        # Prepare data for Prophet
        df = data.reset_index()[['Date', 'Close']]
        df['Date'] = df['Date'].dt.tz_localize(None)  # Remove timezone
        df.columns = ['ds', 'y']  # Prophet requires 'ds' and 'y' as column names

        # Train the Prophet model
        model = Prophet()
        model.fit(df)

        # Forecasting
        future = model.make_future_dataframe(periods=forecast_days)  # Use forecast_days from request
        forecast = model.predict(future)

        result = {
            "historical": df.tail(30).to_dict(orient="records"),  # Return last 30 days of historical data
            "forecast": forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(forecast_days).to_dict(orient="records")
        }
      
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle any exceptions

if __name__ == '__main__':
    app.run(debug=True)
