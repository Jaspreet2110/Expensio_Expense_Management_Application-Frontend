/*
 * Author: Nachiket Panchal
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getElement, successBox, dangerBox, dissapear } from "../libs/Helper";
import { Chart, Line, Doughnut } from "react-chartjs-2";

function Statistics() {
    const nullLineData = {
        labels: ["1st", "8th", "15th", "22nd", ""],
        datasets: [
            {
                label: "This month",
                data: [0, 0, 0, 0, 0],
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
            },
            {
                label: "Previous month",
                data: [0, 0, 0, 0, 0],
                fill: false,
                backgroundColor: "rgb(142, 36, 170)",
                borderColor: "rgb(142, 36, 170, 0.2)",
            },
        ],
    };
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    const nullPieData = {
        labels: ["Salary", "Freelancing", "Overtime", "Investments"],
        datasets: [
            {
                label: "",
                data: [700, 590, 50, 213],
                backgroundColor: [
                    "rgba(171, 71, 188, 0.2)",
                    "rgb(102, 187, 106, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(171, 71, 188, 1)",
                    "rgb(102, 187, 106, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const [incomeLine, setIncomeLine] = useState(nullLineData);
    const [expenseLine, setExpenseLine] = useState(nullLineData);
    const [incomePie, setIncomePie] = useState(nullPieData);
    const [expensePie, setExpensePie] = useState(nullPieData);
    const token = localStorage.getItem("token");
    const config = {
        headers: { Authorization: "Bearer " + token },
    };

    function update() {
        var alertBox = getElement("alert_con");
        var alertECon = getElement("alert_e_con");
        var alertICon = getElement("alert_i_con");

        axios
            .get(process.env.REACT_APP_API_URL + "/stats/graph", config)
            .then(function (response) {
                if (response.status == 200 && response.data.success === true) {
                    alertECon.innerHTML = "";
                    alertICon.innerHTML = "";
                    const expenseL = Chart.getChart("expense-line");
                    const incomeL = Chart.getChart("income-line");
                    var filler = [];
                    filler.push(0);
                    expenseL.data.datasets[0].data = filler.concat(response.data.data.current_month_expense);
                    expenseL.data.datasets[1].data = filler.concat(response.data.data.prev_month_expense);
                    expenseL.update();
                    incomeL.data.datasets[0].data = filler.concat(response.data.data.current_month_income);
                    incomeL.data.datasets[1].data = filler.concat(response.data.data.prev_month_income);
                    incomeL.update();
                    var expenseByCategoryList = response.data.data.expense_by_category;
                    var expenseCategories = [];
                    var expenseTotal = [];
                    Object.entries(expenseByCategoryList).forEach(([key, value]) => {
                        expenseCategories.push(key);
                        expenseTotal.push(value);
                    });
                    const expenseP = Chart.getChart("expense-pie");
                    expenseP.data.labels = expenseCategories;
                    expenseP.data.datasets[0].data = expenseTotal;
                    expenseP.update();
                    if (expenseCategories.length == 0) {
                        alertECon.innerHTML = dangerBox("No Data available");
                    }
                    var incomeByCategoryList = response.data.data.income_by_category;
                    var incomeCategories = [];
                    var incomeTotal = [];
                    Object.entries(incomeByCategoryList).forEach(([key, value]) => {
                        incomeCategories.push(key);
                        incomeTotal.push(value);
                    });
                    const incomeP = Chart.getChart("income-pie");
                    incomeP.data.labels = incomeCategories;
                    incomeP.data.datasets[0].data = incomeTotal;
                    incomeP.update();
                    if (incomeCategories.length == 0) {
                        alertICon.innerHTML = dangerBox("No Data available");
                    }
                }
            })
            .catch(function (error) {
                alertBox.innerHTML = dangerBox("Unable to connect with server!");
                dissapear("alert_con");
            });
    }

    useEffect(() => {
        update();
    }, []);

    return (
        <div>
            <div className="row mt-3">
                <div className="col-10">
                    <h1 className="h2">Statistics</h1>
                </div>
            </div>
            <hr></hr>
            <div id="alert_con"></div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="h4">Expenses</h3>
                            <Line id="expense-line" data={expenseLine} options={options} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="h4">Income</h3>
                            <Line id="income-line" data={incomeLine} options={options} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="h4">Expenses by category</h3>
                            <div id="alert_e_con"></div>
                            <Doughnut id="expense-pie" data={expensePie} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="h4">Income by category</h3>
                            <div id="alert_i_con"></div>
                            <Doughnut id="income-pie" data={incomePie} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Statistics;
