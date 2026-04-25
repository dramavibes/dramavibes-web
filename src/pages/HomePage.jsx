import { Link } from "react-router";
import {Input, Button, Surface } from "@heroui/react";
import { useState } from "react";
import {classicSearch} from '../services/api'
import { Search } from 'lucide-react';

import DramaGrid from "../components/DramaGrid"
import DramaCard from "../components/DramaCard"

function HomePage(){
    const [searchText, setSearchText] = useState("")
    const [result, setResult] = useState([])

    const handleSearch = async () => {
        const res = await classicSearch(searchText);
        setResult(res)
    }

    return (
        <div>
            <h1>Home Page</h1>
            <Link to="title/1234-life">When Life gives you tangerine</Link>
            <Surface className="flex gap-2 p-4" variant="secondary">
                <Input
                    aria-label="Search"
                    placeholder="Search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    className="w-full"
                />
                <Button onClick={handleSearch}>
                    <Search/>
                    Search
                </Button>
            </Surface>
            <p>{searchText}</p>
            <div className="p-4 border border-black">
                <DramaGrid>
                    {result?.results?.map(drama => <DramaCard key={drama.slug} drama={drama} />)}
                </DramaGrid>
            </div>
            {/* <p>{JSON.stringify(result, null, 2)}</p> */}
        </div>
    )
}

export default HomePage;