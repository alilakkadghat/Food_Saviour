<h1>Project Setup Guide</h1>

<p>This project consists of a <strong>backend</strong> (Python/FastAPI) and a
<strong>frontend</strong> (Node.js).</p>

<h2>Prerequisites</h2>

<ul>
  <li>Python 3.8+</li>
  <li>Node.js (v16+ recommended)</li>
  <li>npm</li>
  <li>pip</li>
</ul>

<h2>Backend Setup</h2>

<ol>
  <li>
    <p><strong>Create and activate a virtual environment (optional but recommended)</strong></p>
    <pre><code>python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows</code></pre>
  </li>

  <li>
    <p><strong>Install backend dependencies</strong></p>
    <pre><code>pip install -r requirements.txt</code></pre>
  </li>

  <li>
    <p><strong>Run the backend server</strong></p>
    <pre><code>uvicorn main:app --reload</code></pre>
    <p>Update <code>main:app</code> if your FastAPI app is defined elsewhere.</p>
  </li>
</ol>

<p>The backend will run at:</p>
<pre><code>http://127.0.0.1:8000</code></pre>

<h2>Frontend Setup</h2>

<ol>
  <li>
    <p><strong>Navigate to the frontend directory</strong></p>
    <pre><code>cd frontend</code></pre>
  </li>

  <li>
    <p><strong>Install frontend dependencies</strong></p>
    <pre><code>npm install</code></pre>
  </li>

  <li>
    <p><strong>Start the frontend application</strong></p>
    <pre><code>npm start</code></pre>
  </li>
</ol>

<p>The frontend will typically run at:</p>
<pre><code>http://localhost:3000</code></pre>

<h2>Running the Full Application</h2>

<ul>
  <li>Start the backend using <code>uvicorn</code></li>
  <li>Start the frontend using <code>npm start</code></li>
  <li>Ensure both servers are running simultaneously</li>
</ul>

<h2>Notes</h2>

<ul>
  <li>Update environment variables if required</li>
  <li>Ensure backend and frontend ports are correctly configured</li>
</ul>
