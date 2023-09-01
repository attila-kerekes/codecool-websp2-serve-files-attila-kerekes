//Add the script.js

console.log("The site is loaded!")



// Serve /Serve and Fetch
// Define the API URL
const url = 'http://127.0.0.1:3000/users'; //The url constant specifies the URL of our API endpoint that returns the users in JSON format.

// Define a function to generate user HTML
const userHTML = user => `<div class="user"><span class="user-id">${user.id}</span> ${user.name}</div>`; //The userHTML function takes a single user object as an argument and returns an HTML string representing that user as a div element. 
// Define a function to generate users HTML
const usersHTML = users => `<div id="users">${users.map(user => userHTML(user)).join("")}</div>`; //The usersHTML (watch the plural) function takes an array of user objects as an argument and returns an HTML string representing all of those users as a div element.

//Send data to server / Form, //Send data to server / Patch
// Define a function to generate input HTML
const inputHTML = name => `<input placeholder="Write the name here" value="${name}">`;
// Define a function to generate button HTML
const buttonHTML = (text, method) => `<button type="submit" data-method="${method}">${text}</button>`;

//Send data to server / Form, //Send data to server / Patch, //Send data to server / Put, //Send data to server / Delete
// Define a function to generate form HTML
const formHTML = (user) => `
  <form id="form" data-id="${user.id}">
    ${inputHTML(user.name)}
    ${buttonHTML("Save", "PATCH")}
    ${buttonHTML("Replace", "PUT")}
    ${buttonHTML("Remove", "DELETE")}
  </form>
`;

// Serve / Serve and Fetch, //Send data to server / Form, //Send data to server / Patch
// Define a function to fetch user data from the API
const fetchData = async (url, id, method = "GET", body = { name: "" }) => { //The fetchData function is an asynchronous function that takes a URL as an argument and uses the fetch function to make a request to that URL. If the request is successful, the function parses the response as JSON and returns it. If there is an error, the function logs the error to the console.

    try {
        const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();

    } catch (error) {
        console.error(error);
    }
}

//Send data to server / Form    
// Define a function to handle user clicks
const handleClick = async ({ target }) => {
    const userTarget = target.classList.contains('user') ? target : target.closest('.user');

    if (userTarget) {
        const userId = userTarget.querySelector(".user-id").textContent;
        const userData = await fetchData(url, userId);

        const response = await fetch(`${url}/${userId}`);
        const data = await response.json();

        const inputElement = document.querySelector('input');
        inputElement.value = data.name;

        document.getElementById("form").outerHTML = formHTML(userData);
        document.getElementById('form').dataset.id = userId;
    }
};

//Send data to server / Patch
const handleInput = ({ target }) => {
    target.setAttribute("value", target.value);
}

//Send data to server / Patch, //Send data to server / Put, //Send data to server / Delete
const handleSubmit = async e => {
    e.preventDefault();

    const method = e.submitter.getAttribute("data-method");
    const id = parseInt(e.target.getAttribute("data-id"));

    const result = await fetchData(
        url,
        id,
        method,
        method === "PATCH" ?
            { name: e.target.querySelector("input").value } :
            method === "PUT" ?
                { name: e.target.querySelector("input").value, id } :
                method === "DELETE" ?
                    { id } :
                    { name: "" }
    );
    if (result.state === "DONE") {
        const users = await fetchData(url);
        document.getElementById("users").outerHTML = usersHTML(users);
    }
}

// Define the main function
const main = async _ => { //The main function is an asynchronous function that uses the fetchData function to load user data from our API endpoint specified by the url constant. When the user data is loaded, the function inserts it into the DOM as HTML using the insertAdjacentHTML method on an element with an ID of root
    const root = document.getElementById("root");
    const users = await fetchData(url);
    root.insertAdjacentHTML("beforeend", usersHTML(users));
    root.insertAdjacentHTML("beforeend", formHTML({ id: 0, name: "" }));
    document.addEventListener("click", handleClick);
    window.addEventListener("input", handleInput);
    window.addEventListener("submit", handleSubmit);
};

window.addEventListener("load", main); //The main function is called when the "load" event fires on the window object (which means that the entire page is loaded).