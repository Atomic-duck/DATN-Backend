import keras
import os
import numpy as np
from util import *
from tensorflow.keras.models import load_model

class Model:
    #10: 91%, 20: 85%, 30: 80%, 40: 76%, 50: 71%, 60: 56%
    def __init__(self):
        inputs = keras.layers.Input(shape=(150, 34))
        lstm_out = keras.layers.LSTM(32)(inputs)
        outputs = keras.layers.Dense(25, activation='softmax')(lstm_out)
        
        self.model = keras.Model(inputs=inputs, outputs=outputs)
        
    def predict(self, future, data):
        path_checkpoint = "LSTM_"+str(future)+"min_150.weights.h5"
        if os.path.exists(path_checkpoint):
            self.model.load_weights(path_checkpoint)
            # self.model = load_model(path_checkpoint)
            y_pred = self.model.predict(data)
            time_range = np.arange(1, 25+1).reshape(25,1)
            vectorized_round = np.vectorize(custom_round)
            result = vectorized_round(y_pred@time_range)
            number_to_weather = {value: key for key, value in weather_mapping.items()}
            return number_to_weather.get(result[0,0], 'Unknown')
        else:
            return "out of range"