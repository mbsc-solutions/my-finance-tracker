// ==========================================
// MY FINANCE TRACKER
// Income + Expenses + Debit
// ==========================================


// ==========================================
// DEFAULT DATA
// ==========================================

const DEFAULT_DEBIT = 2250000;

let debitOutstanding = DEFAULT_DEBIT;


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

    transactions.push({

        id: Date.now(),

        type: "Income",

        amount: amount,

        date: date,

        source: source.trim(),

        purpose: purpose.trim()

    });

    rebuildDataFromTransactions();

    saveData();

    updateDashboard();

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
    // CHECK AVAILABLE ALLOCATION
    // --------------------------------------

    rebuildDataFromTransactions();


    let availableBalance = 0;


    if (allocationType === "Personal") {

        availableBalance = personalBalance;

    }


    if (allocationType === "Emergency") {

        availableBalance = emergencyBalance;

    }


    if (allocationType === "Savings") {

        availableBalance = savingsBalance;

    }


    if (amount > availableBalance + 0.001) {

        alert(

            allocationType +
            " allocation lo sufficient balance ledu.\n\n" +

            "Available Balance: ₹" +
            availableBalance.toFixed(2)

        );

        return;
    }


    // --------------------------------------
    // ADD EXPENSE
    // --------------------------------------

    transactions.push({

        id: Date.now(),

        type: "Expense",

        amount: amount,

        date: date,

        allocation: allocationType,

        purpose: purpose.trim()

    });


    rebuildDataFromTransactions();

    saveData();

    updateDashboard();

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


    transactions.push({

        id: Date.now(),

        type: "Debit",

        amount: amount,

        date: date,

        person: person.trim(),

        dueDate: dueDate || "",

        purpose: purpose.trim()

    });


    rebuildDataFromTransactions();

    saveData();

    updateDashboard();

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


    rebuildDataFromTransactions();


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

    if (amount > debitOutstanding + 0.001) {

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

    if (amount > ppfBalance + 0.001) {

        alert(

            "PPF balance lo sufficient amount ledu.\n\n" +

            "Available PPF Balance: ₹" +
            ppfBalance.toFixed(2)

        );

        return;
    }


    // --------------------------------------
    // ADD DEBIT PAYMENT
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


    rebuildDataFromTransactions();

    saveData();

    updateDashboard();

}


// ==========================================
// REBUILD ALL DATA
// ==========================================
// Everything is calculated again from
// transaction history.
// ==========================================

function rebuildDataFromTransactions() {


    // --------------------------------------
    // RESET BALANCES
    // --------------------------------------

    personalBalance = 0;

    emergencyBalance = 0;

    savingsBalance = 0;

    ppfBalance = 0;

    jarBalance = 0;


    // --------------------------------------
    // RESET TOTALS
    // --------------------------------------

    totalIncome = 0;

    totalExpenses = 0;

    totalDebitPaid = 0;


    // --------------------------------------
    // RESET DEBIT
    // --------------------------------------

    debitOutstanding = DEFAULT_DEBIT;


    // --------------------------------------
    // PROCESS TRANSACTIONS
    // --------------------------------------

    transactions.forEach(transaction => {


        const amount =
            Number(transaction.amount) || 0;


        // ==================================
        // INCOME
        // ==================================

        if (transaction.type === "Income") {


            // IMPORTANT:
            // Total Income is actual income.
            // Expenses will NOT reduce it.

            totalIncome += amount;


            // ----------------------------------
            // ALLOCATION
            // ----------------------------------

            personalBalance +=
                amount *
                allocation.Personal /
                100;


            emergencyBalance +=
                amount *
                allocation.Emergency /
                100;


            savingsBalance +=
                amount *
                allocation.Savings /
                100;


            ppfBalance +=
                amount *
                allocation.PPF /
                100;


            jarBalance +=
                amount *
                allocation.Jar /
                100;

        }


        // ==================================
        // EXPENSE
        // ==================================

        if (transaction.type === "Expense") {


            totalExpenses += amount;


            // ----------------------------------
            // PERSONAL EXPENSE
            // ----------------------------------

            if (
                transaction.allocation === "Personal"
            ) {

                personalBalance -= amount;

            }


            // ----------------------------------
            // EMERGENCY EXPENSE
            // ----------------------------------

            if (
                transaction.allocation === "Emergency"
            ) {

                emergencyBalance -= amount;

            }


            // ----------------------------------
            // SAVINGS EXPENSE
            // ----------------------------------

            if (
                transaction.allocation === "Savings"
            ) {

                savingsBalance -= amount;

            }


            // IMPORTANT:
            // PPF and Jar are NOT reduced
            // by normal expenses.

        }


        // ==================================
        // NEW DEBIT
        // ==================================

        if (transaction.type === "Debit") {

            debitOutstanding += amount;

        }


        // ==================================
        // DEBIT PAYMENT
        // ==================================

        if (
            transaction.type === "Debit Payment"
        ) {


            // Reduce outstanding debit

            debitOutstanding -= amount;


            // Payment comes ONLY from PPF

            ppfBalance -= amount;


            // Total debit payment

            totalDebitPaid += amount;

        }

    });


    // --------------------------------------
    // SMALL DECIMAL CORRECTION
    // --------------------------------------

    if (Math.abs(personalBalance) < 0.001) {

        personalBalance = 0;

    }

    if (Math.abs(emergencyBalance) < 0.001) {

        emergencyBalance = 0;

    }

    if (Math.abs(savingsBalance) < 0.001) {

        savingsBalance = 0;

    }

    if (Math.abs(ppfBalance) < 0.001) {

        ppfBalance = 0;

    }

    if (Math.abs(jarBalance) < 0.001) {

        jarBalance = 0;

    }

}


// ==========================================
// AVAILABLE BALANCE
// ==========================================
// Only Personal + Emergency + Savings
// ==========================================

function getAvailableBalance() {

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
    // RECALCULATE
    // --------------------------------------

    rebuildDataFromTransactions();


    // --------------------------------------
    // TOTAL INCOME
    // --------------------------------------

    const incomeElement =
        document.getElementById(
            "totalIncome"
        );


    if (incomeElement) {

        incomeElement.textContent =
            "₹" +
            totalIncome.toFixed(2);

    }


    // --------------------------------------
    // TOTAL EXPENSES
    // --------------------------------------

    const expenseElement =
        document.getElementById(
            "totalExpenses"
        );


    if (expenseElement) {

        expenseElement.textContent =
            "₹" +
            totalExpenses.toFixed(2);

    }


    // --------------------------------------
    // DEBIT OUTSTANDING
    // --------------------------------------

    const debitElement =
        document.getElementById(
            "debitOutstanding"
        );


    if (debitElement) {

        debitElement.textContent =
            "₹" +
            Math.max(0, debitOutstanding)
                .toFixed(2);

    }


    // --------------------------------------
    // AVAILABLE BALANCE
    // --------------------------------------

    const balanceElement =
        document.getElementById(
            "availableBalance"
        );


    if (balanceElement) {

        balanceElement.textContent =
            "₹" +
            getAvailableBalance().toFixed(2);

    }


    // --------------------------------------
    // PERSONAL
    // --------------------------------------

    const personalElement =
        document.getElementById(
            "personalAmount"
        );


    if (personalElement) {

        personalElement.textContent =
            "₹" +
            Math.max(0, personalBalance)
                .toFixed(2);

    }


    // --------------------------------------
    // EMERGENCY
    // --------------------------------------

    const emergencyElement =
        document.getElementById(
            "emergencyAmount"
        );


    if (emergencyElement) {

        emergencyElement.textContent =
            "₹" +
            Math.max(0, emergencyBalance)
                .toFixed(2);

    }


    // --------------------------------------
    // SAVINGS
    // --------------------------------------

    const savingsElement =
        document.getElementById(
            "savingsAmount"
        );


    if (savingsElement) {

        savingsElement.textContent =
            "₹" +
            Math.max(0, savingsBalance)
                .toFixed(2);

    }


    // --------------------------------------
    // PPF
    // --------------------------------------

    const ppfElement =
        document.getElementById(
            "ppfAmount"
        );


    if (ppfElement) {

        ppfElement.textContent =
            "₹" +
            Math.max(0, ppfBalance)
                .toFixed(2);

    }


    // --------------------------------------
    // JAR
    // --------------------------------------

    const jarElement =
        document.getElementById(
            "jarAmount"
        );


    if (jarElement) {

        jarElement.textContent =
            "₹" +
            Math.max(0, jarBalance)
                .toFixed(2);

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


                // ----------------------------------
                // SOURCE
                // ----------------------------------

                if (transaction.source) {

                    extraInfo +=

                        `<div>
                            <strong>Source:</strong>
                            ${escapeHTML(transaction.source)}
                        </div>`;

                }


                // ----------------------------------
                // ALLOCATION
                // ----------------------------------

                if (transaction.allocation) {

                    extraInfo +=

                        `<div>
                            <strong>From:</strong>
                            ${escapeHTML(transaction.allocation)}
                        </div>`;

                }


                // ----------------------------------
                // PERSON
                // ----------------------------------

                if (transaction.person) {

                    extraInfo +=

                        `<div>
                            <strong>Person:</strong>
                            ${escapeHTML(transaction.person)}
                        </div>`;

                }


                // ----------------------------------
                // DUE DATE
                // ----------------------------------

                if (transaction.dueDate) {

                    extraInfo +=

                        `<div>
                            <strong>Due Date:</strong>
                            ${escapeHTML(transaction.dueDate)}
                        </div>`;

                }


                // ----------------------------------
                // EDIT + DELETE
                // ----------------------------------

                let actionButtons = `

                    <div class="mt-3 d-flex gap-2 flex-wrap">

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editTransaction(${transaction.id})">

                            ✏️ Edit

                        </button>


                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteTransaction(${transaction.id})">

                            🗑️ Delete

                        </button>

                    </div>

                `;


                // ----------------------------------
                // PAY DEBIT
                // ----------------------------------

                let payButton = "";


                if (
                    transaction.type === "Debit" &&
                    debitOutstanding > 0
                ) {

                    const safePerson =
                        escapeForAttribute(
                            transaction.person || ""
                        );


                    payButton = `

                        <div class="mt-2">

                            <button
                                class="btn btn-primary btn-sm pay-btn"
                                onclick="payDebitPrompt('${safePerson}')">

                                💳 Pay Debit

                            </button>

                        </div>

                    `;

                }


                // ----------------------------------
                // TYPE
                // ----------------------------------

                let typeClass = "";


                if (transaction.type === "Income") {

                    typeClass = "text-success";

                }

                else if (transaction.type === "Expense") {

                    typeClass = "text-danger";

                }

                else if (
                    transaction.type === "Debit" ||
                    transaction.type === "Debit Payment"
                ) {

                    typeClass = "text-primary";

                }


                // ----------------------------------
                // FINAL CARD
                // ----------------------------------

                return `

                    <div class="transaction-item">

                        <div>

                            <strong class="${typeClass}">

                                ${escapeHTML(transaction.type)}

                            </strong>

                        </div>


                        <div>

                            ₹${Number(
                                transaction.amount
                            ).toFixed(2)}

                        </div>


                        <div>

                            <strong>Date:</strong>
                            ${escapeHTML(transaction.date)}

                        </div>


                        <div>

                            <strong>Purpose:</strong>
                            ${escapeHTML(
                                transaction.purpose || "-"
                            )}

                        </div>


                        ${extraInfo}


                        ${payButton}


                        ${actionButtons}

                    </div>

                `;

            })

            .join("");

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// ESCAPE TEXT FOR BUTTON ATTRIBUTE
// ==========================================

function escapeForAttribute(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}


// ==========================================
// EDIT TRANSACTION
// ==========================================

function editTransaction(id) {


    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        alert("Transaction not found.");

        return;

    }


    // ======================================
    // EDIT INCOME
    // ======================================

    if (transaction.type === "Income") {


        const oldTransaction =
            { ...transaction };


        const amount =
            prompt(
                "Enter new Income Amount:",
                transaction.amount
            );


        if (amount === null) {

            return;

        }


        const newAmount =
            Number(amount);


        if (
            !Number.isFinite(newAmount) ||
            newAmount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        const date =
            prompt(
                "Enter Income Date (YYYY-MM-DD):",
                transaction.date
            );


        if (date === null || !date) {

            return;

        }


        const source =
            prompt(
                "Enter Income Source:",
                transaction.source || ""
            );


        if (
            source === null ||
            !source.trim()
        ) {

            return;

        }


        const purpose =
            prompt(
                "Enter Income Purpose:",
                transaction.purpose || ""
            );


        if (
            purpose === null ||
            !purpose.trim()
        ) {

            return;

        }


        transaction.amount =
            newAmount;

        transaction.date =
            date;

        transaction.source =
            source.trim();

        transaction.purpose =
            purpose.trim();


        rebuildDataFromTransactions();

        saveData();

        updateDashboard();

        return;

    }


    // ======================================
    // EDIT EXPENSE
    // ======================================

    if (transaction.type === "Expense") {


        const oldTransaction =
            { ...transaction };


        const amount =
            prompt(
                "Enter new Expense Amount:",
                transaction.amount
            );


        if (amount === null) {

            return;

        }


        const newAmount =
            Number(amount);


        if (
            !Number.isFinite(newAmount) ||
            newAmount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        const date =
            prompt(
                "Enter Expense Date (YYYY-MM-DD):",
                transaction.date
            );


        if (date === null || !date) {

            return;

        }


        const allocationChoice =
            prompt(

                "Select Expense Allocation:\n\n" +

                "1 = Personal\n" +
                "2 = Emergency\n" +
                "3 = Savings\n\n" +

                "Enter 1, 2 or 3:",

                transaction.allocation === "Personal"
                    ? "1"
                    : transaction.allocation === "Emergency"
                        ? "2"
                        : "3"

            );


        if (
            allocationChoice === null
        ) {

            return;

        }


        let newAllocation = "";


        if (
            allocationChoice === "1"
        ) {

            newAllocation =
                "Personal";

        }

        else if (
            allocationChoice === "2"
        ) {

            newAllocation =
                "Emergency";

        }

        else if (
            allocationChoice === "3"
        ) {

            newAllocation =
                "Savings";

        }

        else {

            alert(
                "Please enter 1, 2 or 3."
            );

            return;

        }


        const purpose =
            prompt(
                "Enter Expense Purpose:",
                transaction.purpose || ""
            );


        if (
            purpose === null ||
            !purpose.trim()
        ) {

            return;

        }


        // ----------------------------------
        // UPDATE TEMPORARILY
        // ----------------------------------

        transaction.amount =
            newAmount;

        transaction.date =
            date;

        transaction.allocation =
            newAllocation;

        transaction.purpose =
            purpose.trim();


        rebuildDataFromTransactions();


        // ----------------------------------
        // VALIDATE
        // ----------------------------------

        if (
            personalBalance < -0.001 ||
            emergencyBalance < -0.001 ||
            savingsBalance < -0.001
        ) {


            Object.assign(
                transaction,
                oldTransaction
            );


            rebuildDataFromTransactions();


            alert(
                "This edit cannot be completed because the selected allocation does not have sufficient balance."
            );


            return;

        }


        saveData();

        updateDashboard();

        return;

    }


    // ======================================
    // EDIT DEBIT
    // ======================================

    if (transaction.type === "Debit") {


        const oldTransaction =
            { ...transaction };


        const amount =
            prompt(
                "Enter new Debit Amount:",
                transaction.amount
            );


        if (amount === null) {

            return;

        }


        const newAmount =
            Number(amount);


        if (
            !Number.isFinite(newAmount) ||
            newAmount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        const date =
            prompt(
                "Enter Debit Date (YYYY-MM-DD):",
                transaction.date
            );


        if (date === null || !date) {

            return;

        }


        const person =
            prompt(
                "Enter Person Name:",
                transaction.person || ""
            );


        if (
            person === null ||
            !person.trim()
        ) {

            return;

        }


        const dueDate =
            prompt(
                "Enter Due Date (YYYY-MM-DD) or leave blank:",
                transaction.dueDate || ""
            );


        if (dueDate === null) {

            return;

        }


        const purpose =
            prompt(
                "Enter Debit Purpose:",
                transaction.purpose || ""
            );


        if (
            purpose === null ||
            !purpose.trim()
        ) {

            return;

        }


        transaction.amount =
            newAmount;

        transaction.date =
            date;

        transaction.person =
            person.trim();

        transaction.dueDate =
            dueDate;

        transaction.purpose =
            purpose.trim();


        rebuildDataFromTransactions();


        // ----------------------------------
        // VALIDATE DEBIT
        // ----------------------------------

        if (debitOutstanding < -0.001) {


            Object.assign(
                transaction,
                oldTransaction
            );


            rebuildDataFromTransactions();


            alert(
                "Debit edit is not possible because existing payments are greater than the new debit amount."
            );


            return;

        }


        saveData();

        updateDashboard();

        return;

    }


    // ======================================
    // EDIT DEBIT PAYMENT
    // ======================================

    if (
        transaction.type ===
        "Debit Payment"
    ) {


        const oldTransaction =
            { ...transaction };


        const amount =
            prompt(
                "Enter new Debit Payment Amount:",
                transaction.amount
            );


        if (amount === null) {

            return;

        }


        const newAmount =
            Number(amount);


        if (
            !Number.isFinite(newAmount) ||
            newAmount <= 0
        ) {

            alert(
                "Please enter a valid payment amount."
            );

            return;

        }


        const date =
            prompt(
                "Enter Payment Date (YYYY-MM-DD):",
                transaction.date
            );


        if (date === null || !date) {

            return;

        }


        const person =
            prompt(
                "Enter Person Name:",
                transaction.person || ""
            );


        if (person === null) {

            return;

        }


        const purpose =
            prompt(
                "Enter Payment Purpose:",
                transaction.purpose || ""
            );


        if (
            purpose === null ||
            !purpose.trim()
        ) {

            return;

        }


        transaction.amount =
            newAmount;

        transaction.date =
            date;

        transaction.person =
            person.trim();

        transaction.purpose =
            purpose.trim();


        rebuildDataFromTransactions();


        // ----------------------------------
        // CHECK DEBIT
        // ----------------------------------

        if (debitOutstanding < -0.001) {


            Object.assign(
                transaction,
                oldTransaction
            );


            rebuildDataFromTransactions();


            alert(
                "Payment cannot be greater than the available debit."
            );


            return;

        }


        // ----------------------------------
        // CHECK PPF
        // ----------------------------------

        if (ppfBalance < -0.001) {


            Object.assign(
                transaction,
                oldTransaction
            );


            rebuildDataFromTransactions();


            alert(
                "This payment cannot be completed because PPF balance is insufficient."
            );


            return;

        }


        saveData();

        updateDashboard();

        return;

    }

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {


    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        alert(
            "Transaction not found."
        );

        return;

    }


    const confirmed =
        confirm(

            "Are you sure you want to delete this transaction?\n\n" +

            transaction.type +
            " - ₹" +
            Number(
                transaction.amount
            ).toFixed(2)

        );


    if (!confirmed) {

        return;

    }


    const oldTransactions =
        [...transactions];


    transactions =
        transactions.filter(
            item => item.id !== id
        );


    rebuildDataFromTransactions();


    // --------------------------------------
    // SAFETY CHECK
    // --------------------------------------

    if (
        personalBalance < -0.001 ||
        emergencyBalance < -0.001 ||
        savingsBalance < -0.001 ||
        ppfBalance < -0.001 ||
        debitOutstanding < -0.001
    ) {


        transactions =
            oldTransactions;


        rebuildDataFromTransactions();


        alert(
            "This transaction cannot be deleted because other transactions depend on it."
        );


        return;

    }


    saveData();

    updateDashboard();

}


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {


    rebuildDataFromTransactions();


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

        rebuildDataFromTransactions();

        updateDashboard();

        return;

    }


    try {


        const data =
            JSON.parse(savedData);


        transactions =
            Array.isArray(
                data.transactions
            )
                ? data.transactions
                : [];


        // ----------------------------------
        // Rebuild from transaction history
        // ----------------------------------

        rebuildDataFromTransactions();

    }


    catch (error) {


        console.error(
            "Data loading error:",
            error
        );


        transactions = [];


        rebuildDataFromTransactions();

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
