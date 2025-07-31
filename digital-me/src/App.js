import React, { useState } from 'react';
import { Message } from './message/message';
import './App.css';

function App() {
  const SERVER_ADDRESS = 'http://localhost:80';
  const [messages, setMessages] = useState([]);

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
        isUser: true
      };

      setMessages(prev => [...prev, newMessage]);
      e.target.reset(); // clear input field
    }
  }

  async function submitImage(e) {
  e.preventDefault();

  const form = e.target;
  const fileInput = form.imageInput;
  const file = fileInput.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${SERVER_ADDRESS}/ping`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to get prediction");

    const data = await response.json();
    const predictionMessage = {
      id: crypto.randomUUID(),
      text: data.result,
      isUser: false,
    };

    setMessages((prev) => [...prev, predictionMessage]);
    form.reset();
  } catch (error) {
    const predictionMessage = {
      id: crypto.randomUUID(),
      text: "I don't know...",
      isUser: false,
    };

    setMessages((prev) => [...prev, predictionMessage]);
    form.reset();
  }
}


  return (
    <div className="App">
      <div className="wrapper">
        <div id="responseBox" className="response-box">
          {messages.map(msg => (
            <Message 
              key={msg.id} 
              phrase={msg.text} 
              isUser={msg.isUser}/>
          ))}
        </div>

        <div className="ask-question">
          <form onSubmit={saySomething}>
            <input 
              className="ask-question-input" 
              type="text"
              name="questionInput"
              placeholder="Type something..."
            />
            <button type="submit">Enter</button>
          </form>
        </div>
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
      </div>
    </div>
  );
}

export default App;
