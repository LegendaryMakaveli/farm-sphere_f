async function run() {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0X3gzQGV4YW1wbGUuY29tIiwicm9sZXMiOiJVU0VSIiwidXNlcklkIjo0LCJmaXJzdE5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ1c2VyIiwicGhvbmUiOiIwODAxMTExMjIyMiIsImlhdCI6MTc3NjEzNzQ4MSwiZXhwIjoxNzc2MjIzODgxfQ.hPHUNdoAHFoUdlhZXfW08uNyqrtmt9rDgKWj071KdWg";
  try {
    const res = await fetch("http://localhost:8080/auth/profile/status", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    const data = await res.json();
    console.log("PROFILE STATUS RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Error:", err);
  }
}
run();
