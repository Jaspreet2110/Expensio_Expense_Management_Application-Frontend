/*
 * Author: Nachiket Panchal
 */
import { Route } from "react-router-dom";
import Login from "../components/Login";
import Registration from "../components/Registration";

function PlainPage() {
    return (
        <div id="pageBody">
            <Route exact path={["/", "/login"]}>
                <Login />
            </Route>
            <Route exact path="/register">
                <Registration />
            </Route>
        </div>
    );
}
export default PlainPage;
