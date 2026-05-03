import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Routes, Route } from "react-router";
import NavbarLayout from './pages/NavbarLayout';
import HomePage from './pages/HomePage/HomePage'
import DetailPage from './pages/DetailPage'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,      // cache stays "fresh" forever
      gcTime: 1000 * 60 * 30,    // keep unused cache for 30 minutes
    }
  }
})

function App() {

    return (
        <QueryClientProvider client={queryClient}>
        <Routes>
            <Route element={<NavbarLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="title/:slug" element={<DetailPage/>}/>
            </Route>
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
