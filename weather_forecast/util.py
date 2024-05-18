import time
import requests
import pandas as pd
import numpy as np
import math

api_key = ["527d83ac0d87e1a681735f2ac4eaa61b","1f48ec87e9fe8370f232d7d929634714","eaf42a19afce60865bf99f3cf567de30","74ce3ede536c0e05569536dc96c80770",
           "fb01c0ca7cfddb5cc8dec4c247f15898","d060b7b9e8d4f8d343b122b35b6f9176", "805dae770b71f4c4a108f68f9bd2f7c1", "d6d2db1b9c0c37828289229c40f0776e",
           "687347129e8f033502118d83fe7c059d", "b1d35ede750573ea6e07c0949b0efef5", "79db0d9700e6e86a73f012b3523b22b1", "12b3200ad49c67663dfbff1491fe9871", 
           "6fdcdc54718c683d4d752677ad8ac21f"]

weather_mapping = {
    'mist': 1,
    'smoke': 1,
    'haze': 1,
    'sand': 1,
    'dust whirls': 1,
    'fog': 1,
    'sand': 1,
    'dust': 1,
    'volcanic ash': 1,
    'squalls': 1,
    'tornado': 1,
    'clear sky': 1,
    'few clouds': 2,
    'scattered clouds': 3,
    'broken clouds': 4,
    'overcast clouds': 5,
    'light rain': 6,
    'moderate rain': 7,
    'heavy intensity rain': 8,
    'very heavy rain': 9,
    'extreme rain': 10,
    'freezing rain': 11,
    'light intensity shower rain': 12,
    'shower rain': 13,
    'heavy intensity shower rain': 14,
    'ragged shower rain': 15,
    'thunderstorm with light rain': 16,
    'thunderstorm with rain': 17,
    'thunderstorm with heavy rain': 18,
    'light thunderstorm': 19,
    'thunderstorm': 20,
    'heavy thunderstorm': 21,
    'ragged thunderstorm': 22,
    'thunderstorm with light drizzle': 23,
    'thunderstorm with drizzle': 24,
    'thunderstorm with heavy drizzle': 25
}

feature_keys = [
    "temp",
    "feels_like",
    "pressure",
    "humidity",
    "dew_point",
    "clouds",
    "visibility",
    "wind_speed",
    "wind_deg",
    "weather_val_1",
    "weather_val_2",
    "weather_val_3",
    "weather_val_4",
    "weather_val_5",

    "weather_val_6",
    "weather_val_7",
    "weather_val_8",
    "weather_val_9",
    "weather_val_10",

    "weather_val_11",
    "weather_val_12",
    "weather_val_13",
    "weather_val_14",
    "weather_val_15",

    "weather_val_16",
    "weather_val_17",
    "weather_val_18",
    "weather_val_19",
    "weather_val_20",

    "weather_val_21",
    "weather_val_22",
    "weather_val_23",
    "weather_val_24",
    "weather_val_25",
]

def haversine(lat1, lon1, lat2, lon2):
    # Chuyển đổi độ sang radian
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Sự khác biệt giữa các tọa độ
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Công thức Haversine
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Bán kính của Trái đất (trung bình): 6,371 km
    r = 6371

    # Khoảng cách
    distance = r * c

    return distance

def collect_subhourly_weather(time_start, time_end, lat, lon, key_idx = 0, limited = 0):
  if key_idx >= len(api_key):
    return []
  result = []
  for ut_time in range(int(time_start), int(time_end)+1, 10*60):
    url = f"https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={ut_time}&appid={api_key[key_idx]}"
    try:
      response = requests.api.get(url, timeout=5)
    except:
      print("Call API fail: "+str(api_key[key_idx]))
      limited += 1
      if limited == len(api_key):
        # print("reach limited")
        key_idx += 1
        return result+collect_subhourly_weather(ut_time, time_end, lat, lon, key_idx, 0)
      else:
        key_idx += 1
        return result+collect_subhourly_weather(ut_time, time_end, lat, lon, key_idx, limited)
    if response.status_code == 200:
      data = response.json()
      try:
        result.append({
          "lat": data["lat"],
          "lon": data["lon"],
          "dt": data["data"][0]["dt"],
          "sunrise": data["data"][0]["sunrise"],
          "sunset": data["data"][0]["sunset"],
          "temp": data["data"][0]['temp'],
          "feels_like": data["data"][0]['feels_like'],
          "pressure": data["data"][0]["pressure"],
          "humidity": data["data"][0]["humidity"],
          "dew_point": data["data"][0]["dew_point"],
          "clouds": data["data"][0]["clouds"],
          "visibility": data["data"][0]["visibility"],
          "wind_speed": data["data"][0]["wind_speed"],
          "wind_deg": data["data"][0]["wind_deg"],
          "weather": data["data"][0]["weather"][0]["main"],
          "weather_description": data["data"][0]["weather"][0]["description"]
          })
      except KeyError as e:
        if str(e) == "'visibility'":
          result.append({
            "lat": data["lat"],
            "lon": data["lon"],
            "dt": data["data"][0]["dt"],
            "sunrise": data["data"][0]["sunrise"],
            "sunset": data["data"][0]["sunset"],
            "temp": data["data"][0]['temp'],
            "feels_like": data["data"][0]['feels_like'],
            "pressure": data["data"][0]["pressure"],
            "humidity": data["data"][0]["humidity"],
            "dew_point": data["data"][0]["dew_point"],
            "clouds": data["data"][0]["clouds"],
            "visibility": -1,
            "wind_speed": data["data"][0]["wind_speed"],
            "wind_deg": data["data"][0]["wind_deg"],
            "weather": data["data"][0]["weather"][0]["main"],
            "weather_description": data["data"][0]["weather"][0]["description"]
            })
        else:
          print(data)
          with open("error.txt", "a") as file:
            file.write(str(ut_time)+"\n")
          continue
    elif response.status_code == 401:
      print("Error 401")
      limited += 1
      if limited == len(api_key):
        # print("reach limited")
        key_idx += 1
        return result+collect_subhourly_weather(ut_time, time_end, lat, lon, key_idx, 0)
      else:
        key_idx += 1
        return result+collect_subhourly_weather(ut_time, time_end, lat, lon, key_idx, limited)
    else:
      print(f'collect_subhourly_weather: {response.status_code}')
      limited += 1
      if limited == len(api_key):
        # print("reach limited")
        key_idx += 1
        return result+collect_subhourly_weather(ut_time, time_end, lat, lon, key_idx, 0)
      else:
        key_idx += 1
        return result+collect_subhourly_weather(ut_time, time_end, lat, lon, key_idx, limited)
  return result

def normalize(data):
    data_mean = np.array([3.00748523e+02, 3.03369424e+02, 1.00872830e+03, 7.94099397e+01,
    2.96510029e+02, 4.62983393e+01, 9.34626699e+03, 2.83783540e+00, 1.49014908e+02])
    data_std = np.array([2.46193051, 4.28402409,    2.36758146,   15.30452513,    2.68486666,
    20.74459888, 1283.15759273,    1.60271457,  111.67451187])
    normalized_data = (data[:, :-25] - data_mean) / data_std
    normalized_data = np.hstack((normalized_data, data[:,-25:]))
    return normalized_data

def preprocessing_data(data):
    df = pd.DataFrame(data)
    df['visibility'] = df['visibility'].replace(-1, pd.NA)
    fixed_df = df.apply(lambda x: x.bfill().ffill() if pd.isna(x[0]) else x.ffill(), axis=0)
    df.iloc[0] = fixed_df.iloc[0]
    df = df.ffill()
    df['weather_val'] = df['weather_description'].map(weather_mapping)
    df = pd.get_dummies(df, columns=['weather_val'])
    all_values = list(range(1, 25+1))
    for value in all_values:
        if 'weather_val_'+str(value) in df.columns:
            df['weather_val_'+str(value)] = np.where(df['weather_val_'+str(value)], 1, 0)
        if 'weather_val_'+str(value) not in df.columns:
            df['weather_val_'+str(value)] = 0
    selected_features = feature_keys
    features = df[selected_features]
    features.index = df['dt']
    features.head()
    normalize_df = pd.DataFrame(normalize(features.values))
    normalize_df.index = df['dt']
    normalize_df.columns = features.columns
    normalize_df.head()
    return normalize_df.loc[:]
  
def custom_round(value):
    if value - math.floor(value) >= 0.5:
        return math.ceil(value)
    else:
        return math.floor(value)