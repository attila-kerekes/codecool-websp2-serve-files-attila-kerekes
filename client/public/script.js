//Add the script.js

console.log("The site is loaded!")



//Serve and Fetch
const url = 'http://127.0.0.1:3000/users'; //The url constant specifies the URL of our API endpoint that returns the users in JSON format.

const userHTML = user => `<div class="user"><span class="user-id">${user.id}</span> ${user.name}</div>`; //The userHTML function takes a single user object as an argument and returns an HTML string representing that user as a div element. 
const usersHTML = users => `<div id="users">${users.map(user => userHTML(user)).join("")}</div>`; //The usersHTML (watch the plural) function takes an array of user objects as an argument and returns an HTML string representing all of those users as a div element.

//Send data to server / Form
const inputHTML = name => `<input placeholder="Write the name here" value="${name}">`;
const buttonHTML = (text, method) => `<button type="submit" data-method="${method}">${text}</button>`;

const formHTML = (user) => `
<form id="form" data-id="${user.id}">
${inputHTML(user.name)}
${buttonHTML("Save", "")}
</form>
`;

//Serve and Fetch
const fetchData = async (url, id) => { //The fetchData function is an asynchronous function that takes a URL as an argument and uses the fetch function to make a request to that URL. If the request is successful, the function parses the response as JSON and returns it. If there is an error, the function logs the error to the console.
  try {
    const response = await fetch(id !== undefined ? `${url}/${id}` : url);
    return await response.json();

  } catch (error) {
    console.error(error);
  }
};

const main = async _ => { //The main function is an asynchronous function that uses the fetchData function to load user data from our API endpoint specified by the url constant. When the user data is loaded, the function inserts it into the DOM as HTML using the insertAdjacentHTML method on an element with an ID of root
  const root = document.getElementById("root");
  const users = await fetchData(url);
  root.insertAdjacentHTML("beforeend", usersHTML(users));
  root.insertAdjacentHTML("beforeend", formHTML({ id: 0, name: "" }));
};


/* window.addEventListener("click", event => {
  const userId = event.target.id;
  const response = await fetch(`${url}/${userId}`);
  const data = await response.json();
  const inputElement = document.querySelector('input');
  inputElement.value = data.name;
  document.getElementById('form').dataset.id = userId;


})
 */


const handleClick = async ({ target }) => {
  const userTarget = target.classList.contains('user') ? target : target.closest('.user');

  if (userTarget) {
    const userId = userTarget.querySelector(".user-id").textContent;
    const userData = await fetchData(url, userId);

    const response = await fetch(`${url}/${userId}`);
    const data = await response.json();

    const inputElement = userTarget.querySelector('input');
    inputElement.value = data.name;

    document.getElementById("form").outerHTML = formHTML(userData);
    document.getElementById('form').dataset.id = userId;
  }
};


window.addEventListener("load", main); //The main function is called when the "load" event fires on the window object (which means that the entire page is loaded).