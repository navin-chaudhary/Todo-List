let button = document.querySelector("#addTaskBtn");
button.addEventListener("click", () => {
    let taskinput = document.querySelector("#taskInput").value.trim();
    let tasklist = document.querySelector("#taskList");

    function addtodo() {
        if (taskinput != '') {
            let newli = document.createElement('li');
            newli.innerText = taskinput;
            
            
            let checkbtn = document.createElement('input');
            checkbtn.className = 'checkbox';
            checkbtn.type = 'checkbox';
            newli.appendChild(checkbtn);
            

            let icon = document.createElement('i');
            icon.className = 'fa-solid fa-trash';
            icon.addEventListener('click', () => {
                tasklist.removeChild(newli);
                tasklist.removeChild(checkbtn)
            });
    
            newli.appendChild(icon);

            tasklist.appendChild(newli);

            checkbtn.addEventListener('click', () => {

                if (checkbtn || checkbtn.checked) {
                    let completedTasks = document.querySelector("#completedTasks");
                    completedTasks.appendChild(newli);
                    tasklist.removeChild(checkbtn);
                }
            });
            checkbtn.addEventListener('click',()=>{
                newli.style.textDecoration = "line-through";
                if(newli.style.textDecoration = "line-through"){
                    checkbtn.addEventListener('click',()=>{
                        newli.style.textDecoration = "none";
                        
                    })
                }
            })

        }
    }
    addtodo();
});

