import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/logo.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'

const Main = () => {
    const nav = useNavigate();

    return (
        <div>
            <Header></Header>

            <div className='parent'>
                <div className='fixed-box'>
                    test world
                </div>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default Main