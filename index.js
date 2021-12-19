let inputText = document.querySelector(`input[type='text']`);
let searchItem = document.querySelector(`input[type='search']`);
let root = document.querySelector(".todosList");
let allTodos = JSON.parse(localStorage.getItem("allTodos")) || [];
let store = Redux.createStore(reducer);






function handleSearch(event) {
    console.log(event.target.value);
    let value = event.target.value;
    if (event.keyCode === 13 && value !== "") {
        allTodos = allTodos.filter(todo => todo.name.includes(value))
        console.log(allTodos, 'filtered');
        createUI(allTodos, root)
        event.target.value = '';

    }



}

if (allTodos.length > 0) {
    searchItem.addEventListener('keyup', handleSearch)
}





function handleInput(event) {
    let value = event.target.value;
    if (event.keyCode === 13 && value !== "") {
        let todo = {
            id: Math.floor(Math.random() * 100),
            name: value,
            isDone: false,
        };
        allTodos.push(todo);
        localStorage.setItem("allTodos", JSON.stringify(allTodos));
        event.target.value = "";
        createUI(allTodos, root);
    }
}
function handleDelete(event) {

    let id = event.target.dataset.id;
    allTodos.splice(id, 1);
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
    createUI(allTodos, root);
}
function handleToggle(event) {
    let id = event.target.dataset.id;
    allTodos = allTodos.map((todo) =>
        todo.id === Number(id) ? { ...todo, isDone: !todo.isDone } : todo
    );
    createUI(allTodos, root);
    localStorage.allTodos = JSON.stringify(allTodos);
}

function handleActive() {
    let arr = allTodos.filter((todo) => !todo.isDone);
    createUI(arr);
}
function handleAll() {
    createUI();
}
function handleCompleted() {
    let arr = allTodos.filter((todo) => todo.isDone);

    createUI(arr);
}

function createFooter() {
    let footer = document.createElement("div");
    footer.classList.add("footer");
    let all = document.createElement("button");

    all.innerText = "All";
    all.classList.add("all", "btn");
    let active = document.createElement("button");
    active.innerText = "Active";
    active.classList.add("active", "btn");
    let completed = document.createElement("button");
    completed.innerText = "Completed";
    completed.classList.add("completed", "btn");

    footer.append(all, active, completed);
    if (allTodos.find((e) => e.isDone === true)) {
        let clear = document.createElement("button");
        clear.innerText = "Clear completed";
        clear.classList.add("clear");
        footer.append(clear);
    }

    footer.addEventListener("click", (event) => {
        let className = event.target.className;

        switch (true) {
            case className.includes("all"):
                handleAll();
                break;
            case className.includes("active"):
                handleActive();
                break;
            case className.includes("completed"):
                handleCompleted();
                break;
            case className.includes("clear"):
                allTodos = [];
                createUI(allTodos);
                localStorage.allTodos = JSON.stringify(allTodos);
                break;
            default:
                break;
        }
    });

    root.append(footer);
}

function createUI(data = allTodos, rootElm = root) {
    rootElm.innerHTML = "";
    data.forEach((todo, index) => {
        let div = document.createElement("div");
        div.classList.add("list");
        let checkbox = document.createElement("input");
        checkbox.classList.add("check");
        checkbox.type = "checkbox";
        checkbox.checked = todo.isDone;
        checkbox.addEventListener("input", (e) => {
            store.dispatch({ type: 'handleToggle', event: e })
        });
        checkbox.setAttribute("data-id", todo.id);

        let p = document.createElement("p");
        p.classList.add("para");
        p.innerText = todo.name;
        let div2 = document.createElement("div");
        div2.append(checkbox, p);
        div2.classList.add("start");
        let small = document.createElement("small");
        small.classList.add("close");
        small.innerText = "❌";
        small.setAttribute("data-id", index);
        small.addEventListener("click", (e) => {
            store.dispatch({ type: 'handleDelete', event: e })
        });

        div.append(div2, small);
        rootElm.append(div);
        div.append(div2, small);
    });
    if (allTodos.length > 0) {
        createFooter();
    }
}
createUI(allTodos, root);



function reducer(state = allTodos, action) {
    console.log(action);
    switch (action.type) {
        case 'handleInput':
            handleInput(action.event);

            break;
        case 'handleToggle':
            handleToggle(action.event);

            break;
        case 'handleAll':
            handleAll(action.event);

            break;
        case 'handleActive':
            handleActive(action.event);

            break;
        case 'handleDelete':
            handleDelete(action.event);

            break;
        case 'handleSearch':
            handleSearch(action.event);

            break;

        default:
            break;
    }



}

inputText.addEventListener("keyup", (e) => {
    store.dispatch({ type: 'handleInput',event:e })
});

