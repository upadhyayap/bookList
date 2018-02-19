const bookForm = document.querySelector('#book-form');
let allBooks;
let storage;

// allBooks = [];
// storage  =localStorage;
// initializeStorage(localStorage);
// loadFromStorage(localStorage);

 (function () {
     allBooks = [];
     storage  =localStorage;
     initializeStorage(localStorage);
     loadFromStorage(localStorage);
 })();

//  Book Object

function Book(title, author, isbn){
    this.title =  title;
    this.author = author;
    this.isbn = isbn;
}

Book.prototype.validate = function () {
    const ui = new Ui();
    if (this.title.trim() === '' || this.author.trim() === '' || 
        this.isbn.trim === '') {
        ui.showMessage('error', 'Please enter Correct Values');
        return false;
    }
    if (this.isDuplicate()) {
        ui.showMessage('error', 'This book is already added');
        return false;
    }

    return true;
};

Book.prototype.isDuplicate = function () {
    let isBookPresent = false;
    allBooks.forEach((book) => {
        if(book.isbn.trim() === this.isbn.trim()) {
            isBookPresent = true;
            return;
        }
    });

    return isBookPresent;
};

Book.prototype.persist = function () {
    
};

Book.prototype.delete = function () {
    
}

Book.prototype.constructor = Book;

//  UI Object

function Ui() {}

Ui.prototype.createBookRow = function (book) {
    const bookRow = document.createElement('tr');
    const title = document.createElement('td');
    const author = document.createElement('td');
    const isbn = document.createElement('td');
    const deleteIcon = document.createElement('td');

    title.textContent = book.title;
    author.textContent = book.author;
    isbn.textContent = book.isbn;
    

    //  Append td to tr

    bookRow.appendChild(title);
    bookRow.appendChild(author);
    bookRow.appendChild(isbn);
    bookRow.appendChild(deleteIcon);

    return bookRow;
};

Ui.prototype.appendToBookList = function (book) {
    const bookList = document.querySelector('#book-list');

    bookList.appendChild(this.createBookRow(book));
};

Ui.prototype.showMessage = function (type, msg) {
    switch (type) {
        case 'error':
            const error = this.createMessage(msg);
            error.style.color = 'red';
            break;
        case 'info':
            const info = this.createMessage(msg);
            info.style.color = 'white';
            break;
        case 'success':
            const success = this.createMessage(msg);
            success.style.color = 'green';
            break;
        default:
            break;
    }
};

Ui.prototype.createMessage = function (msg) {
    const container = document.querySelector('.container');
    const messageHeading = document.createElement('h2');
    const message = document.createTextNode(msg);

    messageHeading.setAttribute('id','msg');
    messageHeading.appendChild(message);
    container.insertBefore(messageHeading, document.querySelector('#add-book'));

    //  Clear Message

    setTimeout(this.clearMessage, 3000);

    return messageHeading;
};

Ui.prototype.clearMessage = function () {
    document.querySelector('#msg').remove();
};

//Ui.prototype.contstructor = Ui;


function Database(storage) {
    this.storage = storage;
}

Database.prototype.save = function (key, book) {
    let books = JSON.parse(this.storage.getItem(key));
    books.push(book);
    this.storage.setItem(key, JSON.stringify(books));
};

Database.prototype.delete = function (key, book) {
    let books = JSON.parse(this.storage.getItem(key));

    if (books.length > 0 ) {
        let bookToDeleteIndex;
        books.forEach((savedBook, index) => {
            if (savedBook.title === book.title && 
                savedBook.author === book.author && savedBook.isbn === book.isbn) {
                bookToDeleteIndex = index;
                return;
            }
        });

        if (bookToDeleteIndex !== 'undefined') {
            books.splice(bookToDeleteIndex, 1);
        }

        this.storage.setItem(key, JSON.stringify(books));
    }
};


loadEventListeners();

function loadEventListeners() {
    bookForm.addEventListener('submit', addToBookList);
}

function addToBookList(event) {
    event.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    const newBook = new Book(title, author, isbn);
    if (newBook.validate()) {
        const ui = new Ui();
        const database  = new Database(storage);
        database.save('books', newBook);
        ui.appendToBookList(newBook);
        allBooks.push(newBook);
        ui.showMessage('success', 'Successfully Added the Book');
    }

    console.log(newBook);
    console.log(`tilte: ${title} author: ${author} isbn:  ${isbn}`);
}

function initializeStorage(storage) {
    const bookList = JSON.stringify(storage.getItem('books'));
    if (bookList === 'undefined' || bookList === null || bookList === 'null') {
        storage.setItem('books', JSON.stringify([]));
    }
}

function loadFromStorage(storage) {
    const books = JSON.parse(storage.getItem('books'));

    if (books !== null && books !== 'undefined') {
        books.forEach((book) => {
            let newBook = new Book(book.title, book.author, book.isbn);
            const ui = new Ui();
            ui.appendToBookList(newBook);
            allBooks.push(newBook);
        });   
    }
}