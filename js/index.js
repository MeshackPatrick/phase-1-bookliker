document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("list");
    const bookDetails = document.getElementById("show-panel");
  
    // Fetch and display all books
    function fetchBooks() {
      fetch("http://localhost:3000/books")
        .then((response) => response.json())
        .then((books) => {
          books.forEach((book) => {
            displayBook(book);
          });
        });
    }
  
    // Display a book in the book list
    function displayBook(book) {
      const bookItem = document.createElement("li");
      bookItem.textContent = book.title;
      bookItem.addEventListener("click", () => {
        displayBookDetails(book);
      });
      bookList.appendChild(bookItem);
    }
  
    // Display book details when a book is clicked
    function displayBookDetails(book) {
      bookDetails.innerHTML = ""; // Clear previous book details
  
      const bookTitle = document.createElement("h2");
      bookTitle.textContent = book.title;
  
      const bookImage = document.createElement("img");
      bookImage.src = book.img_url;
  
      const bookDescription = document.createElement("p");
      bookDescription.textContent = book.description;
  
      const likeButton = document.createElement("button");
      likeButton.textContent = "Like";
  
      const likedByList = document.createElement("ul");
      book.users.forEach((user) => {
        const likedByUser = document.createElement("li");
        likedByUser.textContent = user.username;
        likedByList.appendChild(likedByUser);
      });
  
      likeButton.addEventListener("click", () => {
        toggleLikeBook(book);
      });
  
      bookDetails.appendChild(bookTitle);
      bookDetails.appendChild(bookImage);
      bookDetails.appendChild(bookDescription);
      bookDetails.appendChild(likeButton);
      bookDetails.appendChild(likedByList);
    }
  
    // Toggle like/unlike a book
    function toggleLikeBook(book) {
      const currentUser = { id: 1, username: "pouros" };
  
      if (isUserLiked(book, currentUser)) {
        // User already liked the book, so unlike it
        const updatedUsers = book.users.filter((user) => user.id !== currentUser.id);
        updateLikedByList(book, updatedUsers);
      } else {
        // User didn't like the book, so like it
        const updatedUsers = [...book.users, currentUser];
        updateLikedByList(book, updatedUsers);
      }
    }
  
    // Check if a user has already liked a book
    function isUserLiked(book, user) {
      return book.users.some((likedUser) => likedUser.id === user.id);
    }
  
    // Update the liked by list and send PATCH request to the server
    function updateLikedByList(book, updatedUsers) {
      const patchData = {
        users: updatedUsers,
      };
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(patchData),
      })
        .then((response) => response.json())
        .then((updatedBook) => {
          displayBookDetails(updatedBook);
        });
    }
  
    // Initialize the app
    fetchBooks();
  });
  