import React, { useState, useEffect, useRef} from 'react';

export function TempMessage() {

  const thinkingPhrases = ["ahh.........", "let me think.........", "uhh.........", "i think.........", "hang on.........", "so........."]
    
  const [currentResponse, setCurrentResponse] =  useState(" ");
  const remainingResponse = useRef("");
  const typingDelay = useRef(150);

    
     useEffect(() => {
        remainingResponse.current = thinkingPhrases[Math.floor(Math.random()*(thinkingPhrases.length))];
        setCurrentResponse("");

    }, [])

    useEffect(() => {
        if (remainingResponse.current.length === 0) return;

        const timer = setTimeout(() => {
            const nextChar = remainingResponse.current.substring(0, 1);
            remainingResponse.current = remainingResponse.current.substring(1);

            setCurrentResponse(currentResponse + nextChar)
        }, typingDelay.current)

        return () => clearTimeout(timer);
    }, [currentResponse])

    
    return <div className="me-message">{currentResponse}</div>
    
}