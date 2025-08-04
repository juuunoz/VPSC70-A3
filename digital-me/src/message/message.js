import React, { useState, useEffect, useRef} from 'react';

export function Message({phrase, isUser, onFinish}) {
    
  const [currentResponse, setCurrentResponse] =  useState(" ");
  const remainingResponse = useRef("");
  const typingDelay = useRef(100);

    useEffect(() => {
        if (!phrase) return;

        // user types faster
        if (isUser) {
            typingDelay.current = 50
        } else {
            typingDelay.current = 150
        }

        remainingResponse.current = phrase;
        setCurrentResponse("");
    }, [phrase]);

    useEffect(() => {
        if (remainingResponse.current.length === 0) {
            const timer = setTimeout(() => {
                 onFinish()
                return
            }, 1000)

            return () => clearTimeout(timer)
           
        }

        const timer = setTimeout(() => {
            const nextChar = remainingResponse.current.substring(0, 1);
            remainingResponse.current = remainingResponse.current.substring(1);

            setCurrentResponse(currentResponse + nextChar)
        }, typingDelay.current)

        return () => clearTimeout(timer);
    }, [currentResponse])

    
    return isUser ? <div className="user-message">{currentResponse}</div> : <div className="me-message">{currentResponse}</div>
    
}