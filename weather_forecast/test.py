import tensorflow as tf
import os
from pathlib import Path
import keras

inputs = keras.layers.Input(shape=(200, 34))
lstm_out = keras.layers.LSTM(32)(inputs)
outputs = keras.layers.Dense(25, activation='softmax')(lstm_out)

model = keras.Model(inputs=inputs, outputs=outputs)
path_checkpoint = 'LSTM_10min.weights.h5'
model.load_weights(path_checkpoint)