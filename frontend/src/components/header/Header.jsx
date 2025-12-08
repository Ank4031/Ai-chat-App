import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logout from "../LogoutBtn.jsx";

function Header(){
  const authrization = useSelector((state)=>state.auth.status)
  const navList = [
    {
      name:"Login",
      slug:"/login",
      active: !authrization
    },
    {
      name:"Register",
      slug:"/register",
      active: !authrization
    },
    {
      name:"Chats",
      slug:"/chat",
      active: authrization
    },
  ]
  return(
      <>
        <div className="w-full flex justify-end bg-blue-300">
          <nav className="w-1/2 flex justify-evenly">
              {navList.map((item)=>
              item.active ? 
              (
                <NavLink key={item.name} to={item.slug} className={({isActive})=>(
                  isActive
                  ? "text-white font-bold underline"
                  : "text-black"
                )}>
                  {item.name}
                </NavLink>
              )
              : null
              )}
              {authrization && <Logout/>}
          </nav>
        </div>
      </>
  )
}

export default Header
