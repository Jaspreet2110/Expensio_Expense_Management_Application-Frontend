/*
 * Author: Nachiket Panchal, Jaspreet Kaur Gill
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getElement, successBox, dangerBox, dissapear } from "../libs/Helper";

function AddIncomeModal(props) {
    const [title, setTitle] = useState("");
    const [titleMessage, setTitleMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [amountMessage, setAmountMessage] = useState("");
    const [category, setCategory] = useState("");
    const [categoryMessage, setCategoryMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem("token");
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
                setTitle(value);
                break;
            case "amount":
                setAmount(value);
                break;
            case "category":
                setCategory(value);
                break;
            default:
                break;
        }
    };

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
            setCategoryMessage("Please select the source of income.");
            cFlag = 1;
        } else {
            setCategoryMessage("");
            cFlag = 0;
        }
    }

    function getCategories() {
        axios
            .get(process.env.REACT_APP_API_URL + "/income/category", config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    setCategories(response.data.data);
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to connect with server!");
            });
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        formValidate();

        if (tFlag == 0 && aFlag == 0 && cFlag == 0) {
            var values = {
                title: title,
                amount: amount,
                income_category: category,
                is_recurring: false,
            };
            axios
                .post(process.env.REACT_APP_API_URL + "/income", values, config)
                .then(function (response) {
                    if (response.status == 200 && response.data.success === true) {
                        alertBox.innerHTML = successBox("Income added successfully.");
                        dissapear("alert_box");
                        props.update();
                        getElement("addIncomeForm").reset();
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
                    <h2 className="h3 expensio-title">Add Income</h2>
                </Modal.Title>
                <button
                    className="btn btn-icon btn-icon-sm btn-32 bg-red float-right text-white"
                    onClick={props.onHide}
                >
                    <i className="fas fa-minus"></i>
                </button>
            </Modal.Header>
            <Modal.Body>
                <form className="form-group" id="addIncomeForm" onSubmit={SubmitHandler}>
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
                            Income Source
                        </label>
                        <select name="category" id="category" className="form-control" onChange={inputValue} required>
                            <option value="" defaultValue>
                                Select source
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

function MyIncome() {
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);

    var today = new Date();
    const [monthState, setMonthState] = useState(today.getMonth() + 1);
    const [yearState, setYearState] = useState(today.getFullYear());
    var yearList = [2021, 2022, 2023];
    var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = 1;

    var alertBox = getElement("alert_con");

    const token = localStorage.getItem("token");
    const config = {
        headers: { Authorization: "Bearer " + token },
    };

    function removeItem(id) {
        axios
            .delete(process.env.REACT_APP_API_URL + "/income/" + id, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    alertBox.innerHTML = successBox("Income deleted successfully.");
                    update();
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to delete income!");
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

    function handleMonth(e) {
        setMonthState(e.target.value);
    }

    function handleYear(e) {
        setYearState(e.target.value);
    }

    function recurringHandler(id, isRecurring) {
        var values = { is_recurring: isRecurring };
        axios
            .put(process.env.REACT_APP_API_URL + "/income/" + id, values, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    if (response.data.data.is_recurring) {
                        alertBox.innerHTML = successBox("Income added to recurring list.");
                    } else {
                        alertBox.innerHTML = successBox("Income discarded from recurring list.");
                    }
                    update();
                }
            })
            .catch(function (error) {
                if (error.response.status == 404) {
                    alertBox.innerHTML = dangerBox("Invalid income!");
                    dissapear("alert_con");
                } else {
                    alertBox.innerHTML = dangerBox("Unable to reach the server!");
                    dissapear("alert_con");
                }
            });
    }

    function update() {
        dateFilter(monthState, yearState);
        axios
            .get(process.env.REACT_APP_API_URL + "/income?date=" + yearState + "-" + monthState + "-" + day, config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    var responseData = response.data.data;
                    setData(responseData);
                    dissapear("alert_con");
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to fetch income list!");
                dissapear("alert_con");
            });
    }

    useEffect(() => {
        update();
    }, [monthState, yearState]);

    return (
        <div>
            <div className="row mt-3">
                <div className="col-10">
                    <h1 className="h2">My Income</h1>
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
                <div className="col-6">
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
                    <small>Please check or uncheck checkbox to mark an income as recurring.</small>
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
                                                name="income-re-occur"
                                                onChange={() => {
                                                    recurringHandler(item.id, item.is_recurring ? false : true);
                                                }}
                                                checked={item.is_recurring}
                                            />
                                            <p className="mb-0 d-inline-block ps-2">{item.title}</p>
                                        </div>
                                        <p className="mb-0 text-muted">{item.income_category}</p>
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
            <AddIncomeModal show={modalShow} update={() => update()} onHide={() => setModalShow(false)} />
        </div>
    );
}
export default MyIncome;
