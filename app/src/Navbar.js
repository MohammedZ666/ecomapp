import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import useFetch from './useFetch'
import AppBar from '@material-ui/core/AppBar';

const Navbar = () => {
    const [user, setUser] = useState(null)
    const { data, error, isPending } = useFetch("/user")
    useEffect(() => {
        setUser(data)
    }, [data])
    return (
        <nav className="navbar">
            <h1>The Dojo Blog</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/create"> New Blog</Link>
                {user && <Link to="#"> {user.user} </Link>}
                {user && <a href="/logout">  Log out </a>}
                {!user && <Link to="/login">  Login </Link>}
            </div>
        </nav>
    );
}

export default Navbar;