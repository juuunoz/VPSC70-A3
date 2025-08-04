import React, { useState } from 'react';
import { Message } from './message/message';
import { TempMessage } from './TempMessage/TempMessage';
import './App.css';

function App() {
  const SERVER_ADDRESS = 'http://localhost:3001';
  const [messages, setMessages] = useState([]);

  const [isLoading, setLoading] = useState(false)

  const [eraseDisplayEntry, setEraseDisplayEmpty] = useState(false)

  const one = ["no, i don't think it's really that interesting", "that's kinda lame actually", "i think you can do better than that", "ok... you do you man"];
  const two = ["not interesting", "what is this?", "i don't get it", "different strokes for different folks i guess"];
  const three = ["meh", "i feel indifferent to this", "ok", "it's not for me but i understand why you would like it"];
  const four = ["that's alright", "cool", "that's neat", "sorry wait, i'm kinda busy rn but keep sending me messages i'll read them"];
  const five = ["i like this", "this is pretty neat", "interesting"];
  const six = ["that's so cool", "really really interesting", "i love it", "amazing!", ":)"];

  const weird = ["i don't understand", "i can't read what you just sent me, sorry", "can you send me images instead?", "i can't see that", "can you send it in a picture instead"]

  /*
  function sendMessage(message) {
      const response = fetch(`${SERVER_ADDRESS}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      }).then((res) => {
        const data = res.json()
        const newMeMessage = {
          id: crypto.randomUUID(),
          text: data,
          isUser: false
        }
        setMessages(prev => [...prev, newMeMessage]);
      }).error((err) => {
        console.log("error calling chatbot: ", error)
      });
  }
      */
     

  function saySomething(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const input = data.get("questionInput");

    if (input.trim()) {
      const newMessage = {
        id: crypto.randomUUID(),
        text: input,
        isUser: true,
        onFinish: newMeMessage,
      };

      setMessages(prev => [...prev, newMessage]);
      e.target.reset(); // clear input field

      setEraseDisplayEmpty(true);
      const timer = setTimeout(() => {
        setLoading(true)
      }, 250)


      clearTimeout(timer)
      
    }
  }

  function withLoading(promise) {
    setLoading(true);
    setEraseDisplayEmpty(true);
    return promise.finally(() => {
      setLoading(false);
      setEraseDisplayEmpty(false);
    });
}

  function newMeMessage() {
    const predictionMessage = {
      id: crypto.randomUUID(),
      text: weird[Math.floor(Math.random()*(weird.length))],
      isUser: false,
      onFinish: () => {}
      };

    setLoading(false)
    setEraseDisplayEmpty(false)
    setMessages((prev) => [...prev, predictionMessage]);
    
  }

  function submitImage(e) {
    e.preventDefault();

    const form = e.target;
    const fileInput = form.imageInput;
    const file = fileInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const responsePromise = withLoading(fetch(`${SERVER_ADDRESS}/predict`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json()))

    responsePromise
    .then((res) => {
      // res is a percentage from 0 to 1
      const rounded = parseFloat((0.5552665591239929).toFixed(2))
      console.log(rounded)

      let phrase = ""
      
      switch (rounded) {
        case 0.51:
          phrase = one[Math.floor(Math.random()*(one.length))]
          break;
        case 0.52:
          phrase = two[Math.floor(Math.random()*(two.length))]
          break;
        case 0.53:
          phrase = three[Math.floor(Math.random()*(three.length))]
          break;
        case 0.54:
          phrase = four[Math.floor(Math.random()*(four.length))]
          break;
        case 0.55:
          phrase = five[Math.floor(Math.random()*(five.length))]
          break;
        case 0.56:
          phrase = six[Math.floor(Math.random()*(six.length))]
          break;
        default:
          phrase = "i'm at a loss for words..."
      }
          
      const predictionMessage = {
      id: crypto.randomUUID(),
      text: phrase,
      isUser: false,
      onFinish: () => {}
      };

      setMessages((prev) => [...prev, predictionMessage]);
      form.reset();
    })
    .catch((err) => {
      console.log(err)
      const predictionMessage = {
        id: crypto.randomUUID(),
        text: "I don't know...",
        isUser: false,
        onFinish: () => {}
      };

        setMessages((prev) => [...prev, predictionMessage]);
        form.reset();
      }
    )
      
  }


  
  return (
    <div className="App">
      <div className="wrapper">
        <div id="responseBox" className="response-box">
          {
            messages.map(msg => (
              <Message 
                key={msg.id} 
                phrase={msg.text} 
                isUser={msg.isUser}
                onFinish={msg.onFinish}/>
              ))
          } 
          {isLoading ? <TempMessage key={-1} /> : <div></div>}
          
        </div>

        {eraseDisplayEntry ? <div></div> :
        <div className="ask-question">
          <form onSubmit={saySomething}>{
            <input 
              className="ask-question-input" 
              type="text"
              name="questionInput"
              placeholder="Type something..."
            />}
            <button type="submit">Enter</button>    
          </form>
        </div>
        }
        {eraseDisplayEntry ? <div></div>:
        <div className="submitimage">
          <form onSubmit={submitImage}>
            <input
              className="ask-question-image"
              type="file"
              name="imageInput"
              placeholder="Submit an image..."
            />
            <button type="submit">Enter</button>  
          </form>
        </div>
        }
      </div>
    </div>
  );
}

export default App;
