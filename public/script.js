let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("fa-times");
  navbar.classList.remove("active");

  if (window.scrollY > 60) {
    document.querySelector("#scroll-top").classList.add("active");
  } else {
    document.querySelector("#scroll-top").classList.remove("active");
  }
};

// Get all the "Add to Cart" buttons
const addButtons = document.querySelectorAll(".creat");

// Get the cart items container
const cartItems = document.getElementById("cart-items");

// Add an event listener to each button
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the item details
    const item = button.parentNode;
    const itemName = item.querySelector("h3").innerText;
    const itemPrice = item.querySelector(".price").innerText;
    const itemImage = item.querySelector("img").src;

    // Create a new item element
    // Create a new item element
    const newItem = document.createElement("div");
    newItem.classList.add("cart-item");
    newItem.innerHTML = `
  <img src="${itemImage}">
  <div class="cart-item-details">
    <span class="cart-item-name">${itemName}</span>
    <span class="cart-item-price">${itemPrice}</span>
  </div>
  <button class="remove-button">Remove</button>
`;

    // Add the new item to the cart items container
    cartItems.appendChild(newItem);

    // Show the dropdown content
    document.querySelector(".dropdown-content").style.display = "block";
  });
});

// Add an event listener to the "Remove" buttons
cartItems.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-button")) {
    event.target.parentNode.remove();
  }

  // Hide the dropdown content if there are no items left
  if (cartItems.children.length === 0) {
    document.querySelector(".dropdown-content").style.display = "none";
  }
});

window.onbeforeunload = function() {
  if (cartItems.children.length > 0) {
    return 'Are you sure you want to leave? Your cart will be emptied.';
  }
};