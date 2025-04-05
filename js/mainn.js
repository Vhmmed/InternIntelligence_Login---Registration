// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

//user
let toggle2 = document.querySelector(".user");
let navigation2 = document.querySelector(".navigation");
let main2= document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};


document.getElementById("signout").addEventListener('click', function(e) {
  e.preventDefault();
  
  if (!auth) {
    console.error("Firebase auth not initialized");
    return;
  }
  
  // Your auth-related code here
  auth.signOut().then(() => { 
    window.location.href = '/index.html';
  });
});