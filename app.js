// Book Class - represents a book
class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read
    }
}

// UI Class - handle UI tasks
class UI {
    static displayBooks() {
       
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td>${book.read}</td>
        <td><a href='#' class="btn btn-danger btn-sm delete"><i class="fas fa-trash"></i></a></td>
        `;
        list.appendChild(row);
    } 

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form)
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)

    }

    static clearFields() {
        document.querySelector('#title').value = ''; 
        document.querySelector('#author').value = ''; 
        document.querySelector('#pages').value = '';
        document.querySelector('#read').value = '';
    }
}

// Store Class - handles local storage

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        } 
        return books
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// Event Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // prevent actual submit 
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('#read').value;


    // Validate
    if (title === '' || author === '' || pages === '' || read === '') {
        UI.showAlert('Please fill in all fields', 'danger')
    }

    // instatiate book 
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to Store 
    Store.addBook(book)

    // Show success message
    UI.showAlert('Book Added', 'success');

    // clear fields
    UI.clearFields();

    console.log(book)
});
// Event Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
   // Remove book from UI
    UI.deleteBook(e.target)

    //Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

// Show success message
    UI.showAlert('Book Removed', 'info');
});


    