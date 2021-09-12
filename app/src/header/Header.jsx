import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import useFetch from '../useFetch'
import { ReactComponent as CloseMenu } from "../assets/x.svg";
import { ReactComponent as MenuIcon } from "../assets/menu.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";
import "./header.css";



const Header = ({ cartLength }) => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [user, setUser] = useState(null)
    const { data, error, isPending } = useFetch("/user")
    useEffect(() => {
        setUser(data)

    }, [data])
    useEffect(() => {
        console.log(cartLength)
    }, [cartLength])
    return (
        <div className="header ">

            <div className="logo-nav">
                <div className="logo-container">
                    <a href="#">
                        <Logo className="logo" />
                    </a>
                </div>
                <h1 >Ecom</h1>
            </div>
            <ul className={click ? "nav-options active" : "nav-options"}>
                <li className="option" onClick={closeMobileMenu}>
                    <Link to="/">Home</Link>
                </li>
                <li className="option" onClick={closeMobileMenu}>
                    <Link to="/create"> Add Product</Link>
                </li>
                {user && <li className="option" onClick={closeMobileMenu}>
                    <Link to="/update-user"> {"Welcome, " + user.username + "!"} </Link>
                </li>}
                {user && <li className="option" onClick={closeMobileMenu}>
                    <a href="/logout">  Log out </a>
                </li>}
                {!user && <li className="option" onClick={closeMobileMenu}>
                    <Link to="/login">  Login </Link>
                </li>}

                <li className="option mobile-option sign-up" onClick={closeMobileMenu}>
                    <Link style={{ color: "white" }} to="/signup" >
                        Signup
                    </Link>
                </li>
            </ul>


            <ul className="signin-up">
                {!user && <li className="option mobile-option" onClick={closeMobileMenu}>
                    <Link to="/login">  Login </Link>
                </li>}
                <li>
                    <Link to="/signup" className="signup-btn">
                        Signup
                    </Link>
                </li>
            </ul>
            <div className="mobile-menu" onClick={handleClick}>
                {click ? (
                    <CloseMenu className="menu-icon" />
                ) : (
                    <MenuIcon className="menu-icon" />
                )}
            </div>

        </div>

    );
};

export default Header;
