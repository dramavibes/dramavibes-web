import { Button } from '@heroui/react'
import {useNavigate, Link} from 'react-router'
import {Moon, Sun} from 'lucide-react'
import { FaGithub } from "react-icons/fa";
import {useTheme} from '../hooks/useTheme'

export default function Navbar(){
    const navigate = useNavigate()
    const { isDark, toggle } = useTheme();
    const IconComponent = isDark? Sun : Moon

    return (
        <nav className="
            bg-background flex justify-around items-center
            pt-5 pb-3 pr-4 sm:px-5 h-[68px]
        ">  
            <h1 
                // onClick={()=>navigate("/")} 
                className="
                text-2xl font-semibold text-foreground grow
                ml-5
                "
            >
                <Link to="/">      
                DramaVibes
                </Link>
            </h1>
            <div
                className="
                mr-1.5  
                w-8 h-8 rounded-full box-border
                flex justify-center items-center
                text-surface-secondary hover:text-surface-secondary/90
                bg-muted
                transition-transform active:scale-98
                cursor-pointer
                
                "
            >
                <Link 
                    to="https://github.com/dramavibes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex justify-center items-center rounded-full '
                >
                <FaGithub size={33.5}/>
                </Link>
            </div>

            <Button 
                isIconOnly 
                onClick={toggle}
                variant='tertiary'
                size='sm'
                // className="box-border border border-muted"
            >
                <IconComponent className="text-muted" fill='currentColor'/>
            </Button>
        </nav>
    )
}