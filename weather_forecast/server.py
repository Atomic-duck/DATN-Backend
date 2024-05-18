import pandas as pd
import datetime
from util import *
from model import *
import os
from model import *
import time

model = Model()

def forecast(data, future):
  x_test = data.iloc[:][feature_keys].values
  x_test = np.asarray(x_test).astype('float32')
  y_test = data.iloc[:,-25:].values
  dataset_test = keras.preprocessing.timeseries_dataset_from_array(
      x_test,
      y_test,
      sequence_length=150,
      batch_size=256,
  )
  input = dataset_test.take(150)
  result = model.predict(future, input)
  return result

while(True):
    location = pd.read_csv('location.csv')
    file_names = location['name'].tolist()
    for i, file_name in enumerate(file_names):
        file_path = 'weather_station/'+file_name+'.csv'
        lon, lat = location.iloc[i]['WKT'].split(' ')
        now = datetime.datetime.now().replace(microsecond=0)
        timestamp = datetime.datetime.timestamp(now)
        residual = (timestamp - 1711817400) % 600
        now_time = int(timestamp-residual)
        if not os.path.exists(file_path):
            start = now_time-600*149
            # start = now_time-600*1
            end = now_time
            data = collect_subhourly_weather(start, end, lat, lon)
            data = preprocessing_data(data)
            df = data.iloc[:][feature_keys]
            for j in range(1,7):
                result = forecast(data,j*10)
                column_name = 'forecast' + str(j*10) + 'min'
                df[column_name] = ''
                df.loc[df.index[-1], column_name] = result
            df.to_csv(file_path, index=True)
        else:
            delete_threshold = now_time-600*149
            df = pd.read_csv(file_path)
            df = df[df['dt'] >= delete_threshold]
            need = 149 - df.shape[0]
            if need >= 0:
                start = now_time-600*need
                end = now_time
                data = collect_subhourly_weather(start, end, lat, lon)
                data = preprocessing_data(data)
                new_df = data.iloc[:][feature_keys]
                new_df = new_df.reset_index()
                for j in range(1,7):
                    column_name = 'forecast' + str(j*10) + 'min'
                    new_df[column_name] = ''
                df = pd.concat([df, new_df], ignore_index=True)
                df = df.set_index('dt')
                for j in range(1,7):
                    result = forecast(df.iloc[:][feature_keys],j*10)
                    column_name = 'forecast' + str(j*10) + 'min'
                    df.loc[df.index[-1], column_name] = result
                df.to_csv(file_path, index=True)
    now = datetime.datetime.now().replace(microsecond=0)
    timestamp = datetime.datetime.timestamp(now)
    residual = (timestamp - 1711817400) % 600
    if residual > 60:
        time.sleep(60)
        