/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { LogOut, LinkIcon } from "lucide-react"
import { UrlState } from "@/context"
import useFetch from "@/hooks/useFetch"
import { logout } from "@/db/apiAuth"
import { BarLoader } from "react-spinners"


const Header = () => {

    const navigate = useNavigate();

    const { user, fetchUser } = UrlState();

    const { loading, fn: fnLogout } = useFetch(logout);

    return (
        <>
            <nav className="py-4 flex justify-between items-center">

                <Link to='/'>
                    <img src="/icon.jpg" alt="trimmy-logo" className="h-16" />
                </Link>


                <div>
                    {!user ?
                        <Button onClick={() => navigate("/auth")}>Login</Button>
                        :
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
                                    <AvatarFallback>{user?.user_metadata?.name}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link className="flex" to="/dashboard">
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        <span>
                                            My Links
                                        </span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span onClick={() => {
                                        fnLogout().then(() => {
                                            fetchUser();
                                            navigate("/");
                                        });
                                    }}>
                                        Logout
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    }
                </div>


            </nav>
            {loading && <BarLoader className="mb-2" width={"100%"} color="#36d7b7" />}
        </>
    )
}

export default Header