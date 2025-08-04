import keras
from keras import layers
from tensorflow import data as tf_data
import sys
import json

image_size = (180, 180)
batch_size = 128

def predict(image_path):
    loaded_model = keras.saving.load_model("model.keras")

    # Running inference
    img = keras.utils.load_img(image_path, target_size=image_size)

    img_array = keras.utils.img_to_array(img)
    img_array = keras.ops.expand_dims(img_array, 0)  # Create batch axis

    predictions = loaded_model.predict(img_array)
    score = float(keras.ops.sigmoid(predictions[0][0]))
    return score # "This image is {100 * (1 - score):.2f}% cat and {100 * score:.2f}% dog."


if __name__ == "__main__":
    image_path = sys.argv[1]
    result = predict(image_path)
    print(json.dumps(result))






