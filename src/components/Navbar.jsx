import { Button } from '@heroui/react'
import {useNavigate} from 'react-router'
import {Moon, Sun} from 'lucide-react'
import {useTheme} from '../hooks/useTheme'

export default function Navbar(){
    const navigate = useNavigate()
    const { isDark, toggle } = useTheme();
    const IconComponent = isDark? Sun : Moon

    return (
        <nav className="
            bg-background flex justify-around items-center
            pt-5 pb-3 px-5 h-[68px]
        ">
            <h1 
                onClick={()=>navigate("/")} 
                className="
                text-2xl font-semibold text-foreground grow
                ml-5
                "
            >
                DramaVibes
            </h1>
            <Button 
                isIconOnly 
                onClick={toggle}
                variant='tertiary'
            >
                <IconComponent className="text-muted" fill='currentColor'/>
            </Button>
        </nav>
    )
}