import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/logo.jpg.png'
import '../style/Main.css'
import img1 from '../img/chat1.jpg'

const Footer = () => {
    const nav = useNavigate();
    return (

        <div id="div1">
            <footer id="footer">
                <span id="search" onClick={() => { nav('/cooker') }}>
                    요리사
                </span>
                
                <img id="chat" src={img1} onClick={() => { nav('/chat') }}></img>

                <span id="my" onClick={() => { nav('/my') }}>
                    고객센터
                </span>
            </footer>
        </div>

    )
}

export default Footer