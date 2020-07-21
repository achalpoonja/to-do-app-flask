// inital setup : Checking if user is logged in and rendering cards
var userLoggedIn = localStorage.getItem("token");
if(!userLoggedIn){
    window.location.href="http://127.0.0.1:5000/login";
}else {
    renderTable();
}

//This function opens up the addUser form Modal 
function handleAddUser() {
    let name = document.getElementById("name").value;
    let usn = document.getElementById("usn").value;
    form_data={
        "student_usn":usn,
        "student_name":name
    }
    $.ajax({
        type:"POST",
        url:"http://127.0.0.1:5000/add-student",
        dataType:"JSON",
        data:form_data,
        success: function(response){
            if(response.Status=="Success"){
                $("#addModal").modal("hide");
                renderTable();
            }
            else
                alert("Addition Failed!");
        }
    })
}


function renderTable(){
    var tableContainer = document.getElementById("tableContainer");
    $.ajax({
        type:"GET",
        url:"http://127.0.0.1:5000/get-students",
        success: function(response){
            users=response.students;
            if (users.length < 1){
                tableContainer.innerHTML = `<h5 class="text-secondary mt-5 text-center">Sorry no Students Found!<h5>`;
             }else {
                 let data = `<table class="table table-light table-striped table-bordered mt-5"><thead class="thead-dark"><tr><th>USN</th><th>Name</th><th>Delete</th></tr></thead><tbody>`;
                 users.forEach(user => {
                     data += `<tr>`;
                     data += `<td>${user.student_usn}</td>`;
                     data += `<td>${user.student_name}</td>`;
                     data += `<td><button class="btn btn-danger" onclick="deleteUser('${user.student_usn}')">Delete</button></td>`;
                     data += `</tr>`;
                 });
                 data += `</tbody></table>`;
                 tableContainer.innerHTML = data;
             }
        }
    });
}

function deleteUser(usn){
    $.ajax({
        type:"DELETE",
        url:"http://127.0.0.1:5000/remove-student/"+usn,
        success: function(response){
            if(response.Status=="Success")
                window.location="http://127.0.0.1:5000/students"
            else
                alert("Failed to remove");
        }
    });
}


