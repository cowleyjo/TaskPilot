var submit = document.getElementById("submit");

submit.onclick = async function() {
    const data = {
        name: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }

    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "same-origin"
        });

        const resText = await res.text();

        if (!res.ok) {
            console.error("Register API Error:", res.status, res.statusText, resText);
            throw new Error("Failed to create user");
        }

        // Try to parse JSON, fallback to raw text
        let user;
        try {
            user = JSON.parse(resText);
        } catch {
            user = resText;
        }
        console.log(user);

    } catch (err) {
        console.error("Submission error:", err);
        alert("Error occurred! Check console for details."); // optional popup
        // window.location.href = "error.html";
    }

}