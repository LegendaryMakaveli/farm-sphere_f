async function run() {
  try {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test_x3@example.com",
        password: "Password123!"
      })
    });
    const data = await res.json();
    console.log("LOGIN RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Error:", err);
  }
}
run();
