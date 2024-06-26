import React, { useState } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink } from 'react-router-dom';


const activeLink = ({isActive}) => (isActive ? "active" : "link")

const activeSublink = ({isActive}) => (isActive ? "active" : "link")


const SidebarItem = ({item, open}) => { 

  const [expand, setExpand] = useState(false);

  //If sidebar item has submenu (children)
  if (item.childrens) {
    return (
      <div className={expand ? 'sidebar-item sidebar-parent open' : 'sidebar-item sidebar-parent'}>
        <div className='sidebar-title'>
          <span>
            {item.icon && <div className='icon'>{item.icon}</div>}
            {open && <div>{item.title}</div>}
          </span>
          <MdKeyboardArrowRight size={30} className='arrow-icon' onClick={() => setExpand(!expand)}/>
        </div>
        <div className='sidebar-content'>
          {item.childrens.map((child, index) => {
            return (
              <div key={index} className='sidebar-child'>
                <NavLink to={child.path} className={activeSublink}>
                  <div className='sidebar-item'>
                    <div className='sidebar-title'>
                      {child.icon && <div className='icon'>{child.icon}</div>}
                      {open && <div>{child.title}</div>}
                    </div>
                  </div>
                </NavLink>
              </div>
            )
          })}
        </div>
      </div>
    )

    //If sidebar doesn't have sub menu
  } else{
    return (
      <NavLink to={item.path} className={activeLink}>
        <div className='sidebar-item sidebar-parent'>
          <div className='sidebar-title'>
            <span>
              {item.icon && <div className='icon'>{item.icon}</div>}
              {open && <div>{item.title}</div>}
            </span>
          </div>
        </div>
      </NavLink>    )
  }
  
}

export default SidebarItem