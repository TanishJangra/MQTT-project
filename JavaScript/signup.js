document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get user input
    var fullName = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Check if user already exists in local storage
    var existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    var userExists = existingUsers.some(function(user) {
        return user.email === email;
    });

    if (userExists) {
        alert("User already exists!");
    } else {
        // Save user to local storage
        var newUser = {
            fullName: fullName,
            email: email,
            password: password
        };
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        alert("Account created successfully!");

        // Redirect to user table page
        window.location.href = "usertable.html";
    }
});