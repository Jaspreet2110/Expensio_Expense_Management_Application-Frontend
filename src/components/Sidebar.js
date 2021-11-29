/*
 * Author: Nachiket Panchal
 */
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../libs/AuthenticateLib";

function Sidebar() {
    const { userAuthenticate } = useAuthContext();
    let history = useHistory();
    return (
        <div id="sidebar" className="div">
            <div>
                <ul>
                    <li>
                        <Link to="/dashboard">
                            <span className="link_icon">
                                <i className="fas fa-th"></i>
                            </span>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/myincome">
                            <span className="link_icon">
                                <i className="fas fa-dollar-sign"></i>
                            </span>
                            My Income
                        </Link>
                    </li>
                    <li>
                        <Link to="/myexpense">
                            <span className="link_icon">
                                <i className="far fa-money-bill-alt"></i>
                            </span>
                            My Expense
                        </Link>
                    </li>
                    <li>
                        <Link to="/expenselimit">
                            <span className="link_icon">
                                <i class="fas fa-funnel-dollar"></i>
                            </span>
                            Expense Limit
                        </Link>
                    </li>
                    <li>
                        <Link to="/statistics">
                            <span className="link_icon">
                                <i class="far fa-chart-bar"></i>
                            </span>
                            Statistics
                        </Link>
                    </li>
                    <li>
                        <Link to="/financecalculator">
                            <span className="link_icon">
                                <i class="fas fa-calculator"></i>
                            </span>
                            Finance Calculator
                        </Link>
                    </li>
                    <li>
                        <p
                            onClick={() => {
                                userAuthenticate(false);
                                localStorage.removeItem("token");
                                history.push("/login");
                            }}
                        >
                            <span className="link_icon">
                                <i className="fas fa-sign-out-alt"></i>
                            </span>
                            Logout
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
