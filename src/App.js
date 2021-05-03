import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
import uuid from 'uuid/dist/v4';

// const initialExpenses = [
//   { id: uuid(), charge: 'rent', amount: 1600 },
//   { id: uuid(), charge: 'car payment', amount: 4200 },
//   { id: uuid(), charge: 'credit card bill', amount: 1600 },
// ];

const initialExpenses = localStorage.getItem('expenses')
  ? JSON.parse(localStorage.getItem('expenses'))
  : [];

function App() {
  // *****************   state values **********************
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);

  // single expense
  const [charge, setCharge] = useState('');

  // single amount
  const [amount, setAmount] = useState('');

  // alert
  const [alert, setAlert] = useState({ show: false });

  // edit
  const [edit, setEdit] = useState(false);

  // edit  item
  const [id, setId] = useState(0);

  // ******************* use effect *****************
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  });

  // ******************* functionality *****************
  // handle charge
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  // handleAmount
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  // handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  // handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((expense) => {
          return expense.id === id ? { ...expense, charge, amount } : expense;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: 'success', text: 'item edited' });
      } else {
        const singleExpense = {
          id: uuid(),
          charge: charge,
          amount: amount,
        };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: 'success', text: 'item added' });
      }
      setAmount('');
      setCharge('');
    } else {
      // handle alert called for error
      handleAlert({
        type: 'danger',
        text: 'charge cant be empty value and amount must be bigger that 0',
      });
    }
  };

  // clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: 'danger', text: 'all items removed successfully' });
  };

  // handleDelete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: 'danger', text: 'item removed successfully' });
  };

  // handleEdit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
    console.log('item edited');
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className='App'>
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        total spending:{' '}
        <span className='total'>
          $
          {expenses.reduce((accumulator, current) => {
            return (accumulator += +current.amount);
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
