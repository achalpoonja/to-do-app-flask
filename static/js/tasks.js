
// inital setup : Checking if user is logged in and rendering cards
var userLoggedIn = localStorage.getItem("token");
if(!userLoggedIn){
    window.location.href="http://127.0.0.1:5000/login";
}else {
    renderCards();
}

//This function populates the dropdown in add task form
function populateUsnDropdown(){
    let dropdown = document.getElementById("assignedTo");
    $.ajax({
        type:"GET",
        url:"http://127.0.0.1:5000/get-students",
        success: function(response){
            let users = response.students;
            console.log(users);
            var data = `<option value="">--SELECT USN--</option>`;
            if(users) {
                users.forEach(user => data += `<option value="${user.student_usn}">${user.student_usn}</option>`);
            }
   
            dropdown.innerHTML = data;
        }
    });
}


//function to render task cards
function renderCards(){
    $.ajax({
        type:"GET",
        url:"http://127.0.0.1:5000/get-tasks",
        success: function(response){
                var cardsContainer = document.getElementById("cardsContainer");
                tasks=response.tasks;
                if (tasks.length < 1){
                cardsContainer.innerHTML = `<h5 class="text-secondary mt-5 text-center">Sorry no Tasks!<h5>`;
                }else {
                    var data = "";
                    tasks.forEach(task => {
                        data += `<div class="col-md-4 col-sm-12 mb-3">`;
                        data += `<div class="card">`;
                        data += `<div class="card-body">`;
                        data += `<h4 class="card-title">${task.task}</h4>`;
                        data += `<h5 class="card-subtitle mb-2 text-muted"><b>Deadline: </b>${task.deadline}</h5>`;
                        data += `<h6 class="card-subtitle mb-2 text-muted"><b>USN: </b>${task.student_usn}</h6>`;
                        data += `<h6 class="card-subtitle mb-2 text-muted"><b>Name: </b>${task.student_name}</h6>`;
                        data += `</div>`;
                        data += `</div>`;
                        data += `</div>`;
                    });
                    cardsContainer.innerHTML = data;
                }
                populateUsnDropdown();
                }
                })
                
}


//This function is called when add task button is clicked
function handleAddTask(){
    $("#addTaskModal").modal("hide");
    let title = document.getElementById("title").value;
    let deadline = document.getElementById("deadline").value;
    let student_usn = document.getElementById("assignedTo").value;
    let form_data={
        task_name:title,
        task_deadline:deadline,
        student_usn:student_usn
    }
    $.ajax({
        type:"POST",
        url:"http://127.0.0.1:5000/add-task",
        data:form_data,
        success: function(response){
            if(response.Status="Success")
                renderCards();
            else
                alert("Task Addition Failed");
        }
    })
}





