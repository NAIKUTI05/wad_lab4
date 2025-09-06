function validateEmail(value) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const err = document.getElementById("err-email");
  if (!ok) {
    err.textContent = "Please enter a valid email.";
  } else {
    err.textContent = "";
  }
  return ok;
}

function addEntry(data) {
  // Card
  const card = document.createElement("div");
  card.className = "card-person";
  card.innerHTML = `
    <img src="${data.photo || "https://placehold.co/128"}" alt="">
    <div>
      <h3>${data.first} ${data.last}</h3>
      <p>
        <span class="badge">${data.prog}</span>
        <span class="badge">Year ${data.year}</span>
      </p>
    </div>
  `;
  document.getElementById("cards").prepend(card);

  // Table
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.first} ${data.last}</td>
    <td>${data.prog}</td>
    <td>${data.year}</td>
  `;
  document.querySelector("#summary tbody").prepend(tr);
}

document.getElementById("regForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    first: document.getElementById("first").value,
    last: document.getElementById("last").value,
    email: document.getElementById("email").value,
    prog: document.getElementById("prog").value,
    year: document.querySelector("input[name='year']:checked")?.value,
    photo: document.getElementById("photo").value
  };

  if (!validateEmail(data.email)) {
    document.getElementById("live").textContent = "Fix errors before submitting.";
    return;
  }

  addEntry(data);
  document.getElementById("regForm").reset();
  document.getElementById("live").textContent = "Student added successfully!";
});
