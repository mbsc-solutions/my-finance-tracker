let totalIncome = 0;

let totalExpenses = 0;

let totalDebit = 0;

let totalDebitPaid = 0;


// ======================================
// INCOME ALLOCATION PERCENTAGES
// ======================================

const allocation = {

    Personal: 30,

    Emergency: 20,

    Savings: 20,

    PPF: 20,

    Jar: 10

};


// ======================================
// ALLOCATION BALANCES
// ======================================

let personalBalance = 0;

let emergencyBalance = 0;

let savingsBalance = 0;

let ppfBalance = 0;

let jarBalance = 0;


// ======================================
// ADD INCOME
// ======================================

function addIncome(amount) {

    amount = Number(amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid income amount.");

        return;

    }


    // Add to total income

    totalIncome += amount;


    // Automatically allocate income

    personalBalance +=
        amount * allocation.Personal / 100;


    emergencyBalance +=
        amount * allocation.Emergency / 100;


    savingsBalance +=
        amount * allocation.Savings / 100;


    ppfBalance +=
        amount * allocation.PPF / 100;


    jarBalance +=
        amount * allocation.Jar / 100;


    updateDashboard();

}


// ======================================
// ADD EXPENSE
// ======================================

function addExpense(amount) {

    amount = Number(amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid expense amount.");

        return;

    }


    // Expense is deducted ONLY from Personal

    if (amount > personalBalance) {

        alert(
            "Personal allocation lo sufficient balance ledu.\n\n" +
            "Personal Balance: ₹" +
            personalBalance.toFixed(2)
        );

        return;

    }


    personalBalance -= amount;


    totalExpenses += amount;


    updateDashboard();

}


// ======================================
// ADD DEBIT
// ======================================

function addDebit(amount) {

    amount = Number(amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid debit amount.");

        return;

    }


    // Debit is completely separate

    totalDebit += amount;


    updateDashboard();

}


// ======================================
// PAY DEBIT
// ======================================

function payDebit(amount) {

    amount = Number(amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid payment amount.");

        return;

    }


    const remainingDebit =
        totalDebit - totalDebitPaid;


    if (remainingDebit <= 0) {

        alert("No outstanding debit.");

        return;

    }


    if (amount > remainingDebit) {

        alert(
            "Payment cannot be greater than outstanding debit.\n\n" +
            "Outstanding Debit: ₹" +
            remainingDebit.toFixed(2)
        );

        return;

    }


    totalDebitPaid += amount;


    updateDashboard();

}


// ======================================
// REMAINING DEBIT
// ======================================

function getRemainingDebit() {

    return Math.max(
        0,
        totalDebit - totalDebitPaid
    );

}


// ======================================
// AVAILABLE BALANCE
// ======================================

function getAvailableBalance() {

    return Math.max(
        0,
        totalIncome -
        totalExpenses -
        totalDebitPaid
    );

}


// ======================================
// UPDATE DASHBOARD
// ======================================

function updateDashboard() {


    // ------------------------------
    // TOTAL INCOME
    // ------------------------------

    const incomeElement =
        document.getElementById("totalIncome");


    if (incomeElement) {

        incomeElement.textContent =
            "₹" + totalIncome.toFixed(2);

    }


    // ------------------------------
    // TOTAL EXPENSES
    // ------------------------------

    const expenseElement =
        document.getElementById("totalExpenses");


    if (expenseElement) {

        expenseElement.textContent =
            "₹" + totalExpenses.toFixed(2);

    }


    // ------------------------------
    // DEBIT OUTSTANDING
    // ------------------------------

    const debitElement =
        document.getElementById("debitOutstanding");


    if (debitElement) {

        debitElement.textContent =
            "₹" +
            getRemainingDebit().toFixed(2);

    }


    // ------------------------------
    // AVAILABLE BALANCE
    // ------------------------------

    const balanceElement =
        document.getElementById("availableBalance");


    if (balanceElement) {

        balanceElement.textContent =
            "₹" +
            getAvailableBalance().toFixed(2);

    }


    // ------------------------------
    // PERSONAL
    // ------------------------------

    const personalElement =
        document.getElementById("personalAmount");


    if (personalElement) {

        personalElement.textContent =
            "₹" +
            personalBalance.toFixed(2);

    }


    // ------------------------------
    // EMERGENCY
    // ------------------------------

    const emergencyElement =
        document.getElementById("emergencyAmount");


    if (emergencyElement) {

        emergencyElement.textContent =
            "₹" +
            emergencyBalance.toFixed(2);

    }


    // ------------------------------
    // SAVINGS
    // ------------------------------

    const savingsElement =
        document.getElementById("savingsAmount");


    if (savingsElement) {

        savingsElement.textContent =
            "₹" +
            savingsBalance.toFixed(2);

    }


    // ------------------------------
    // PPF
    // ------------------------------

    const ppfElement =
        document.getElementById("ppfAmount");


    if (ppfElement) {

        ppfElement.textContent =
            "₹" +
            ppfBalance.toFixed(2);

    }


    // ------------------------------
    // JAR
    // ------------------------------

    const jarElement =
        document.getElementById("jarAmount");


    if (jarElement) {

        jarElement.textContent =
            "₹" +
            jarBalance.toFixed(2);

    }

}
