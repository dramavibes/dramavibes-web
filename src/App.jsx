import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router";
import {Button} from '@heroui/react'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import { useTheme } from './hooks/useTheme';

function App() {
    const { isDark, toggle } = useTheme();

    return (
        <>
        <Button onClick={toggle}>{isDark?"Light":"Dark"}</Button>
        <Routes>
            <Route index element={<HomePage/>}/>
            <Route path="title/:slug" element={<DetailPage/>}/>
        </Routes>
        </>
    )
}

export default App
