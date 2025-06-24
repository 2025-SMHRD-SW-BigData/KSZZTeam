import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/sing_logo2.jpg.png'
import '../style/Main.css'

const Header = () => {
    const nav = useNavigate();
    return (
        <div id="div1">
            <header id="header">
                <span id="main" onClick={() => { nav('/') }}>
                    <img src={img}></img>
                </span>
                <span id="logo">
                    
                </span>
                <br />
                <br />
                <span id="main_main" onClick={() => { nav('/') }}>
                    메인
                </span>
                <span id="main_sizang" onClick={() => { nav('/sizang') }}>
                    시장정보
                </span>
                <span id="main_infor" onClick={() => { nav('/infor') }}>
                    위치정보
                </span>
                <span id="main_sns" onClick={() => { nav('/sns') }}>
                    SNS
                </span>
                <span id="main_ask" onClick={() => { nav('/ask') }}>
                    알려줘!
                </span>
            </header>
        </div>
    )
}

export default Header