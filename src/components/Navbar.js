/*
 * Author: Nachiket Panchal
 */
import { Route } from "react-router-dom";

function Navbar() {
    function toggleSidebar() {
        var sideBar = document.getElementById("sidebar").classList;
        sideBar.toggle("open");
    }
    return (
        <header className="navbar bg-teal text-white">
            <div className="w-100">
                <Route
                    path={[
                        "/dashboard",
                        "/myincome",
                        "/myexpense",
                        "/expenselimit",
                        "/financecalculator",
                        "/statistics",
                    ]}
                >
                    <button
                        id="NavToggler"
                        onClick={toggleSidebar}
                        className="btn btn-icon btn-46 float-left text-white"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </Route>
                <div className="mx-2 navbar-brand text-white float-left">
                    <img src="/expensio-logo.png" className="logo" />
                </div>
                <Route
                    path={[
                        "/dashboard",
                        "/myincome",
                        "/myexpense",
                        "/financecalculator",
                        "/expenselimit",
                        "/statistics",
                    ]}
                ></Route>
            </div>
        </header>
    );
}

export default Navbar;
