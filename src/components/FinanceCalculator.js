/*
 * Author: Jaspreet Kaur Gill
 */
import ReactDOM, { useHistory, Link } from 'react-dom';
import Alert from 'react-bootstrap/Alert'
import React, { useState } from "react";

function FinanceCalculator(props){
    const [targetAmount, setTargetAmount] = useState('');
    const [targetAmountMessage, setTargetAmountMessage] = useState('');
    const [targetMonth, setTargetMonth] = useState('');
    const [targetMonthMessage, setTargetMonthMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    var aFlag = 0;
    var mFlag = 0;
    var amountToSave = 0;

    const inputValue = event => {
        const { name, value } = event.target;
        switch(name){
        case 'targetAmount':
            setTargetAmount(value);
            break;
        case 'targetMonth':
            setTargetMonth(value);
            break;
        default:
            break;
        }
    }

    function formValidate() {
        if(targetAmount > 0) {
            setTargetAmountMessage('');
            aFlag = 0;
        } else {
            setTargetAmountMessage('Please enter valid amount');
            aFlag = 1;
        }
        if(targetMonth > 0) {
            setTargetMonthMessage('');
            mFlag = 0;
        } else {
            setTargetMonthMessage('Please enter valid month.');
            mFlag = 1;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        formValidate();
        if(aFlag == 0 && mFlag == 0) {
            amountToSave = (targetAmount/targetMonth).toFixed(2);
            setResponseMessage(
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    The amount to be saved each month is: ${amountToSave}
                </div>
            );
        }
    };

    return(
        <div>
        <div className="row mt-3">
            <div className="col-10">
                <h1 className="h2">Finance Calculator</h1>
            </div>
        </div>
        <hr></hr>
        <div className="row justify-content-md-center">
            <div className="col-md-8 p-2">
                <div className="card border-gray shadow mt-5">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="calculator-form mb-2">
                                    <p id="amountToSave">{responseMessage}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="calculator-form mb-2">
                                    <label htmlFor="target_amount">Target Amount($)</label>
                                    <input className="form-control" name="targetAmount" id="targetAmount" placeholder="Enter Target Amount" onChange={inputValue} required/>
                                    <p className="text-danger">{targetAmountMessage}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="calculator-form mb-2">
                                    <label htmlFor="months">Target Months</label>
                                    <input className="form-control" name="targetMonth" id="targetMonths" placeholder="Enter the number of target months" onChange={inputValue} required/>
                                    <p className="text-danger">{targetMonthMessage}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="mb-2">
                                <button onClick={handleSubmit} className="btn btn-teal mx-auto d-block" type="submit" name="submit" id="submit">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
export default FinanceCalculator;