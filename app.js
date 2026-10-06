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
    purpose
) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid income amount.");
        return;

    }

    if (!date) {

        alert("Please enter income date.");
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

        alert("Please enter expense date.");

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
    purpose
) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid debit amount.");

        return;

    }

    if (!date) {

        alert("Please enter debit date.");

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

        purpose: purpose.trim()

    });


    rebuildDataFromTransactions();

    saveData();

    updateDashboard();

}


// ==========================================
// REBUILD ALL DATA
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

            totalIncome += amount;


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


            if (
                transaction.allocation === "Personal"
            ) {

                personalBalance -= amount;

            }


            if (
                transaction.allocation === "Emergency"
            ) {

                emergencyBalance -= amount;

            }


            if (
                transaction.allocation === "Savings"
            ) {

                savingsBalance -= amount;

            }

        }


        // ==================================
        // DEBIT
        // ==================================

        if (transaction.type === "Debit") {

            debitOutstanding += amount;

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

function getAvailableBalance() {

    return Math.max(

        0,

        personalBalance +
        emergencyBalance +
        savingsBalance

    );

}


// ==========================================
// DATE FORMAT
// YYYY-MM-DD → DD-MM-YYYY
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }

    const parts =
        String(dateString).split("-");


    if (parts.length === 3) {

        return (

            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]

        );

    }


    return dateString;

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    rebuildDataFromTransactions();


    const incomeElement =
        document.getElementById(
            "totalIncome"
        );


    if (incomeElement) {

        incomeElement.textContent =
            "₹" +
            totalIncome.toFixed(2);

    }


    const expenseElement =
        document.getElementById(
            "totalExpenses"
        );


    if (expenseElement) {

        expenseElement.textContent =
            "₹" +
            totalExpenses.toFixed(2);

    }


    const debitElement =
        document.getElementById(
            "debitOutstanding"
        );


    if (debitElement) {

        debitElement.textContent =
            "₹" +
            Math.max(
                0,
                debitOutstanding
            ).toFixed(2);

    }


    const balanceElement =
        document.getElementById(
            "availableBalance"
        );


    if (balanceElement) {

        balanceElement.textContent =
            "₹" +
            getAvailableBalance().toFixed(2);

    }


    const personalElement =
        document.getElementById(
            "personalAmount"
        );


    if (personalElement) {

        personalElement.textContent =
            "₹" +
            Math.max(
                0,
                personalBalance
            ).toFixed(2);

    }


    const emergencyElement =
        document.getElementById(
            "emergencyAmount"
        );


    if (emergencyElement) {

        emergencyElement.textContent =
            "₹" +
            Math.max(
                0,
                emergencyBalance
            ).toFixed(2);

    }


    const savingsElement =
        document.getElementById(
            "savingsAmount"
        );


    if (savingsElement) {

        savingsElement.textContent =
            "₹" +
            Math.max(
                0,
                savingsBalance
            ).toFixed(2);

    }


    const ppfElement =
        document.getElementById(
            "ppfAmount"
        );


    if (ppfElement) {

        ppfElement.textContent =
            "₹" +
            Math.max(
                0,
                ppfBalance
            ).toFixed(2);

    }


    const jarElement =
        document.getElementById(
            "jarAmount"
        );


    if (jarElement) {

        jarElement.textContent =
            "₹" +
            Math.max(
                0,
                jarBalance
            ).toFixed(2);

    }


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


    const validTransactions =
        transactions.filter(
            transaction =>

                transaction.type === "Income" ||
                transaction.type === "Expense" ||
                transaction.type === "Debit"

        );


    if (validTransactions.length === 0) {

        historyElement.innerHTML =
            "<p>No transactions yet.</p>";

        return;

    }


    // --------------------------------------
    // SORT BY DATE
    // --------------------------------------

    const sortedTransactions =
        [...validTransactions].sort(

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
                // ALLOCATION
                // ----------------------------------

                if (transaction.allocation) {

                    extraInfo +=

                        `<div>
                            <strong>From:</strong>
                            ${escapeHTML(
                                transaction.allocation
                            )}
                        </div>`;

                }


                // ----------------------------------
                // ACTION BUTTONS
                // ----------------------------------

                const actionButtons = `

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
                // TYPE CLASS
                // ----------------------------------

                let typeClass = "";


                if (
                    transaction.type === "Income"
                ) {

                    typeClass = "text-success";

                }

                else if (
                    transaction.type === "Expense"
                ) {

                    typeClass = "text-danger";

                }

                else if (
                    transaction.type === "Debit"
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

                                ${escapeHTML(
                                    transaction.type
                                )}

                            </strong>

                        </div>


                        <div>

                            ₹${Number(
                                transaction.amount
                            ).toFixed(2)}

                        </div>


                        <div>

                            <strong>Date:</strong>
                            ${formatDate(
                                transaction.date
                            )}

                        </div>


                        <div>

                            <strong>Purpose:</strong>
                            ${escapeHTML(
                                transaction.purpose || "-"
                            )}

                        </div>


                        ${extraInfo}


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

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

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

        alert(
            "Transaction not found."
        );

        return;

    }


    // ======================================
    // EDIT INCOME
    // ======================================

    if (
        transaction.type === "Income"
    ) {

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

                "Enter Income Date (DD-MM-YYYY):",

                formatDate(
                    transaction.date
                )

            );


        if (
            date === null ||
            !date
        ) {

            return;

        }


        const storedDate =
            convertDateToStorage(date);


        if (!storedDate) {

            alert(
                "Please enter date in DD-MM-YYYY format.\nExample: 06-10-2026"
            );

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
            storedDate;

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

    if (
        transaction.type === "Expense"
    ) {

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

                "Enter Expense Date (DD-MM-YYYY):",

                formatDate(
                    transaction.date
                )

            );


        if (
            date === null ||
            !date
        ) {

            return;

        }


        const storedDate =
            convertDateToStorage(date);


        if (!storedDate) {

            alert(
                "Please enter date in DD-MM-YYYY format.\nExample: 06-10-2026"
            );

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


        transaction.amount =
            newAmount;

        transaction.date =
            storedDate;

        transaction.allocation =
            newAllocation;

        transaction.purpose =
            purpose.trim();


        rebuildDataFromTransactions();


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

    if (
        transaction.type === "Debit"
    ) {

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

                "Enter Debit Date (DD-MM-YYYY):",

                formatDate(
                    transaction.date
                )

            );


        if (
            date === null ||
            !date
        ) {

            return;

        }


        const storedDate =
            convertDateToStorage(date);


        if (!storedDate) {

            alert(

                "Please enter date in DD-MM-YYYY format.\nExample: 06-10-2026"

            );

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
            storedDate;

        transaction.purpose =
            purpose.trim();


        rebuildDataFromTransactions();

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


    if (
        personalBalance < -0.001 ||
        emergencyBalance < -0.001 ||
        savingsBalance < -0.001
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
        // Remove old Debit Payment records
        // ----------------------------------

        transactions =
            transactions.filter(
                transaction =>
                    transaction.type !== "Debit Payment"
            );


        // ----------------------------------
        // Remove old Debit Person / Due Date
        // information
        // ----------------------------------

        transactions.forEach(
            transaction => {

                if (
                    transaction.type === "Debit"
                ) {

                    delete transaction.person;

                    delete transaction.dueDate;

                }

            }
        );


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
// CONVERT DD-MM-YYYY TO YYYY-MM-DD
// ==========================================

function convertDateToStorage(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const parts =
        String(dateString)
            .trim()
            .split("-");


    if (parts.length !== 3) {

        return "";

    }


    const day =
        parts[0];

    const month =
        parts[1];

    const year =
        parts[2];


    if (
        !/^\d{2}$/.test(day) ||
        !/^\d{2}$/.test(month) ||
        !/^\d{4}$/.test(year)
    ) {

        return "";

    }


    const dayNumber =
        Number(day);

    const monthNumber =
        Number(month);


    if (
        monthNumber < 1 ||
        monthNumber > 12 ||
        dayNumber < 1 ||
        dayNumber > 31
    ) {

        return "";

    }


    return (

        year +
        "-" +
        month +
        "-" +
        day

    );

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
