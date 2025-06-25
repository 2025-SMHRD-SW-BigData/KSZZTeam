import React, { useRef, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import img from '../img/logo.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'

const img_upload = () => {
    return (
        <div>

            <input type="file" id="imageUpload" accept="image/*" />
            <div id="imagePreview"></div>
        </div>
    )
}

export default img_upload