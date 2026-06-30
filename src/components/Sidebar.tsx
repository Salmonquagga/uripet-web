import { useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import homeIcon from "../assets/dashboard.png";
import myPetsIcon from "../assets/mypets.png";
import addPetIcon from "../assets/addpet.png";
import vaccinationIcon from "../assets/vaccination.png";
import healthRecordIcon from "../assets/healthrecord.png";
import profileIcon from "../assets/myprofile.png";
import settingsIcon from "../assets/settings.png";
import helpIcon from "../assets/helpandsupport.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="bolt-sidebar">
      <div className="bolt-sidebar-logo">
        <img src={logo} alt="UriPet" className="bolt-sidebar-logo-img" />
      </div>

      <div className="bolt-sidebar-content">
        <nav className="bolt-sidebar-nav">
          <button className={isActive("/dashboard") ? "active" : ""} onClick={() => navigate("/dashboard")}>
            <img src={homeIcon} alt="" className="bolt-menu-icon" />
            Home
          </button>

          <button className={isActive("/pets") ? "active" : ""} onClick={() => navigate("/pets")}>
            <img src={myPetsIcon} alt="" className="bolt-menu-icon" />
            My Pets
          </button>

          <button className={isActive("/add-pet") ? "active" : ""} onClick={() => navigate("/add-pet")}>
            <img src={addPetIcon} alt="" className="bolt-menu-icon" />
            Add Pet
          </button>

          <button className={isActive("/vaccinations") ? "active" : ""} onClick={() => navigate("/vaccinations")}>
            <img src={vaccinationIcon} alt="" className="bolt-menu-icon" />
            Vaccinations
          </button>

          <button className={isActive("/medical-records") ? "active" : ""} onClick={() => navigate("/medical-records")}>
            <img src={healthRecordIcon} alt="" className="bolt-menu-icon" />
            Medical Records
          </button>
        </nav>

        <nav className="bolt-sidebar-nav bolt-sidebar-bottom-nav">
          <button className={isActive("/profile") ? "active" : ""} onClick={() => navigate("/profile")}>
            <img src={profileIcon} alt="" className="bolt-menu-icon" />
            My Profile
          </button>

          <button className={isActive("/settings") ? "active" : ""} onClick={() => navigate("/settings")}>
            <img src={settingsIcon} alt="" className="bolt-menu-icon" />
            Settings
          </button>

          <button className={isActive("/help") ? "active" : ""} onClick={() => navigate("/help")}>
            <img src={helpIcon} alt="" className="bolt-menu-icon" />
            Help & Support
          </button>
        </nav>
      </div>

      <div className="bolt-sidebar-footer">
        <button onClick={handleLogout} className="bolt-logout-button">
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;