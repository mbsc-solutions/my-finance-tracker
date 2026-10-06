let totalIncome = 0;
let totalExpenses = 0;

let totalDebit = 0;
let totalDebitPaid = 0;


// Income Allocation
const allocation = {
    Personal: 30,
    Emergency: 20,
    Savings: 20,
    PPF: 20,
    Jar: 10
};


// Add Income
function addIncome(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    // Income ONLY increases income
    totalIncome += amount;

    updateDashboard();
}


// Add Expense
function addExpense(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    totalExpenses += amount;

    updateDashboard();
}


// Add Debit
function addDebit(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid debit amount.");
        return;
    }

    // Debit is created here
    totalDebit += amount;

    updateDashboard();
}


// Pay Debit
function payDebit(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    const remainingDebit = totalDebit - totalDebitPaid;

    if (remainingDebit <= 0) {
        alert("There is no outstanding debit.");
        return;
    }

    if (amount > remainingDebit) {
        alert(
            "Payment cannot be greater than remaining debit.\n" +
            "Remaining Debit: ₹" + remainingDebit.toFixed(2)
        );
        return;
    }

    // ONLY debit payment increases paid debit
    totalDebitPaid += amount;

    updateDashboard();
}


// Remaining Debit
function getRemainingDebit() {

    return Math.max(
        0,
        totalDebit - totalDebitPaid
    );
}


// Available Balance
function getAvailableBalance() {

    return (
        totalIncome -
        totalExpenses -
        totalDebitPaid
    );

}


// Update Dashboard
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
