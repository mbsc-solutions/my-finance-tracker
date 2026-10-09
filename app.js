
// ==========================================
// MY FINANCE TRACKER
// Income + Expenses + Debit + Daily Transfers
// ==========================================

const DEFAULT_DEBIT = 2250000;

const allocation = {
    Personal: 30,
    Emergency: 20,
    Savings: 20,
    PPF: 20,
    Jar: 10
};

let transactions = [];

let personalBalance = 0;
let emergencyBalance = 0;
let savingsBalance = 0;
let ppfBalance = 0;
let jarBalance = 0;

let totalIncome = 0;
let totalExpenses = 0;
let debitOutstanding = DEFAULT_DEBIT;

const STORAGE_KEY = "myFinanceTrackerData";

// ==========================================
// HELPERS
// ==========================================

function money(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
    if (!dateString) return "-";

    const parts = String(dateString).split("-");

    if (parts.length !== 3) return dateString;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function convertDateToStorage(dateString) {
    if (!dateString) return "";

    const parts = String(dateString).trim().split("-");

    if (parts.length !== 3) return "";

    const [day, month, year] = parts;

    if (
        !/^\d{2}$/.test(day) ||
        !/^\d{2}$/.test(month) ||
        !/^\d{4}$/.test(year)
    ) {
        return "";
    }

    const d = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    if (
        d.getFullYear() !== Number(year) ||
        d.getMonth() !== Number(month) - 1 ||
        d.getDate() !== Number(day)
    ) {
        return "";
    }

    return `${year}-${month}-${day}`;
}

function isValidDateFormat(dateString) {
    return Boolean(convertDateToStorage(dateString));
}

function todayStorageDate() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

// ==========================================
// ADD INCOME
// Amount + Date + Source ONLY
// ==========================================

function addIncome(amount, date, source) {
    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    if (!date) {
        alert("Please enter income date.");
        return;
    }

    transactions.push({
        id: Date.now(),
        type: "Income",
        amount: amount,
        date: date,
        source: String(source || "").trim()
    });

    rebuildDataFromTransactions();
    saveData();
    updateDashboard();
}

function addIncomePrompt() {
    const amount = prompt("Enter Income Amount:");

    if (amount === null) return;

    const dateInput = prompt(
        "Enter Income Date (DD-MM-YYYY):\n\nExample: 09-10-2026"
    );

    if (dateInput === null) return;

    const date = convertDateToStorage(dateInput);

    if (!date) {
        alert("Please enter a valid date in DD-MM-YYYY format.");
        return;
    }

    const source = prompt("Enter Income Source:");

    if (source === null) return;

    addIncome(amount, date, source);
}

// ==========================================
// ADD EXPENSE
// ==========================================

function addExpense(amount, date, allocationType, purpose) {
    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    if (!date) {
        alert("Please enter expense date.");
        return;
    }

    if (!["Personal", "Emergency", "Savings"].includes(allocationType)) {
        alert(
            "Expense can be taken only from Personal, Emergency or Savings."
        );
        return;
    }

    if (!purpose || !purpose.trim()) {
        alert("Please enter expense purpose.");
        return;
    }

    rebuildDataFromTransactions();

    const balances = {
        Personal: personalBalance,
        Emergency: emergencyBalance,
        Savings: savingsBalance
    };

    if (amount > balances[allocationType] + 0.001) {
        alert(
            allocationType +
            " allocation lo sufficient balance ledu.\n\n" +
            "Available Balance: " +
            money(balances[allocationType])
        );
        return;
    }

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
// ADD DEBIT
// Debit stores ONLY Amount + Date
// ==========================================

function addDebit(amount, date) {
    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid debit amount.");
        return;
    }

    if (!date) {
        alert("Please enter debit date.");
        return;
    }

    transactions.push({
        id: Date.now(),
        type: "Debit",
        amount: amount,
        date: date
    });

    rebuildDataFromTransactions();
    saveData();
    updateDashboard();
}

// ==========================================
// REBUILD ALL DATA
// ==========================================

function rebuildDataFromTransactions() {
    personalBalance = 0;
    emergencyBalance = 0;
    savingsBalance = 0;
    ppfBalance = 0;
    jarBalance = 0;

    totalIncome = 0;
    totalExpenses = 0;
    debitOutstanding = DEFAULT_DEBIT;

    transactions.forEach(transaction => {
        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "Income") {
            totalIncome += amount;

            personalBalance += amount * allocation.Personal / 100;
            emergencyBalance += amount * allocation.Emergency / 100;
            savingsBalance += amount * allocation.Savings / 100;
            ppfBalance += amount * allocation.PPF / 100;
            jarBalance += amount * allocation.Jar / 100;
        }

        if (transaction.type === "Expense") {
            totalExpenses += amount;

            if (transaction.allocation === "Personal") {
                personalBalance -= amount;
            }

            if (transaction.allocation === "Emergency") {
                emergencyBalance -= amount;
            }

            if (transaction.allocation === "Savings") {
                savingsBalance -= amount;
            }
        }

        if (transaction.type === "Debit") {
            debitOutstanding += amount;
        }
    });

    if (Math.abs(personalBalance) < 0.001) personalBalance = 0;
    if (Math.abs(emergencyBalance) < 0.001) emergencyBalance = 0;
    if (Math.abs(savingsBalance) < 0.001) savingsBalance = 0;
    if (Math.abs(ppfBalance) < 0.001) ppfBalance = 0;
    if (Math.abs(jarBalance) < 0.001) jarBalance = 0;
}

function getAvailableBalance() {
    return Math.max(
        0,
        personalBalance + emergencyBalance + savingsBalance
    );
}

// ==========================================
// DASHBOARD
// ==========================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function updateDashboard() {
    rebuildDataFromTransactions();

    setText("totalIncome", money(totalIncome));
    setText("totalExpenses", money(totalExpenses));

    setText(
        "debitOutstanding",
        money(Math.max(0, debitOutstanding))
    );

    setText("availableBalance", money(getAvailableBalance()));

    setText("personalAmount", money(Math.max(0, personalBalance)));
    setText("emergencyAmount", money(Math.max(0, emergencyBalance)));
    setText("savingsAmount", money(Math.max(0, savingsBalance)));
    setText("ppfAmount", money(Math.max(0, ppfBalance)));
    setText("jarAmount", money(Math.max(0, jarBalance)));

    displayTransactions();
    displayDailyTransfers();
}

// ==========================================
// DAILY INCOME TRANSFER DETAILS
// ==========================================

function displayDailyTransfers() {
    const dateInput = document.getElementById("transferDate");
    const details = document.getElementById("dailyTransferDetails");

    if (!dateInput || !details) return;

    const selectedDate = dateInput.value;

    if (!selectedDate) {
        details.innerHTML =
            '<p class="text-muted">Please select an income date.</p>';
        return;
    }

    const dailyIncome = transactions
        .filter(t => t.type === "Income" && t.date === selectedDate)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    if (dailyIncome === 0) {
        details.innerHTML = `
            <p class="text-muted">
                ${escapeHTML(formatDate(selectedDate))}
                తేదీన Income నమోదు చేయలేదు.
            </p>
        `;
        return;
    }

    const rows = [
        { name: "Personal — AXIS", percent: 30 },
        { name: "Emergency — IPPB", percent: 20 },
        { name: "Savings — SBI", percent: 20 },
        { name: "PPF — Postal SB", percent: 20 },
        { name: "Jar", percent: 10 }
    ];

    let html = `
        <div class="mb-3">
            <div class="text-muted">
                Selected Date: ${escapeHTML(formatDate(selectedDate))}
            </div>

            <h5 class="mt-2">
                Today's Income: ${money(dailyIncome)}
            </h5>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered transfer-table">
                <thead class="table-light">
                    <tr>
                        <th>Account / Category</th>
                        <th>Percentage</th>
                        <th>Transfer Amount</th>
                    </tr>
                </thead>
                <tbody>
    `;

    rows.forEach(item => {
        const amount = dailyIncome * item.percent / 100;

        html += `
            <tr>
                <td>${escapeHTML(item.name)}</td>
                <td>${item.percent}%</td>
                <td class="transfer-amount">${money(amount)}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
                <tfoot class="table-light">
                    <tr>
                        <th colspan="2">Total</th>
                        <th>${money(dailyIncome)}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    details.innerHTML = html;
}

// ==========================================
// TRANSACTION HISTORY
// ==========================================

function displayTransactions() {
    const historyElement = document.getElementById("transactionHistory");

    if (!historyElement) return;

    const validTransactions = transactions.filter(t =>
        ["Income", "Expense", "Debit"].includes(t.type)
    );

    if (validTransactions.length === 0) {
        historyElement.innerHTML =
            '<p class="text-muted">No transactions yet.</p>';
        return;
    }

    const sortedTransactions = [...validTransactions].sort((a, b) => {
        const dateDifference = String(b.date).localeCompare(String(a.date));
        return dateDifference || Number(b.id) - Number(a.id);
    });

    historyElement.innerHTML = sortedTransactions.map(transaction => {
        let typeClass = "text-primary";

        if (transaction.type === "Income") typeClass = "text-success";
        if (transaction.type === "Expense") typeClass = "text-danger";

        let extraInfo = "";

        if (transaction.allocation) {
            extraInfo += `
                <div>
                    <strong>From:</strong>
                    ${escapeHTML(transaction.allocation)}
                </div>
            `;
        }

        if (transaction.source) {
            extraInfo += `
                <div>
                    <strong>Source:</strong>
                    ${escapeHTML(transaction.source)}
                </div>
            `;
        }

        // Purpose is displayed ONLY for Expense.
        // Debit Due Date, Person and Purpose are not displayed.
        if (transaction.type === "Expense" && transaction.purpose) {
            extraInfo += `
                <div>
                    <strong>Purpose:</strong>
                    ${escapeHTML(transaction.purpose)}
                </div>
            `;
        }

        return `
            <div class="transaction-item">
                <div class="d-flex justify-content-between flex-wrap gap-2">
                    <strong class="${typeClass}">
                        ${escapeHTML(transaction.type)}
                    </strong>

                    <strong>${money(transaction.amount)}</strong>
                </div>

                <div>
                    <strong>Date:</strong>
                    ${escapeHTML(formatDate(transaction.date))}
                </div>

                ${extraInfo}

                <div class="mt-3 d-flex gap-2 flex-wrap">
                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editTransaction(${Number(transaction.id)})">
                        ✏️ Edit
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteTransaction(${Number(transaction.id)})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// ==========================================
// ADD EXPENSE PROMPT
// ==========================================

function addExpensePrompt() {
    const amount = prompt("Enter Expense Amount:");

    if (amount === null) return;

    const dateInput = prompt(
        "Enter Expense Date (DD-MM-YYYY):\n\nExample: 09-10-2026"
    );

    if (dateInput === null) return;

    const date = convertDateToStorage(dateInput);

    if (!date) {
        alert("Please enter a valid date in DD-MM-YYYY format.");
        return;
    }

    const choice = prompt(
        "Expense From Which Allocation?\n\n" +
        "1 = Personal\n2 = Emergency\n3 = Savings\n\n" +
        "Enter 1, 2 or 3:"
    );

    if (choice === null) return;

    const options = {
        "1": "Personal",
        "2": "Emergency",
        "3": "Savings"
    };

    if (!options[choice]) {
        alert("Please enter only 1, 2 or 3.");
        return;
    }

    const purpose = prompt("Expense Purpose:");

    if (purpose === null) return;

    addExpense(amount, date, options[choice], purpose);
}

// ==========================================
// ADD DEBIT PROMPT
// ONLY Pay Amount + Date
// ==========================================

function addDebitPrompt() {
    const amount = prompt("Enter Pay Amount:");

    if (amount === null) return;

    const dateInput = prompt(
        "Enter Date (DD-MM-YYYY):\n\nExample: 09-10-2026"
    );

    if (dateInput === null) return;

    const date = convertDateToStorage(dateInput);

    if (!date) {
        alert("Please enter a valid date in DD-MM-YYYY format.");
        return;
    }

    addDebit(amount, date);
}

// ==========================================
// EDIT TRANSACTION
// ==========================================

function editTransaction(id) {
    const transaction = transactions.find(
        t => Number(t.id) === Number(id)
    );

    if (!transaction) {
        alert("Transaction not found.");
        return;
    }

    const oldTransaction = { ...transaction };

    const amountInput = prompt(
        "Enter new amount:",
        transaction.amount
    );

    if (amountInput === null) return;

    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const dateInput = prompt(
        "Enter date (DD-MM-YYYY):",
        formatDate(transaction.date)
    );

    if (dateInput === null) return;

    const date = convertDateToStorage(dateInput);

    if (!date) {
        alert("Please enter a valid date in DD-MM-YYYY format.");
        return;
    }

    // DEBIT EDIT: Amount + Date only.
    if (transaction.type === "Debit") {
        transaction.amount = amount;
        transaction.date = date;

        // Remove obsolete fields from older saved Debit records.
        delete transaction.person;
        delete transaction.dueDate;
        delete transaction.purpose;

        rebuildDataFromTransactions();
        saveData();
        updateDashboard();
        return;
    }

    transaction.amount = amount;
    transaction.date = date;

    // INCOME EDIT: Source only. No Purpose.
    if (transaction.type === "Income") {
        const source = prompt(
            "Income Source:",
            transaction.source || ""
        );

        if (source === null) {
            Object.assign(transaction, oldTransaction);
            return;
        }

        transaction.source = source.trim();
        delete transaction.purpose;
    }

    // EXPENSE EDIT: Purpose remains.
    if (transaction.type === "Expense") {
        const choice = prompt(
            "Select Expense Allocation:\n\n" +
            "1 = Personal\n2 = Emergency\n3 = Savings",
            transaction.allocation === "Personal" ? "1" :
            transaction.allocation === "Emergency" ? "2" : "3"
        );

        if (choice === null) {
            Object.assign(transaction, oldTransaction);
            return;
        }

        const options = {
            "1": "Personal",
            "2": "Emergency",
            "3": "Savings"
        };

        if (!options[choice]) {
            Object.assign(transaction, oldTransaction);
            alert("Please enter 1, 2 or 3.");
            return;
        }

        const purpose = prompt(
            "Expense Purpose:",
            transaction.purpose || ""
        );

        if (purpose === null || !purpose.trim()) {
            Object.assign(transaction, oldTransaction);
            return;
        }

        transaction.allocation = options[choice];
        transaction.purpose = purpose.trim();
    }

    rebuildDataFromTransactions();

    if (
        personalBalance < -0.001 ||
        emergencyBalance < -0.001 ||
        savingsBalance < -0.001
    ) {
        Object.assign(transaction, oldTransaction);
        rebuildDataFromTransactions();

        alert(
            "This edit cannot be completed because the selected " +
            "allocation does not have sufficient balance."
        );

        return;
    }

    saveData();
    updateDashboard();
}

// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {
    const transaction = transactions.find(
        t => Number(t.id) === Number(id)
    );

    if (!transaction) {
        alert("Transaction not found.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this transaction?\n\n" +
        transaction.type + " - " + money(transaction.amount)
    );

    if (!confirmed) return;

    const oldTransactions = [...transactions];

    transactions = transactions.filter(
        t => Number(t.id) !== Number(id)
    );

    rebuildDataFromTransactions();

    if (
        personalBalance < -0.001 ||
        emergencyBalance < -0.001 ||
        savingsBalance < -0.001
    ) {
        transactions = oldTransactions;
        rebuildDataFromTransactions();

        alert(
            "This transaction cannot be deleted because " +
            "other transactions depend on it."
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
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

// ==========================================
// LOAD EXISTING DATA
// ==========================================

function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        try {
            const data = JSON.parse(savedData);

            transactions = Array.isArray(data.transactions)
                ? data.transactions
                : [];

            // Remove obsolete Debit Payment transactions.
            transactions = transactions.filter(
                t => t.type !== "Debit Payment"
            );

            // Clean old Debit records so only Amount + Date remain.
            transactions.forEach(transaction => {
                if (transaction.type === "Debit") {
                    delete transaction.person;
                    delete transaction.dueDate;
                    delete transaction.purpose;
                }

                if (transaction.type === "Income") {
                    delete transaction.purpose;
                }
            });

        } catch (error) {
            console.error("Data loading error:", error);
            transactions = [];
        }
    }

    rebuildDataFromTransactions();
    saveData();
    updateDashboard();
}

// ==========================================
// START APP
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("transferDate");

    if (dateInput) {
        dateInput.value = todayStorageDate();
        dateInput.addEventListener("change", displayDailyTransfers);
    }

    loadData();
});
