import sys
import json
from keras.models import load_model
from keras.utils import load_img, img_to_array
import keras
import os

model = load_model("your_model.h5")  # Ensure this is in the same folder
image_size = (180, 180)

def predict(image_path):
    img = load_img(image_path, target_size=image_size)
    img_array = img_to_array(img)
    img_array = keras.ops.expand_dims(img_array, 0)
    predictions = model.predict(img_array)
    score = float(keras.ops.sigmoid(predictions[0][0]))
    return {
        "cat": f"{100 * (1 - score):.2f}%",
        "dog": f"{100 * score:.2f}%"
    }

if __name__ == "__main__":
    image_path = sys.argv[1]
    result = predict(image_path)
    print(json.dumps(result))
