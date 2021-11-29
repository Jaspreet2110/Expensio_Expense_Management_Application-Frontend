/*
 * Author: Dharaben Thakorbhai Gohil, Nachiket Panchal
 */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { getElement, successBox, dangerBox, dissapear } from "../libs/Helper";

function ExpenseLimit() {
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem("token");
    const config = {
        headers: { Authorization: "Bearer " + token },
    };

    var alertBox = getElement("alert_box");

    const SubmitHandler = (id) => {
        var element = getElement("limit_" + id);
        var limit = element.value.trim();
        if (limit > 0) {
            var values = {
                category_id: id,
                amount: limit,
            };
            axios
                .post(process.env.REACT_APP_API_URL + "/expense/category/limit", values, config)
                .then(function (response) {
                    if (response.status == 200 && response.data.success === true) {
                        alertBox.innerHTML = successBox("Limit added successfully.");
                        dissapear("alert_box");
                        getCategories();
                    }
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        alertBox.innerHTML = dangerBox("Invalid expense category id");
                        dissapear("alert_box");
                    } else if (error.response.status == 422) {
                        alertBox.innerHTML = dangerBox("Please enter details properly.");
                        dissapear("alert_box");
                    } else if (error.response.status == 500) {
                        alertBox.innerHTML = dangerBox("Unauthorized request.");
                        dissapear("alert_box");
                    } else {
                        alertBox.innerHTML = dangerBox("Could not connect with the server!");
                        dissapear("alert_box");
                    }
                });
        } else {
            alertBox.innerHTML = dangerBox("Please add a valid limit.");
            dissapear("alert_box");
        }
    };

    function removeLimit(id) {
        axios
            .delete(process.env.REACT_APP_API_URL + "/expense/category/limit/" + id, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    alertBox.innerHTML = successBox("Limit removed successfully.");
                    getCategories();
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to remove limit!");
            });
    }

    function getCategories() {
        axios
            .get(process.env.REACT_APP_API_URL + "/expense/category", config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    setCategories(response.data.data);
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to connect with server!");
            });
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div>
            <div className="row mt-3">
                <div className="col-10">
                    <h1 className="h2">Expense Limit</h1>
                </div>
            </div>
            <hr />
            <div id="alert_box"></div>
            <div className="row" id="list">
                {categories.map((item) => (
                    <div className="col-md-6 p-2" id={item.id}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <p className="mb-0 d-inline-block ps-2">{item.name}</p>
                                        {item.limit !== null ? (
                                            <p className="mb-0 d-inline-block ps-2 text-muted">
                                                <small>Limit: {item.limit.amount}</small>
                                            </p>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="col-6">
                                        {item.limit == null ? (
                                            <div>
                                                <label className="text-muted">
                                                    <small>Add limit:</small>
                                                </label>
                                                <div className="row">
                                                    <div className="col-8">
                                                        <input
                                                            type="number"
                                                            id={"limit_" + item.id}
                                                            name="limit"
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <button
                                                            onClick={() => {
                                                                SubmitHandler(item.id);
                                                            }}
                                                            className="btn btn-sm btn-success float-right"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <button
                                                    className="btn btn-icon btn-icon-sm btn-32 bg-red float-right text-white"
                                                    onClick={() => {
                                                        removeLimit(item.limit.id);
                                                    }}
                                                >
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ExpenseLimit;
