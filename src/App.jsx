import './App.css'
import { Routes, Route } from "react-router";
import NavbarLayout from './pages/NavbarLayout';
import HomePage from './pages/HomePage/HomePage'
import DetailPage from './pages/DetailPage'

function App() {

    return (
        <Routes>
            <Route element={<NavbarLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="title/:slug" element={<DetailPage/>}/>
            </Route>
        </Routes>
    )
}

export default App
