import React, { useEffect } from 'react'

const Chat = () => {
  useEffect(() => {
    window.open('http://localhost:3000/', '_blank');
    window.location.href = '/';
  }, []);
  return (
    <div></div>
  )
}

export default Chat