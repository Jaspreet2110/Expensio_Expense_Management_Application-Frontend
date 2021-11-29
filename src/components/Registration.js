/*
 * Author: Rushikesh Patel, Nachiket Panchal
 */
import React, { useState } from "react";
import axios from "axios";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { dangerBox, successBox, dissapear, delayedRoute, getElement } from "../libs/Helper";

function Registration() {
    const [formStatus, setFormStatus] = useState(false);
    const [errors, setErrors] = useState({});

    let history = useHistory();
    let user = {};
    let alertBox = getElement("alert_box");

    function checkStatus(e) {
        console.log("Inside checkstatus function");
        if (formStatus) {
            axios
                .post(process.env.REACT_APP_API_URL + "/user", {
                    email: user.emailid,
                    name: user.username,
                    password: user.pwd,
                })
                .then(function (response) {
                    if (response.status == 200 && response.data.success === true) {
                        alertBox.innerHTML = successBox("Registration successful. Redirecting to login page.");
                        dissapear("alert_box");
                        delayedRoute("/login", history);
                    }
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        alertBox.innerHTML = dangerBox("Invalid details, please enter valid details.");
                        dissapear("alert_box");
                    } else {
                        alertBox.innerHTML = dangerBox("Unable to register! Please try again later.");
                        dissapear("alert_box");
                    }
                });
        }
    }

    const onsubmit = (event) => {
        event.preventDefault();
        let errors = {};
        const form = event.currentTarget;
        user.username = form.elements.username.value.trim();
        user.emailid = form.elements.emailid.value.trim();
        user.pwd = form.elements.password.value.trim();
        user.confirmpwd = form.elements.confirmpassword.value.trim();

        let re_email =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let re_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (user.username === "") {
            errors.username = "Please enter your name";
            setFormStatus(false);
        }
        if (user.username !== "" && !user.username.match(/^[0-9a-zA-Z ]+$/)) {
            errors.username = "Only alphabetic characters and spaces allowed.";
        }

        if (user.emailid === "") {
            errors.emailid = "Please enter email.";
        }

        if (user.emailid !== "" && !user.emailid.match(re_email)) {
            errors.emailid = "Please enter a valid email.";
        }

        if (user.pwd === "") {
            errors.pwd = "Please enter a password.";
        } else if (!user.pwd.match(re_password)) {
            errors.pwd = "Please enter a valid password.";
        }

        if (user.confirmpwd === "") {
            errors.confirmpwd = "Please enter the password again.";
        } else if (user.pwd !== user.confirmpwd) {
            errors.confirmpwd = "Confirm password does not match.";
        }
        setErrors(errors);
        if (errors.username || errors.emailid || errors.pwd || errors.confirmpwd) {
            setFormStatus(false);
        } else {
            setFormStatus(true);
        }
        checkStatus();
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="mx-auto col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="App-name">
                                <div className="text-center p-3 mb-2">
                                    <h2 className="h3 expensio-title">Register</h2>
                                </div>
                                <hr />
                            </div>
                            <div id="alert_box"></div>
                            <div className="row">
                                <div className="mx-auto">
                                    <Form onSubmit={onsubmit}>
                                        <div className="mb-2 text-muted">
                                            <label htmlFor="username">Full Name</label>
                                            <Form.Control type="text" placeholder="Enter your name" id="username" />
                                            {errors.username && <p class="text-danger">{errors.username}</p>}
                                        </div>
                                        <div className="mb-2 text-muted">
                                            <label htmlFor="emailid">Email</label>
                                            <Form.Control type="text" placeholder="Enter your email" id="emailid" />
                                            {errors.emailid && <p class="text-danger">{errors.emailid}</p>}
                                        </div>
                                        <div className="mb-2 text-muted">
                                            <label htmlFor="password">Password</label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter a password"
                                                id="password"
                                            />
                                            <small className="text-muted">
                                                Min. 8 chars, 1 uppercase, 1 lowercase, 1 numer, and 1 special char
                                                required.
                                            </small>
                                            {errors.pwd && <p class="text-danger">{errors.pwd}</p>}
                                        </div>
                                        <div className="mb-2 text-muted">
                                            <label htmlFor="confirmpassword">Confirm Password</label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Repeat the password"
                                                id="confirmpassword"
                                            />
                                            {errors.confirmpwd && <p class="text-danger">{errors.confirmpwd}</p>}
                                        </div>
                                        <div className="mx-auto mb-2">
                                            <Row>
                                                <Col>
                                                    <Button
                                                        variant="secondary"
                                                        type="submit"
                                                        className="btn btn-teal mx-auto text-center d-block"
                                                    >
                                                        Create Account
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="col-12 text-center">
                                            <Row>
                                                <Col md text-center>
                                                    <Form.Label className="genderclass">
                                                        Already have an account?
                                                        <Link to="/"> Log in </Link>
                                                    </Form.Label>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;
