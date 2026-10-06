let totalIncome = 0;
let totalExpenses = 0;
let totalDebit = 0;
let totalDebitPaid = 0;


// =========================
// ADD INCOME
// =========================
function addIncome(amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    totalIncome = totalIncome + amount;

    updateDashboard();
}


// =========================
// ADD EXPENSE
// =========================
function addExpense(amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    totalExpenses = totalExpenses + amount;

    updateDashboard();
}


// =========================
// ADD DEBIT
// =========================
function addDebit(amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid debit amount.");
        return;
    }

    totalDebit = totalDebit + amount;

    updateDashboard();
}


// =========================
// PAY DEBIT
// =========================
function payDebit(amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    const remainingDebit = totalDebit - totalDebitPaid;

    if (remainingDebit <= 0) {
        alert("No outstanding debit.");
        return;
    }

    if (amount > remainingDebit) {
        alert("Payment is greater than outstanding debit.");
        return;
    }

    totalDebitPaid = totalDebitPaid + amount;

    updateDashboard();
}


// =========================
// REMAINING DEBIT
// =========================
function getRemainingDebit() {

    return Math.max(
        0,
        totalDebit - totalDebitPaid
    );
}


// =========================
// AVAILABLE BALANCE
// =========================
function getAvailableBalance() {

    return (
        totalIncome
        - totalExpenses
        - totalDebitPaid
    );
}


// =========================
// UPDATE DASHBOARD
// =========================
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

        incomeElement.textContent =
            "₹" + totalIncome.toFixed(2);
    }


    if (expenseElement) {

        expenseElement.textContent =
            "₹" + totalExpenses.toFixed(2);
    }


    if (debitElement) {

        debitElement.textContent =
            "₹" + getRemainingDebit().toFixed(2);
    }


    if (balanceElement) {

        balanceElement.textContent =
            "₹" + getAvailableBalance().toFixed(2);
    }

}
