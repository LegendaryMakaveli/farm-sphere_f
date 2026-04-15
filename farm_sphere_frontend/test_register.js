async function run() {
  try {
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Test",
        secondName: "User",
        email: "test_x3@example.com",
        password: "Password123!",
        phoneNumber: "08011112222",
        gender: "MALE",
        age: 30,
        address: "123 Farm Road, Ota"
      })
    });
    const data = await res.json();
    console.log("REGISTER RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Error:", err);
  }
}
run();
