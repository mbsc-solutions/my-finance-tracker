```javascript
// ================================
// MY FINANCE TRACKER
// Income / Expense / Debit System
// ================================

let totalIncome = 0;
let totalExpenses = 0;
let totalDebit = 0;
let totalDebitPaid = 0;

// --------------------------------
// Income Allocation
// --------------------------------

const allocation = {
    Personal: 30,
    Emergency: 20,
    Savings: 20,
    PPF: 20,
    Jar: 10
};

function calculateIncomeAllocation(amount) {

    return {
        Personal: amount * allocation.Personal / 100,
        Emergency: amount * allocation.Emergency / 100,
        Savings: amount * allocation.Savings / 100,
        PPF: amount * allocation.PPF / 100,
        Jar: amount * allocation.Jar / 100
    };

}

// --------------------------------
// Add Income
// --------------------------------

function addIncome(amount) {

    amount = Number(amount);

    if (!amount || amount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    totalIncome += amount;

    const result = calculateIncomeAllocation(amount);

    console.log("Income Added:", amount);
    console.log("Personal:", result.Personal);
    console.log("Emergency:", result.Emergency);
    console.log("Savings:", result.Savings);
    console.log("PPF:", result.PPF);
    console.log("Jar:", result.Jar);

    updateDashboard();

}

// --------------------------------
// Add Expense
// --------------------------------

function addExpense(amount) {

    amount = Number(amount);

    if (!amount || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    totalExpenses += amount;

    updateDashboard();

}

// --------------------------------
// Add Debit
// --------------------------------

function addDebit(amount) {

    amount = Number(amount);

    if (!amount || amount <= 0) {
        alert("Please enter a valid debit amount.");
        return;
    }

    totalDebit += amount;

    updateDashboard();

}

// --------------------------------
// Pay Debit
// --------------------------------

function payDebit(amount) {

    amount = Number(amount);

    if (!amount || amount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    const remainingDebit = totalDebit - totalDebitPaid;

    if (amount > remainingDebit) {
        alert("Payment cannot be greater than remaining debit.");
        return;
    }

    totalDebitPaid += amount;

    updateDashboard();

}

// --------------------------------
// Remaining Debit
// --------------------------------

function getRemainingDebit() {

    return totalDebit - totalDebitPaid;

}

// --------------------------------
// Available Balance
// --------------------------------

function getAvailableBalance() {

    return totalIncome - totalExpenses - totalDebitPaid;

}

// --------------------------------
// Dashboard Update
// --------------------------------

function updateDashboard() {

    const incomeElement =
        document.querySelector(".income");

    const expenseElement =
        document.querySelector(".expense");

    const debitElement =
        document.querySelector(".debit");

    const balanceElement =
        document.querySelector(".balance");

    if (incomeElement) {
        incomeElement.innerText =
            "₹" + totalIncome.toFixed(2);
    }

    if (expenseElement) {
        expenseElement.innerText =
            "₹" + totalExpenses.toFixed(2);
    }

    if (debitElement) {
        debitElement.innerText =
            "₹" + getRemainingDebit().toFixed(2);
    }

    if (balanceElement) {
        balanceElement.innerText =
            "₹" + getAvailableBalance().toFixed(2);
    }

}

// --------------------------------
// Test
// --------------------------------

console.log("Finance Tracker Loaded Successfully");
```
