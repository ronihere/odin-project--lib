class Book {
  constructor(bookName, bookAuthor, bookPages, isbn) {
    (this.title = bookName),
      (this.author = bookAuthor),
      (this.pages = bookPages),
      (this.read = false),
      (this.isbn = isbn),
      (this.id = "" + new Date().getTime());
  }
}

class UI {
  static displaybooks() {
    // console.log("before");
    let booksInStrore = BookStore.getBooks();
    // console.log("after");
    // console.log("inside display books");
    // const booksInStrore = [
    //   {
    //     id: "1678777563673",
    //     title: "Book One",
    //     author: "Author One",
    //     isbn: "1234#",
    //     pages: 10,
    //     read: true,
    //   },
    //   {
    //     id: "1678777563674",
    //     title: "Book Two",
    //     author: "Author Two",
    //     isbn: "1235#",
    //     pages: 10,
    //     read: "false",
    //   },
    //   {
    //     id: "1678777563675",
    //     title: "Book Three",
    //     author: "Author Three",
    //     isbn: "1236#",
    //     pages: 10,
    //     read: "true",
    //   },
    // ];

    let bookList = booksInStrore;

    bookList.forEach((book) => {
      this.addBookToUi(book);
    });
  }

  static showAlert(message, nameOfTheClass) {
    let parentElementOfTheAlertElement = document.querySelector(".container");
    let alertElement = document.createElement("div");
    alertElement.className = `alert alert-${nameOfTheClass}`;
    alertElement.appendChild(document.createTextNode(message));
    let formPos = document.querySelector("#book-form");
    parentElementOfTheAlertElement.insertBefore(alertElement, formPos);

    //remove the form alert after 2 seconds

    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  //delete or change readornotread
  static handlingEventsUsingPropagation(e) {
    // console.log("hi");
    if (e.classList.contains("delete")) {
      e.parentElement.parentElement.remove();
      this.showAlert("Book deleted successfully", "success");
      let isbnOfBook =
        e.parentElement.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;
      BookStore.deleteBook(isbnOfBook);
    } else if (e.classList.contains("read")) {
      if (e.classList.contains("fa-check-circle-o")) {
        e.className = "read fa fa-exclamation-circle";
      } else {
        e.className = "read fa fa-check-circle-o";
      }
    }
  }

  static clearFields() {
    document.querySelector("#title").value = "";
//     document.querySelector("#isbn").value = "";
    document.querySelector("#pages").value = "";
    document.querySelector("#author").value = "";
  }
  //   "fa fa-check-circle-o";
  // "fa fa-exclamation-circle"

  static addBookToUi(book) {
    let bookListInTable = document.querySelector("#book-list");
    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.pages}</td>
        <td><i class="read fa fa-exclamation-circle" aria-hidden="true"></i></td>
        <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;
    bookListInTable.appendChild(row);
  }
}

class BookStore {
  static getBooks() {
    let bookList;
    if (localStorage.getItem("books") === null) {
      bookList = [];
    } else bookList = JSON.parse(localStorage.getItem("books"));
    // console.log(bookList);
    // console.log(bookList.length);
    return bookList;
  }

  static addBook(book) {
    let bookList = BookStore.getBooks();
    bookList.push(book);
    localStorage.setItem("books", JSON.stringify(bookList));
  }

  static deleteBook(isbn) {
    // console.log("hi");
    let bookList = BookStore.getBooks();
    console.log(bookList.length);

    let newList = bookList.filter((book) => book.isbn !== isbn);
    localStorage.setItem("books", JSON.stringify(newList));
  }
}

document.addEventListener("DOMContentLoaded", UI.displaybooks());

//add a book from the form
let formData = document.querySelector("#book-form");
formData.addEventListener("submit", (e) => {
  e.preventDefault();

  let bookName = document.querySelector("#title").value;
  let bookAuthor = document.querySelector("#author").value;
  // let isbn = document.querySelector("#isbn").value;
  let pages = document.querySelector("#pages").value;

  let isbn = "#" + new Date().getTime();

  if (bookName == "" || bookAuthor == "" || pages == "") {
    // alert("please fill the form properly");
    UI.showAlert("please fill the form properly", "danger");
  } else {
    let bookNew = new Book(bookName, bookAuthor, pages, isbn);

    UI.addBookToUi(bookNew);

    BookStore.addBook(bookNew);

    UI.showAlert("Book added successfully", "success");

    UI.clearFields();
  }
});

//delete book
document.addEventListener("click", (e) =>
  UI.handlingEventsUsingPropagation(e.target)
);
