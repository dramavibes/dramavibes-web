import { Button } from "@heroui/react";
import { useNavigate } from "react-router";

export default function NotFound(){
    const navigate = useNavigate()
    return (
        <div className="flex flex-col flex-1 justify-center items-center">

            <h1 className="text-4xl">404 Not Found!</h1>
            <h2 className="mt-5 text-xl">You seem to be lost</h2>
            <Button className="mt-4" onPress={() => navigate(-1)}>
                Go back
            </Button>

        </div>
    )
}