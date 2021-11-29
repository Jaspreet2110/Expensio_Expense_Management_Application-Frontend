/*
 * Author: , Jaspreet Kaur Gill, Nachiket Panchal
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getElement, successBox, dangerBox, dissapear } from "../libs/Helper";

function Dashboard() {
    var nullData = {
        total_expense_limit: 0,
        remaining_expense_limit: 0,
        total_income: 0,
        remaining_income: 0,
        recurring_expenses: [],
        recurring_incomes: [],
    };
    const [data, setData] = useState(nullData);
    const token = localStorage.getItem("token");
    const config = {
        headers: { Authorization: "Bearer " + token },
    };
    var alertBox = getElement("alert_box");

    function update() {
        axios
            .get(process.env.REACT_APP_API_URL + "/stats/dashboard", config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    setData(response.data.data);
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to connect with server!");
            });
    }

    useEffect(() => {
        update();
    }, []);

    return (
        <div>
            <div className="row mt-3">
                <div className="col-10">
                    <h1 className="h2">Dashboard</h1>
                </div>
            </div>
            <hr></hr>
            <div id="alert_con"></div>
            <div className="row">
                <div className="col-md-3 p-2">
                    <div className="card design-card border-gray shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <p>Total Expense Limit</p>
                                    <hr></hr>
                                </div>
                            </div>
                            <div className="row text-muted">
                                <div className="col-12 text-center">
                                    <p className="m-0 text-black">$ {data.total_expense_limit}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 p-2">
                    <div className="card design-card border-gray shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <p>Remaining Expense Limit</p>
                                    <hr></hr>
                                </div>
                            </div>
                            <div className="row text-muted">
                                <div className="col-12 text-center">
                                    <p className="m-0">$ {data.remaining_expense_limit}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 p-2">
                    <div className="card design-card border-gray shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <p>Total Income</p>
                                    <hr></hr>
                                </div>
                            </div>
                            <div className="row text-muted">
                                <div className="col-12 text-center">
                                    <p className="m-0">$ {data.total_income}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 p-2">
                    <div className="card design-card border-gray shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <p>Remaining Income</p>
                                    <hr></hr>
                                </div>
                            </div>
                            <div className="row text-muted">
                                <div className="col-12 text-center">
                                    <p className="m-0">$ {data.remaining_income}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-6 p-2">
                    <div className="row text-center">
                        <p>
                            <b>Recurring Expenses</b>
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <table className="table table-striped table-responsive">
                                <thead>
                                    <tr>
                                        <td scope="col">#</td>
                                        <td scope="col">Title</td>
                                        <td scope="col">Amount</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recurring_expenses.map((item) => (
                                        <tr>
                                            <td scope="row">{item.id}</td>
                                            <td>{item.title}</td>
                                            <td>$ {item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 p-2">
                    <div className="row text-center ">
                        <p>
                            <b>Recurring Income</b>
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <table className="table table-striped table-responsive table-design">
                                <thead>
                                    <tr>
                                        <td scope="col">#</td>
                                        <td scope="col">Title</td>
                                        <td scope="col">Amount</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recurring_incomes.map((item) => (
                                        <tr>
                                            <td scope="row">{item.id}</td>
                                            <td>{item.title}</td>
                                            <td>$ {item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;
