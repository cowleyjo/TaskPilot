var submit = document.getElementById("submit");

submit.onclick = async function() {
    const data = {
        name: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "same-origin"
        });

        const resText = await res.text();

        if (!res.ok) {
            console.error("Login API Error:", res.status, res.statusText, resText);
            throw new Error("Failed to create user");
        }

    } catch (err) {
        console.error("Submission error:", err);
        alert("Error occurred! Check console for details."); // optional popup
        // window.location.href = "error.html";
    }

}