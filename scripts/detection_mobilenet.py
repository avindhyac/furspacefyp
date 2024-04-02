import numpy as np
import pandas as pd
import tensorflow as tf
# import tensorflowjs as tfjs
from keras.applications.mobilenet import MobileNet, preprocess_input
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dropout, Dense,BatchNormalization, Flatten, MaxPool2D
from tensorflow.keras.regularizers import L1, L2
from keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, Callback
from keras.layers import Conv2D, Reshape
from tensorflow.keras.utils import Sequence
from keras.backend import epsilon
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from tensorflow.keras.layers import GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import cv2

from tqdm.notebook import tqdm_notebook as tqdm

import os

angry= 'C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/dataset-edited/angry/'
sad = 'C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/dataset-edited/sad/'
relaxed = 'C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/dataset-edited/relaxed/'
happy = 'C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/dataset-edited/happy/'


angry_path = os.listdir(angry)
sad_path = os.listdir(sad)
relaxed_path = os.listdir(relaxed)
happy_path = os.listdir(happy)

def load_img(path):
    image = cv2.imread(path)
    image = cv2.resize(image,(224, 224))
    return image[...,::-1]

dataset_path = "C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/dataset-edited"

data_with_aug = ImageDataGenerator(horizontal_flip=True,
                                   vertical_flip=False,
                                   rotation_range=20,
                                #    width_shift_range=0.2,
                                #    height_shift_range=0.2,
                                   shear_range=0.2,
                                #    zoom_range=0.2,
                                   rescale=1./255,
                                  validation_split=0.2)

train = data_with_aug.flow_from_directory(dataset_path,
                                          class_mode="categorical",
                                          target_size=(224, 224),
                                          batch_size=32,
                                          subset="training")

val = data_with_aug.flow_from_directory(dataset_path,
                                          class_mode="categorical",
                                          target_size=(224, 224),
                                          batch_size=32,
                                          subset="validation"
                                          )

mnet = MobileNetV2(include_top = False, weights = "imagenet" ,input_shape=(224,224,3))

tf.keras.backend.clear_session()

model = Sequential([mnet, # initializes a sequential model, which is a linear stack of layers. This is while using MobileNet as the base layer.
                    GlobalAveragePooling2D(), # This layer performs global average pooling on the spatial dimensions of the input. It reduces each spatial dimension (height and width) to a single value by taking the average of all values in that dimension.
                    Dense(512, activation = "relu"), # This adds a fully connected layer with 512 units and ReLU activation function.
                    BatchNormalization(), # This layer normalizes the activations of the previous layer, which helps in stabilizing and speeding up the training process.
                    Dropout(0.3), # To prevent overfitting - layer applies dropout regularization with a dropout rate of 0.3, which randomly sets a fraction of input units to zero.
                    Dense(128, activation = "relu"), # Adds another fully connected layer with 128 units and ReLU activation function.
                    Dropout(0.15), # To prevent overfitting - Another dropout layer with a dropout rate of 0.1.
                    # Dense(32, activation = "relu"),
                    # Dropout(0.3),
                    Dense(4, activation = "sigmoid")]) # This is the output layer with 4 units and sigmoid activation function. Sigmoid is used to predict between the multiple classes/emotions enabling the independent prediction of each class

model.layers[0].trainable = False # freezing the first layer (the transfer learning model)

train_num_classes = train.num_classes
print("Number of train classes:", train_num_classes)

val_num_classes = val.num_classes
print("Number of val classes:", val_num_classes)

model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])


model.summary()
Model: "sequential"

def scheduler(epoch):
    if epoch <= 2:
        return 0.001                # For the first two epochs (epoch <= 2), the learning rate is set to 0.001.
    elif epoch > 2 and epoch <= 15: 
        return 0.0001               # For epochs 3 to 15 (epoch > 2 and epoch <= 15), the learning rate is set to 0.0001.
    else:
        return 0.00001              # For epochs beyond 15, the learning rate is set to 0.00001.

# This scheduler function gradually reduces the learning rate during training, starting with a higher learning rate (0.001), 
# then decreasing it (0.0001) for a certain range of epochs, 
# and finally setting it to an even lower value (0.00001) for the remaining epochs.

lr_callbacks = tf.keras.callbacks.LearningRateScheduler(scheduler)
early_stopping = EarlyStopping(monitor="val_accuracy", patience=10)

hist = model.fit(train,
                    epochs=21,
                    callbacks=[lr_callbacks, early_stopping],
                    validation_data=val)

# Save the model
# model.save('C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/furspacefyp/model-mobilenet2.keras')
model.save('C:/Users/Avindhya Cabral/Documents/Work/Uni/UCLAN/Y3 - Sem 1/FYP/furspacefyp/model.h5')
# tfjs.converters.save_keras_model(model, 'model_converted_MobileNet.js')
print('Model saved')