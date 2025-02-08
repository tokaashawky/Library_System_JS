let totalBooks = 0, addedBooks = 0, books = [];

document.getElementById("bookCount").addEventListener("submit", function (event) {
    event.preventDefault();
    let count = parseInt(document.getElementById("bookCountInput").value);
    let error = document.getElementById("countError");
    if (isNaN(count) || count < 1) {
        error.textContent = "Please enter a valid number (1 or more).";
        error.style.display = "block";
    } else {
        error.style.display = "none";
        totalBooks = count;
        document.getElementById("bookCount").style.display = "none";
        document.getElementById("bookForm").style.display = "block";
    }
});


function validateInput(id, errorId, regex, errorMessage) {
    let input = document.getElementById(id);
    let error = document.getElementById(errorId);
    let value = input.value;
    let isValid = true;

    if (value === "") {
        error.textContent = "This field is required to be entered .";
        isValid = false;
    } else if (!regex.test(value)) {
        error.textContent = errorMessage;
        isValid = false;
    } else {
        error.style.display = "none";
    }
    error.style.display = isValid ? "none" : "block";
    input.dataset.valid = isValid ? "true" : "false";
}

function addBook() {
    let isValid = true;
    validateInput("bookName", "nameError", /^(?!\d+$)[a-zA-Z0-9\s]+$/, "Only letters, numbers, and spaces allowed, but cannot be numbers only.");
    validateInput("bookPrice", "priceError", /^[1-9][0-9]{1,}$/, "Enter a valid positive number more than 10 .");
    validateInput("authorName", "authorError", /^[a-zA-Z\s]+$/, "Only letters and spaces allowed.");
    validateInput("authorEmail", "emailError", /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email (like: a@b.c)");

    document.querySelectorAll('input').forEach(input => {
        if (input.dataset.valid === "false")
            isValid = false;
    });
    if (isValid) {
        let book = {
            name: document.getElementById("bookName").value,
            price: document.getElementById("bookPrice").value,
            author: document.getElementById("authorName").value,
            email: document.getElementById("authorEmail").value
        };

        books.push(book);
        addedBooks++;
        document.getElementById("createBookForm").reset();

        if (addedBooks === totalBooks) {
            document.getElementById("bookForm").style.display = "none";
            document.getElementById("booksListTitle").style.display = "block";
            document.getElementById("booksSection").style.display = "block";
            displayBooks();
        }
    }
}

function displayBooks() {
    let tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = "";
    books.forEach((book, index) => {
        let row = tbody.insertRow();
        row.innerHTML =
            `<td><input type="text" value="${book.name}" class="editable" data-field="name"></td>
                     <td><input type="number" value="${book.price}" class="editable" data-field="price"></td>
                     <td><input type="text" value="${book.author}" class="editable" data-field="author"></td>
                    <td><input type="email" value="${book.email}" class="editable" data-field="email"></td>
                    <td> <!-- Actions Column -->
                    <button class="edit-btn" onclick="editRow(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteRow(${index})">Delete</button>
                    </td>`;
    });
    // Disable inputs after rendering
    document.querySelectorAll('.editable').forEach(input => input.disabled = true);
}

let currentlyEditingIndex = -1; // Track which row is being edited

function editRow(index) {
    if (currentlyEditingIndex !== -1 && currentlyEditingIndex !== index) {
        alert("Please save or cancel the current edit before editing another row.");
        return;
    }

    let row = document.querySelectorAll("#booksTable tbody tr")[index];
    let inputs = row.querySelectorAll('.editable');
    let editBtn = row.querySelector('.edit-btn');
    let deleteBtn = row.querySelector('.delete-btn');

    // Enable inputs for editing
    inputs.forEach(input => {
        input.disabled = false;
        if (!input.nextElementSibling || input.nextElementSibling.tagName !== "SPAN") {
            let errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            errorSpan.style.color = "red";
            errorSpan.style.display = "none";
            input.parentNode.appendChild(errorSpan);
        }
    });

    // Change buttons to "Confirm" and "Cancel"
    editBtn.textContent = "Confirm";
    deleteBtn.textContent = "Cancel";
    editBtn.setAttribute("onclick", `confirmEdit(${index})`);
    deleteBtn.setAttribute("onclick", `cancelEdit(${index})`);

    currentlyEditingIndex = index; // Track the editing row
}

function confirmEdit(index) {
    let row = document.querySelectorAll("#booksTable tbody tr")[index];
    let inputs = row.querySelectorAll('.editable');
    let book = books[index];
    let isValid = true;

    inputs.forEach(input => {
        let field = input.getAttribute("data-field");
        let value = input.value.trim();
        let errorSpan = input.nextElementSibling;
        let regex, errorMessage;

        if (field === "name") {
            regex = /^(?!\d+$)[a-zA-Z0-9\s]+$/;
            errorMessage = "Only letters, numbers, and spaces allowed, but cannot be numbers only.";
        } else if (field === "price") {
            regex = /^[1-9][0-9]{1,}$/;
            errorMessage = "Enter a valid positive number more than 10";
        } else if (field === "author") {
            regex = /^[a-zA-Z\s]+$/;
            errorMessage = "Only letters and spaces allowed.";
        } else if (field === "email") {
            regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            errorMessage = "Enter a valid email (like: a@b.c)";
        }

        if (!regex.test(value)) {
            input.style.border = "2px solid red"; // Highlight error
            errorSpan.textContent = errorMessage; // Show full error message
            errorSpan.style.display = "block"; // Make it visible
            input.value = ""; // Clear input for user to enter again
            isValid = false;
        } else {
            input.style.border = "2px solid green"; // Show valid input
            errorSpan.style.display = "none"; // Hide error
        }
    });

    if (isValid) {
        inputs.forEach(input => {
            let field = input.getAttribute("data-field");
            book[field] = input.value;
            input.style.border = ""; // Reset border
        });
        displayBooks();
        currentlyEditingIndex = -1; 
    }
}

function cancelEdit(index) {
    displayBooks();
    currentlyEditingIndex = -1; 
}


function deleteRow(index) {
    let confirmDelete = confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
        books.splice(index, 1);
        displayBooks();
    }
}

function resetForm() {
    document.getElementById("createBookForm").reset();
    document.querySelectorAll('span').forEach(span => span.style.display = 'none');
}
function addNewRow() {
    let tbody = document.querySelector("#booksTable tbody");

    // If the table is empty, add a new row without any checks
    if (tbody.rows.length === 0) {
        let row = tbody.insertRow();
        row.innerHTML = `
            <td><input type="text" class="editable" data-field="name" placeholder="Book Name"></td>
            <td><input type="number" class="editable" data-field="price" placeholder="Book Price"></td>
            <td><input type="text" class="editable" data-field="author" placeholder="Author Name"></td>
            <td><input type="email" class="editable" data-field="email" placeholder="Author Email"></td>
            <td> <!-- Actions Column -->
                <button class="edit-btn" onclick="editRow(${books.length})">Edit</button>
                <button class="delete-btn" onclick="deleteRow(${books.length})">Delete</button>
            </td>`;
        books.push({
            name: "",
            price: "",
            author: "",
            email: ""
        });
        document.querySelectorAll('.editable').forEach(input => input.disabled = true);
    } else {
        let lastRow = tbody.rows[tbody.rows.length - 1]; // Get the last row
        let isRowEmpty = false;

        // Check if any field in the last row is empty
        lastRow.querySelectorAll('.editable').forEach(input => {
            if (input.value.trim() === "") {
                isRowEmpty = true;
                input.style.border = "2px solid red"; // Highlight empty fields
            } else {
                input.style.border = ""; // Reset border for filled fields
            }
        });

        // If the last row is empty, show an alert and do not add a new row
        if (isRowEmpty) {
            alert("Please fill in all the fields in the current row before adding a new one.");
        } else {
            // Add new row only if the last row is filled
            let row = tbody.insertRow();
            row.innerHTML = `
                <td><input type="text" class="editable" data-field="name" placeholder="Book Name"></td>
                <td><input type="number" class="editable" data-field="price" placeholder="Book Price"></td>
                <td><input type="text" class="editable" data-field="author" placeholder="Author Name"></td>
                <td><input type="email" class="editable" data-field="email" placeholder="Author Email"></td>
                <td> <!-- Actions Column -->
                    <button class="edit-btn" onclick="editRow(${books.length})">Edit</button>
                    <button class="delete-btn" onclick="deleteRow(${books.length})">Delete</button>
                </td>`;
            books.push({
                name: "",
                price: "",
                author: "",
                email: ""
            });
            document.querySelectorAll('.editable').forEach(input => input.disabled = true);
        }
    }
}

function deleteAllRows() {
    let confirmDelete = confirm("Are you sure you want to delete all the books?");
    if (confirmDelete) {
    books = []; // Clear the books array
    displayBooks(); // Refresh the table
}}
