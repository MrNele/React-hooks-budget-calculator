import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
import uuid from "uuid/v4";

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1500 },
//   { id: uuid(), charge: "car payment", amount: 400 },
//   { id: uuid(), charge: "credit card bill", amount: 1200 },
// ];
const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem("expenses")) : [];
// console.log(initialExpenses);
// 1) treba importovati hook useState()
// 2) f-ja returns[] sa 2 vrednosti
// 3) trenutna vrednost state-a
// 4) f-ja za updates/control
// 5) default vrednost
function App() {
  // console.log(initialExpenses);
  //  const result=useState(initialExpenses)      ;
  //  const expenses=result[0];
  //  const setExpenses=result[1];
  //  console.log(expenses, setExpenses);
  // moze ovako kao ovo iznad, ali bolje da koristim destructuring

  // *************************** state vrednosti ***********
  // svi troskovi, add trosak
  const [expenses, setExpenses] = useState(initialExpenses);
  // jedan trosak
  const [charge, setCharge] = useState(""); // ovde se prosledjuje inic vrednost, sto je zapravo, prazan string
  // jedan amount
  const [amount, setAmount] = useState(""); // ovde se prosledjuje inic vrednost, sto je zapravo, prazan string
  // console.log(expenses);
  // alert
  const [alert, setAlert] = useState({ show: false });
  //edit
  const [edit, setEdit]=useState(false);
  //edit item 
  const [id, setId]=useState(0);
  //***********************useEffect **********************/
  useEffect(()=>{
    console.log('pozvan je useEffect');
    localStorage.setItem('expenses', JSON.stringify(expenses))
  },[expenses]);
  //***********************funkcinalnost **********************/
  // upravljanje charge-om
  const handleCharge = (e) => {
    // console.log(`charge ${e.target.value}`);
    setCharge(e.target.value);
  };
  // upravljanje amount-om
  const handleAmount = (e) => {
    // console.log(`amount : ${e.target.value}`);
    setAmount(e.target.value);
  };
  // upravljanje alert-om
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 5000);
  };

  // upravljanje submit-om
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(charge, amount);
    if (charge !== "" && amount > 0) {
      if(edit){
        let tempExpenses=expenses.map(item =>{
          return item.id === id ?{...item, charge,amount} :item // id na kraju je ovaj iz state-a
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "item edited" });        
      }else{
        const singleExpense = { id: uuid(), charge, amount }; // umesto charge:charge, stoji samo charge jer je ovo ES6. Istp vazi i za amount
        setExpenses([...expenses, singleExpense]); // singleExpense je red, pise dole. Takodje se ovde stavlja ...(spread operator) jer ako ostane bez, stare vrednosti se brisu sto ne zelimo
        // kod ispod sluzi da obrise sa linije gde se unosi ono staro. Zato je empty string
        handleAlert({ type: "success", text: "item added" });        
      }
    setCharge("");
      setAmount("");
    } else {
      //zove se alert koji kaze da nesto ne valja
      handleAlert({
        type: "danger",
        text: `charge can't be empty value and amount has to be bigger then zero`,
      });
    }
  };
  //clear all items
  const clearItems = () => {
    setExpenses([]);
    // console.log(('cleared all items'));
    handleAlert({type:'danger',text:'all items deleted'});
  };
  //upravljanje delete-om
  const handleDelete = (id) => {
    // console.log(`item deleted : ${id}`);
    let tempExpenses=expenses.filter(item =>item.id !==id);
    // console.log(tempExpenses);
    setExpenses(tempExpenses);
    handleAlert({type:'danger',text:'item deleted'});
  };
  //upravljanje edit-om
  const handleEdit = (id) => {
    let expense=expenses.find(item=> item.id ===id)
    // console.log(`item edited : ${id}`);
    // console.log(expense);
    let {charge, amount}=expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className="App">
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
        total spending :{" "}
        <span className="total">
          ${""}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount)); //parseInt stoji jer bi se bez toga total prikazao kao da su dodati brojevi: npr: 300+200 ispasce 300200, a ne 500
          }, 0)}{" "}
          {/* 0 je inicijalna vr*/}
        </span>
      </h1>
    </>
  );
}

export default App;
