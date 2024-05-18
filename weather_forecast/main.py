from fastapi import FastAPI
import datetime
from util import *
from model import *
import time

app = FastAPI()
model = Model()

# @app.post("/weather_forecast")
# def forecast(req: dict):
#     lat = req["lat"]
#     lon = req["lon"]
#     future = req["future"]
    
#     now = datetime.datetime.now().replace(microsecond=0)
#     timestamp = datetime.datetime.timestamp(now)
#     residual = (timestamp - 1711817400) % 600
#     now_time = int(timestamp-residual)
#     data = collect_subhourly_weather(now_time-600*149, now_time, lat, lon)
#     data = preprocessing_data(data)
#     x_test = data.iloc[:][[i for i in range(34)]].values
#     x_test = np.asarray(x_test).astype('float32')
#     y_test = data.iloc[:,-25:].values
#     dataset_test = keras.preprocessing.timeseries_dataset_from_array(
#         x_test,
#         y_test,
#         sequence_length=150,
#         batch_size=256,
#     )
#     input = dataset_test.take(150)
#     result = model.predict(future, input)
#     return result

@app.post("/weather_forecast")
def forecast(req: dict):
    lat = float(req["lat"])
    lon = float(req["lon"])
    future = req["future"]
    
    location = pd.read_csv('location.csv')
    file_names = location['name'].tolist()
    min = -1
    for i, file_name in enumerate(file_names):
        file_path = 'weather_station/'+file_name+'.csv'
        file_lon, file_lat = location.iloc[i]['WKT'].split(' ')
        distance = haversine(lat,lon,float(file_lat),float(file_lon))
        if min == -1 or distance < min:
            min = distance
            df = pd.read_csv(file_path)
            column_name = 'forecast' + str(future) + 'min'
            result = df.loc[df.index[-1], column_name]
    return result

# result = forecast({"lat":10.843897, "lon":106.771024, "future":10})
# print(result) 
    