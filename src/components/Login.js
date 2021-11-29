/*
 * Author: Rushikesh Patel, Nachiket Panchal
 */
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../libs/AuthenticateLib";
import { getElement, dangerBox, dissapear } from "../libs/Helper";

function Login() {
    const { userAuthenticate } = useAuthContext();
    const [errors, setErrors] = useState({});

    var flag = 0;
    var alertBox = getElement("alert_box");

    let history = useHistory();

    if (localStorage.getItem("token") !== null) {
        userAuthenticate(true);
        history.push("/dashboard");
    }

    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value.trim(),
        });
    };

    function validation(values) {
        let errors = {};
        let re_email =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let re_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!values.email) {
            errors.email = "Please enter email.";
            flag = 1;
        }
        if (!values.password) {
            errors.password = "Please enter password.";
            flag = 1;
        }
        if (flag == 0 && (!re_email.test(values.email) || !re_password.test(values.password))) {
            alertBox.innerHTML = dangerBox("Invalid email or password");
            flag = 1;
        }
        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));
        if (flag === 0) {
            axios
                .post(process.env.REACT_APP_API_URL + "/user/login", values)
                .then(function (response) {
                    if (response.status == 200 && response.data.success === true) {
                        userAuthenticate(true);
                        localStorage.setItem("token", response.data.data.token);
                        history.push("/dashboard");
                    }
                })
                .catch(function (error) {
                    if (error.response.status == 401) {
                        alertBox.innerHTML = dangerBox("Invalid email or password");
                        dissapear("alert_box");
                    } else if (error.response.status == 500) {
                        alert("running");
                        alertBox.innerHTML = dangerBox("Unexpected error!");
                        dissapear("alert_box");
                    } else {
                        alertBox.innerHTML = dangerBox("Could not connect with the server!");
                        dissapear("alert_box");
                    }
                });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="mx-auto col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <form className="form-group" id="form">
                                <div className="App-name">
                                    <div className="text-center p-3 mb-2">
                                        <h2 className="h3 expensio-title">Login</h2>
                                    </div>
                                    <hr />
                                </div>
                                <div className="space"></div>
                                <div id="alert_box"></div>
                                <div className="Login-form mb-2 text-muted">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Enter Email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-danger">{errors.email}</p>}
                                </div>
                                <div className="Login-form mb-2 text-muted">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter Password"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="text-danger">{errors.password}</p>}
                                </div>
                                <div className="mb-2">
                                    <button
                                        className="btn btn-teal mx-auto d-block"
                                        type="submit"
                                        name="submit"
                                        id="submit"
                                        onClick={handleSubmit}
                                    >
                                        Login
                                    </button>
                                </div>
                                <div>
                                    <p className="text-center">
                                        New User? Please <Link to="/register">Sign-up</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
