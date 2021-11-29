import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import PlainPage from "./routes/PlainPage";
import DashboardPage from "./routes/DashboardPage";
import { AuthContext } from "./libs/AuthenticateLib";

function App() {
    const [isAuthenticated, userAuthenticate] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userAuthenticate }}>
            <div className="">
                <BrowserRouter>
                    <Navbar />
                    <Switch>
                        <Route path={["/", "/login", "/register"]}>
                            <PlainPage />
                        </Route>
                    </Switch>
                    <Switch>
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
                            <div id="pageBody">
                                <DashboardPage />
                            </div>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
