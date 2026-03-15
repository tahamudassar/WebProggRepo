// app/page.js

export default async function Page() {
  // Fetch data from the Django API
  const res = await fetch('http://127.0.0.1:8000/api/hello/');
  
  // Ensure the response is in JSON format
  const data = await res.json();

  return (
    <div>
      <h1>Message from Django Backend:</h1>
      <p>{data.message}</p> {/* Display the message from the backend */}
    </div>
  );
}
