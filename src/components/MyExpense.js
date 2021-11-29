/*
 * Author: Sravani Pinninti, Jaspreet Kaur Gill, Nachiket Panchal
 */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { getElement, successBox, dangerBox, dissapear } from "../libs/Helper";

function AddExpenseModal(props) {
    const [title, setTitle] = useState("");
    const [titleMessage, setTitleMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [amountMessage, setAmountMessage] = useState("");
    const [category, setCategory] = useState("");
    const [categoryMessage, setCategoryMessage] = useState("");
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState([]);
    const config = {
        headers: { Authorization: "Bearer " + token },
    };

    var alertBox = getElement("alert_box");
    var tFlag = 0;
    var aFlag = 0;
    var cFlag = 0;

    const inputValue = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case "title":
                setTitle(value.trim());
                break;
            case "amount":
                setAmount(value.trim());
                break;
            case "category":
                setCategory(value.trim());
                break;
            default:
                break;
        }
    };

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

    function formValidate() {
        if (title == "") {
            setTitleMessage("Please enter title.");
            tFlag = 1;
        } else {
            setTitleMessage("");
            tFlag = 0;
        }
        if (amount > 0) {
            setAmountMessage("");
            aFlag = 0;
        } else {
            setAmountMessage("Please enter valid amount.");
            aFlag = 1;
        }
        if (category == "" || category == null) {
            setCategoryMessage("Please select an expense category.");
            cFlag = 1;
        } else {
            setCategoryMessage("");
            cFlag = 0;
        }
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        formValidate();

        if (tFlag == 0 && aFlag == 0 && cFlag == 0) {
            var values = {
                title: title,
                amount: amount,
                expense_category: category,
                is_recurring: false,
            };
            axios
                .post(process.env.REACT_APP_API_URL + "/expense", values, config)
                .then(function (response) {
                    if (response.status == 200 && response.data.success === true) {
                        alertBox.innerHTML = successBox("Expense added successfully.");
                        dissapear("alert_box");
                        props.update();
                        getElement("addExpenseForm").reset();
                    }
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
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
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h2 className="h3 expensio-title">Add Expense</h2>
                </Modal.Title>
                <button
                    className="btn btn-icon btn-icon-sm btn-32 bg-red float-right text-white"
                    onClick={props.onHide}
                >
                    <i className="fas fa-minus"></i>
                </button>
            </Modal.Header>
            <Modal.Body>
                <form className="form-group" id="addExpenseForm" onSubmit={SubmitHandler}>
                    <div id="alert_box"></div>
                    <div className="mb-3">
                        <label htmlFor="title" className="text-muted">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-control"
                            onChange={inputValue}
                            required
                        />
                        <p className="text-danger">{titleMessage}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="text-muted">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="form-control"
                            onChange={inputValue}
                            required
                        />
                        <p className="text-danger">{amountMessage}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="text-muted">
                            Expense Category
                        </label>
                        <select name="category" id="category" className="form-control" onChange={inputValue} required>
                            <option value="" defaultValue>
                                Select
                            </option>
                            {categories.map((item) => (
                                <option value={item.name}>{item.name}</option>
                            ))}
                        </select>
                        <p className="text-danger">{categoryMessage}</p>
                    </div>
                    <button className="btn btn-sm btn-success form-control">ADD</button>
                </form>
            </Modal.Body>
        </Modal>
    );
}

function MyExpense() {
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);
    const day = 1;
    const token = localStorage.getItem("token");
    const config = {
        headers: { Authorization: "Bearer " + token },
    };

    var today = new Date();
    const [monthState, setMonthState] = useState(today.getMonth() + 1);
    const [yearState, setYearState] = useState(today.getFullYear());
    var yearList = [2021, 2022, 2023];
    var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var alertBox = getElement("alert_con");

    function removeItem(id) {
        axios
            .delete(process.env.REACT_APP_API_URL + "/expense/" + id, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    alertBox.innerHTML = successBox("Expense deleted successfully.");
                    update();
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to delete expense!");
            });
    }

    function recurringHandler(id, isRecurring) {
        var values = { is_recurring: isRecurring };
        axios
            .put(process.env.REACT_APP_API_URL + "/expense/" + id, values, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    if (response.data.data.is_recurring) {
                        alertBox.innerHTML = successBox("Expense added to recurring list.");
                    } else {
                        alertBox.innerHTML = successBox("Expense discarded from recurring list.");
                    }
                    update();
                }
            })
            .catch(function (error) {
                if (error.response.status == 404) {
                    alertBox.innerHTML = dangerBox("Invalid expense!");
                    dissapear("alert_con");
                } else {
                    alertBox.innerHTML = dangerBox("Unable to reach the server!");
                    dissapear("alert_con");
                }
            });
    }

    function dateFilter(d, y) {
        var month = "";
        for (var i = 0; i < monthList.length; i++) {
            var m = i + 1;
            if (monthState == m) {
                month += "<option value='" + m + "' selected>" + monthList[i] + "</option>";
            } else {
                month += "<option value='" + m + "'>" + monthList[i] + "</option>";
            }
        }
        getElement("month").innerHTML = month;
        var year = "";
        for (var i = 0; i < yearList.length; i++) {
            if (yearState == yearList[i]) {
                year += "<option value='" + yearList[i] + "' selected>" + yearList[i] + "</option>";
            } else {
                year += "<option value='" + yearList[i] + "'>" + yearList[i] + "</option>";
            }
        }
        getElement("year").innerHTML = year;
    }

    function update() {
        dateFilter(monthState, yearState);
        axios
            .get(process.env.REACT_APP_API_URL + "/expense?date=" + yearState + "-" + monthState + "-" + day, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    var responseData = response.data.data;
                    setData(responseData);
                    dissapear("alert_con");
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to fetch expenses!");
                dissapear("alert_con");
            });
    }

    function handleMonth(e) {
        setMonthState(e.target.value);
    }

    function handleYear(e) {
        setYearState(e.target.value);
    }

    useEffect(() => {
        update();
    }, [monthState, yearState]);

    return (
        <div>
            <div className="row mt-3">
                <div className="col-10">
                    <h1 className="h2">My Expense</h1>
                </div>
                <div className="col-2">
                    <button className="btn btn-icon btn-46 border-teal float-right" onClick={() => setModalShow(true)}>
                        <i className="fas fa-plus text-teal"></i>
                    </button>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    <label for="month">Month</label>
                    <select
                        id="month"
                        className="form-control"
                        onChange={(e) => {
                            handleMonth(e);
                        }}
                    ></select>
                </div>
                <div class="col-6">
                    <label for="year">Year</label>
                    <select
                        id="year"
                        className="form-control"
                        onChange={(e) => {
                            handleYear(e);
                        }}
                    ></select>
                </div>
            </div>
            <hr />
            <div id="alert_con"></div>
            <div>
                <p className="text-muted">
                    <small>Please check or uncheck checkbox to mark an expense as recurring.</small>
                </p>
            </div>
            <div className="row" id="list">
                {data.map((item) => (
                    <div className="col-md-6 p-2" id={item.id}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-10">
                                        <div>
                                            <input
                                                type="checkbox"
                                                name="expense-re-occur"
                                                onChange={() => {
                                                    recurringHandler(item.id, item.is_recurring ? false : true);
                                                }}
                                                checked={item.is_recurring}
                                            />
                                            <p className="mb-0 d-inline-block ps-2">{item.title}</p>
                                        </div>
                                        <p className="mb-0 text-muted">{item.expense_category}</p>
                                    </div>
                                    <div className="col-2">
                                        <button
                                            onClick={() => {
                                                removeItem(item.id);
                                            }}
                                            className="btn btn-icon btn-icon-sm btn-32 bg-red text-white float-right"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="row text-muted">
                                    <div className="col-6">
                                        <p className="m-0">$ {item.amount}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="m-0 text-end">{item.date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <AddExpenseModal show={modalShow} update={() => update()} onHide={() => setModalShow(false)} />
        </div>
    );
}
export default MyExpense;
