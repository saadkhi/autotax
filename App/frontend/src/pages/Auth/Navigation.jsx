import './Navigation.css'
import {useState} from 'react'
import {AiOutlineSearch, AiOutlineHome, AiOutlineUser, AiOutlineLogout} from 'react-icons/ai'
import {FaHeart} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import "./Navigation.css"

const Navigation = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const closeSidebar = () => {
        setShowSidebar(false)
    }

  return (
    <div>Navigation</div>
  )
}

export default Navigation