import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Search from './code/Search'
import My from './code/My'
import Main from './code/Main'
import Main_Sns from './code/Main_Sns'
import Main_Sizang from './code/Main_Sizang'
import Main_Infor from './code/Main_Infor'
import Main_Infor1 from './code/Main_Infor1'
import Main_Ask from './code/Main_ask'
import Chat from './code/Chat'
import Member from './code/Member'
import PassChange from './code/PassChange'
import PassChanges from './code/PassChanges'
import Cooker from './code/Cooker'

const App = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Main />}></Route>
                <Route path='/sns' element={<Main_Sns />}></Route>
                <Route path='/search' element={<Search />}></Route>
                <Route path='/my' element={<My />}></Route>
                <Route path='/sizang' element={<Main_Sizang />}></Route>
                <Route path='/infor' element={<Main_Infor />}></Route>
                <Route path='/infor1' element={<Main_Infor1 />}></Route>
                <Route path='/ask' element={<Main_Ask />}></Route>
                <Route path='/chat' element={<Chat />} />
                <Route path='/member' element={<Member/>}></Route>
                <Route path='/passchange' element={<PassChange/>}></Route>
                <Route path='/passchanges' element={<PassChanges/>}></Route>
                <Route path='/cooker' element={<Cooker/>}></Route>

            </Routes>
        </div>
    )
}

export default App
