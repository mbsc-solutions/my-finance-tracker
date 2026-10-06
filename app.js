// ==========================================
// MY FINANCE TRACKER
// Income + Expenses + Debit
// ==========================================


// ==========================================
// DEFAULT DATA
// ==========================================

let debitOutstanding = 2250000;


// ==========================================
// INCOME ALLOCATION
// ==========================================

const allocation = {
    Personal: 30,
    Emergency: 20,
    Savings: 20,
    PPF: 20,
    Jar: 10
};


// ==========================================
// BALANCES
// ==========================================

let personalBalance = 0;
let emergencyBalance = 0;
let savingsBalance = 0;
let ppfBalance = 0;
let jarBalance = 0;


// ==========================================
// TOTALS
// ==========================================

let totalIncome = 0;
let totalExpenses = 0;
let totalDebitPaid = 0;


// ==========================================
// TRANSACTION HISTORY
// ==========================================

let transactions = [];


// ==========================================
// ADD INCOME
// ==========================================

function addIncome(
    amount,
    date,
    source,
    purpose
) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    if (!date) {
        alert("Please select income date.");
        return;
    }

    if (!source || source.trim() === "") {
        alert("Please enter income source.");
        return;
    }

    if (!purpose || purpose.trim() === "") {
        alert("Please enter income purpose.");
        return;
    }


    // --------------------------------------
    // ALLOCATE INCOME
    // --------------------------------------

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


    // --------------------------------------
    // TOTAL INCOME
    //
    // ONLY PERSONAL + EMERGENCY + SAVINGS
    // PPF + JAR NOT INCLUDED
    // --------------------------------------

    totalIncome =
        personalBalance +
        emergencyBalance +
        savingsBalance;


    // --------------------------------------
    // SAVE INCOME HISTORY
    // --------------------------------------

    transactions.push({

        id: Date.now(),

        type: "Income",

        amount: amount,

        date: date,

        source: source.trim(),

        purpose: purpose.trim()

    });


    updateDashboard();

    saveData();

}


// ==========================================
// ADD EXPENSE
// ==========================================

function addExpense(
    amount,
    date,
    allocationType,
    purpose
) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    if (!date) {
        alert("Please select expense date.");
        return;
    }

    if (
        allocationType !== "Personal" &&
        allocationType !== "Emergency" &&
        allocationType !== "Savings"
    ) {

        alert(
            "Expense can be taken only from Personal, Emergency or Savings."
        );

        return;
    }

    if (!purpose || purpose.trim() === "") {
        alert("Please enter expense purpose.");
        return;
    }


    // --------------------------------------
    // PERSONAL EXPENSE
    // --------------------------------------

    if (allocationType === "Personal") {

        if (amount > personalBalance) {

            alert(
                "Personal allocation lo sufficient balance ledu.\n\n" +
                "Available Personal Balance: ₹" +
                personalBalance.toFixed(2)
            );

            return;
        }

        personalBalance -= amount;

    }


    // --------------------------------------
    // EMERGENCY EXPENSE
    // --------------------------------------

    if (allocationType === "Emergency") {

        if (amount > emergencyBalance) {

            alert(
                "Emergency allocation lo sufficient balance ledu.\n\n" +
                "Available Emergency Balance: ₹" +
                emergencyBalance.toFixed(2)
            );

            return;
        }

        emergencyBalance -= amount;

    }


    // --------------------------------------
    // SAVINGS EXPENSE
    // --------------------------------------

    if (allocationType === "Savings") {

        if (amount > savingsBalance) {

            alert(
                "Savings allocation lo sufficient balance ledu.\n\n" +
                "Available Savings Balance: ₹" +
                savingsBalance.toFixed(2)
            );

            return;
        }

        savingsBalance -= amount;

    }


    // --------------------------------------
    // ADD TOTAL EXPENSES
    // --------------------------------------

    totalExpenses += amount;


    // --------------------------------------
    // TOTAL INCOME DISPLAY
    //
    // Personal + Emergency + Savings
    // --------------------------------------

    totalIncome =
        personalBalance +
        emergencyBalance +
        savingsBalance;


    // --------------------------------------
    // SAVE EXPENSE HISTORY
    // --------------------------------------

    transactions.push({

        id: Date.now(),

        type: "Expense",

        amount: amount,

        date: date,

        allocation: allocationType,

        purpose: purpose.trim()

    });


    updateDashboard();

    saveData();

}


// ==========================================
// ADD NEW DEBIT
// ==========================================

function addDebit(
    amount,
    date,
    person,
    dueDate,
    purpose
) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid debit amount.");

        return;
    }

    if (!date) {

        alert("Please select debit date.");

        return;
    }

    if (!person || person.trim() === "") {

        alert("Please enter person name.");

        return;
    }

    if (!purpose || purpose.trim() === "") {

        alert("Please enter debit purpose.");

        return;
    }


    // --------------------------------------
    // ADD TO DEBIT
    // --------------------------------------

    debitOutstanding += amount;


    // --------------------------------------
    // SAVE DEBIT HISTORY
    // --------------------------------------

    transactions.push({

        id: Date.now(),

        type: "Debit",

        amount: amount,

        date: date,

        person: person.trim(),

        dueDate: dueDate || "",

        purpose: purpose.trim()

    });


    updateDashboard();

    saveData();

}


// ==========================================
// PAY DEBIT
// ==========================================
// Debit payment is taken ONLY from PPF
// ==========================================

function payDebit(
    amount,
    date,
    person,
    purpose
) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid payment amount.");

        return;
    }

    if (!date) {

        alert("Please select payment date.");

        return;
    }

    if (!purpose || purpose.trim() === "") {

        alert("Please enter payment purpose.");

        return;
    }


    // --------------------------------------
    // CHECK DEBIT
    // --------------------------------------

    if (debitOutstanding <= 0) {

        alert("No outstanding debit.");

        return;
    }


    // --------------------------------------
    // PAYMENT CANNOT EXCEED DEBIT
    // --------------------------------------

    if (amount > debitOutstanding) {

        alert(
            "Payment cannot be greater than outstanding debit.\n\n" +
            "Outstanding Debit: ₹" +
            debitOutstanding.toFixed(2)
        );

        return;
    }


    // --------------------------------------
    // PAYMENT CANNOT EXCEED PPF
    // --------------------------------------

    if (amount > ppfBalance) {

        alert(
            "PPF balance lo sufficient amount ledu.\n\n" +
            "Available PPF Balance: ₹" +
            ppfBalance.toFixed(2)
        );

        return;
    }


    // --------------------------------------
    // DEDUCT FROM DEBIT
    // --------------------------------------

    debitOutstanding -= amount;


    // --------------------------------------
    // DEDUCT FROM PPF
    // --------------------------------------

    ppfBalance -= amount;


    // --------------------------------------
    // TOTAL DEBIT PAID
    // --------------------------------------

    totalDebitPaid += amount;


    // --------------------------------------
    // SAVE PAYMENT HISTORY
    // --------------------------------------

    transactions.push({

        id: Date.now(),

        type: "Debit Payment",

        amount: amount,

        date: date,

        person: person
            ? person.trim()
            : "",

        purpose: purpose.trim()

    });


    updateDashboard();

    saveData();

}


// ==========================================
// AVAILABLE BALANCE
// ==========================================

function getAvailableBalance() {

    // Available balance means
    // Personal + Emergency + Savings

    return Math.max(

        0,

        personalBalance +
        emergencyBalance +
        savingsBalance

    );

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {


    // --------------------------------------
    // TOTAL INCOME
    // --------------------------------------
    // Personal + Emergency + Savings ONLY
    // PPF + Jar excluded
    // --------------------------------------

    totalIncome =
        personalBalance +
        emergencyBalance +
        savingsBalance;


    const incomeElement =
        document.getElementById("totalIncome");

    if (incomeElement) {

        incomeElement.textContent =
            "₹" +
            totalIncome.toFixed(2);

    }


    // --------------------------------------
    // TOTAL EXPENSES
    // --------------------------------------

    const expenseElement =
        document.getElementById("totalExpenses");

    if (expenseElement) {

        expenseElement.textContent =
            "₹" +
            totalExpenses.toFixed(2);

    }


    // --------------------------------------
    // DEBIT OUTSTANDING
    // --------------------------------------

    const debitElement =
        document.getElementById("debitOutstanding");

    if (debitElement) {

        debitElement.textContent =
            "₹" +
            debitOutstanding.toFixed(2);

    }


    // --------------------------------------
    // AVAILABLE BALANCE
    // --------------------------------------

    const balanceElement =
        document.getElementById("availableBalance");

    if (balanceElement) {

        balanceElement.textContent =
            "₹" +
            getAvailableBalance().toFixed(2);

    }


    // --------------------------------------
    // PERSONAL
    // --------------------------------------

    const personalElement =
        document.getElementById("personalAmount");

    if (personalElement) {

        personalElement.textContent =
            "₹" +
            personalBalance.toFixed(2);

    }


    // --------------------------------------
    // EMERGENCY
    // --------------------------------------

    const emergencyElement =
        document.getElementById("emergencyAmount");

    if (emergencyElement) {

        emergencyElement.textContent =
            "₹" +
            emergencyBalance.toFixed(2);

    }


    // --------------------------------------
    // SAVINGS
    // --------------------------------------

    const savingsElement =
        document.getElementById("savingsAmount");

    if (savingsElement) {

        savingsElement.textContent =
            "₹" +
            savingsBalance.toFixed(2);

    }


    // --------------------------------------
    // PPF
    // --------------------------------------

    const ppfElement =
        document.getElementById("ppfAmount");

    if (ppfElement) {

        ppfElement.textContent =
            "₹" +
            ppfBalance.toFixed(2);

    }


    // --------------------------------------
    // JAR
    // --------------------------------------

    const jarElement =
        document.getElementById("jarAmount");

    if (jarElement) {

        jarElement.textContent =
            "₹" +
            jarBalance.toFixed(2);

    }


    // --------------------------------------
    // TRANSACTION HISTORY
    // --------------------------------------

    displayTransactions();

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    const historyElement =
        document.getElementById(
            "transactionHistory"
        );


    if (!historyElement) {

        return;

    }


    if (transactions.length === 0) {

        historyElement.innerHTML =
            "<p>No transactions yet.</p>";

        return;

    }


    // --------------------------------------
    // SORT BY DATE
    // --------------------------------------

    const sortedTransactions =
        [...transactions].sort(

            (a, b) => {

                const dateA =
                    new Date(a.date);

                const dateB =
                    new Date(b.date);

                return dateB - dateA;

            }

        );


    // --------------------------------------
    // DISPLAY
    // --------------------------------------

    historyElement.innerHTML =

        sortedTransactions
            .map(transaction => {

                let extraInfo = "";


                // Source
                if (transaction.source) {

                    extraInfo +=

                        `<div>
                            <strong>Source:</strong>
                            ${transaction.source}
                        </div>`;

                }


                // Allocation
                if (transaction.allocation) {

                    extraInfo +=

                        `<div>
                            <strong>From:</strong>
                            ${transaction.allocation}
                        </div>`;

                }


                // Person
                if (transaction.person) {

                    extraInfo +=

                        `<div>
                            <strong>Person:</strong>
                            ${transaction.person}
                        </div>`;

                }


                // Due Date
                if (transaction.dueDate) {

                    extraInfo +=

                        `<div>
                            <strong>Due Date:</strong>
                            ${transaction.dueDate}
                        </div>`;

                }


                return `

                    <div class="transaction-item">

                        <div>
                            <strong>
                                ${transaction.type}
                            </strong>
                        </div>

                        <div>
                            ₹${Number(
                                transaction.amount
                            ).toFixed(2)}
                        </div>

                        <div>
                            <strong>Date:</strong>
                            ${transaction.date}
                        </div>

                        <div>
                            <strong>Purpose:</strong>
                            ${transaction.purpose || "-"}
                        </div>

                        ${extraInfo}

                    </div>

                `;

            })

            .join("");

}


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    const data = {

        debitOutstanding,

        totalIncome,

        totalExpenses,

        totalDebitPaid,

        personalBalance,

        emergencyBalance,

        savingsBalance,

        ppfBalance,

        jarBalance,

        transactions

    };


    localStorage.setItem(

        "myFinanceTrackerData",

        JSON.stringify(data)

    );

}


// ==========================================
// LOAD DATA
// ==========================================

function loadData() {

    const savedData =
        localStorage.getItem(
            "myFinanceTrackerData"
        );


    // --------------------------------------
    // FIRST TIME OPEN
    // --------------------------------------

    if (!savedData) {

        updateDashboard();

        return;

    }


    try {

        const data =
            JSON.parse(savedData);


        debitOutstanding =
            Number(
                data.debitOutstanding
                ?? 2250000
            );


        totalExpenses =
            Number(
                data.totalExpenses
                ?? 0
            );


        totalDebitPaid =
            Number(
                data.totalDebitPaid
                ?? 0
            );


        personalBalance =
            Number(
                data.personalBalance
                ?? 0
            );


        emergencyBalance =
            Number(
                data.emergencyBalance
                ?? 0
            );


        savingsBalance =
            Number(
                data.savingsBalance
                ?? 0
            );


        ppfBalance =
            Number(
                data.ppfBalance
                ?? 0
            );


        jarBalance =
            Number(
                data.jarBalance
                ?? 0
            );


        transactions =
            Array.isArray(
                data.transactions
            )
                ? data.transactions
                : [];


        // ----------------------------------
        // TOTAL INCOME
        // Personal + Emergency + Savings
        // ----------------------------------

        totalIncome =
            personalBalance +
            emergencyBalance +
            savingsBalance;


    } catch (error) {

        console.error(
            "Data loading error:",
            error
        );

    }


    updateDashboard();

}


// ==========================================
// START APP
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadData();

    }

);
