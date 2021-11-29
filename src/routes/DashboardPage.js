/*
 * Author: Nachiket Panchal
 */
import { Route, useHistory } from "react-router-dom";
import MyIncome from "../components/MyIncome";
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";
import MyExpense from "../components/MyExpense";
import FinanceCalculator from "../components/FinanceCalculator";
import { useAuthContext } from "../libs/AuthenticateLib";
import Statistics from "../components/Statistics";
import ExpenseLimit from "../components/ExpenseLimit";

function DashboardPage() {
    const { isAuthenticated } = useAuthContext();
    const { userAuthenticate } = useAuthContext();

    let history = useHistory();

    if (localStorage.getItem("token") == null) {
        history.push("/login");
    } else {
        userAuthenticate(true);
    }
    return (
        <div>
            <Sidebar />
            <div id="container" className="container px-3">
                <Route exact path="/Dashboard">
                    <Dashboard />
                </Route>
                <Route exact path="/myincome">
                    <MyIncome />
                </Route>
                <Route exact path="/myexpense">
                    <MyExpense />
                </Route>
                <Route exact path="/expenselimit">
                    <ExpenseLimit />
                </Route>
                <Route exact path="/financecalculator">
                    <FinanceCalculator />
                </Route>
                <Route exact path="/statistics">
                    <Statistics />
                </Route>
            </div>
        </div>
    );
}
export default DashboardPage;
