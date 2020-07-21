var loginForm = document.getElementById("loginForm");
function handleLogin(e) {
    e.preventDefault();
    username=document.getElementById('username').value;
    password=document.getElementById('password').value;
    form_data={
        username:username,
        password:password
    };
    $.ajax({
        type:"POST",
        url:"http://127.0.0.1:5000/login",
        data:form_data,
        success: function(response){
            if(response.Status=="Success"){
                localStorage.setItem("token", username);
                window.location="http://127.0.0.1:5000"
            }
            else{
                alert("Invalid Username or Password!");
            }
        }
    });
}
loginForm.addEventListener('submit', handleLogin);