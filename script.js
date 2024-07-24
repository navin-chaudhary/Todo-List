let todos = [];
let button = document.querySelector("#addTaskBtn");
let tasklist = document.querySelector("#taskList");
let form=document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let input=document.querySelector("#taskInput")
    let taskinput = input.value.trim();
    function addtodos() {
        if (taskinput !== '') {
            
            todos.push({
                id: Math.random().toString(),
                input: taskinput,
                isCompleted: false
            });
            
            addToDom(todos);
            localStorage.setItem('todos', JSON.stringify(todos));
        }
        
    }
    addtodos();
    input.value=""
});
function clearcompleted(){
    
        todos=todos.filter((e)=>{
            
            return !e.isCompleted
        })
        tasklist.innerHTML=""
        addToDom(todos)
        localStorage.setItem('todos', JSON.stringify(todos));
        
}
function addToDom(arr) {
    arr.forEach(task => {
        let newli = document.createElement('li');
        let div = document.createElement('div');
        div.innerText = task.input;
        newli.appendChild(div)
        newli.id = task.id;

        if (task.isCompleted) {
            newli.style.textDecoration = "line-through";
        } else {
            newli.style.textDecoration = "none";
        }

        let checkbtn = document.createElement('input');
        checkbtn.className = 'checkbox';
        checkbtn.type = 'checkbox';
        checkbtn.checked = task.isCompleted;
        div.prepend(checkbtn);

        checkbtn.addEventListener('change', () => {
            todos = todos.map(todo => todo.id === task.id ? { ...todo, isCompleted: !task.isCompleted } : todo);
            tasklist.innerHTML = "";
            addToDom(todos)
            localStorage.setItem('todos', JSON.stringify(todos));
        });


        let icon = document.createElement('i');
        icon.className = 'fa-solid fa-trash';
        icon.addEventListener('click', () => {
            tasklist.removeChild(newli);
            todos = todos.filter(t => t.id !== task.id);
            localStorage.setItem('todos', JSON.stringify(todos));
        });
        newli.appendChild(icon);
        
        if ([...tasklist.childNodes].find(cn => cn.id === task.id)) return
        tasklist.appendChild(newli);

    });
}



document.addEventListener("DOMContentLoaded", () => {
    const savedTODOS = localStorage.getItem("todos");
    if (savedTODOS) {
        const JSONTODOS = JSON.parse(savedTODOS);
        if (!Array.isArray(JSONTODOS)) {
            return

        }
        todos = JSONTODOS;
        addToDom(JSONTODOS);
    }
});


