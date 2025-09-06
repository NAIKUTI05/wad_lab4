// Form validation and submission
const regForm = document.getElementById('regForm');
const liveRegion = document.getElementById('live');

regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const errors = [];

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const programme = document.getElementById('programme').value;
    const year = document.querySelector('input[name="year"]:checked');
    const interests = document.getElementById('interests').value.trim();
    const photo = document.getElementById('photo').value.trim();

    // Reset error messages
    document.querySelectorAll('.error').forEach(err => err.textContent = '');
    liveRegion.textContent = '';

    // Validate first name
    if (!firstName) {
        document.getElementById('err-firstName').textContent = 'First name is required.';
        errors.push('First name is required.');
        isValid = false;
    }

    // Validate last name
    if (!lastName) {
        document.getElementById('err-lastName').textContent = 'Last name is required.';
        errors.push('Last name is required.');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('err-email').textContent = 'Please enter a valid email.';
        errors.push('Invalid email.');
        isValid = false;
    }

    // Validate programme
    if (!programme) {
        document.getElementById('err-programme').textContent = 'Programme is required.';
        errors.push('Programme is required.');
        isValid = false;
    }

    // Validate year
    if (!year) {
        document.getElementById('err-year').textContent = 'Year of study is required.';
        errors.push('Year of study is required.');
        isValid = false;
    }

    // Validate photo URL (optional, but must be valid if provided)
    if (photo && !/^https?:\/\/.+$/.test(photo)) {
        document.getElementById('err-photo').textContent = 'Please enter a valid URL.';
        errors.push('Invalid photo URL.');
        isValid = false;
    }

    if (!isValid) {
        liveRegion.textContent = 'Please fix errors before submitting.';
        return;
    }

    // Create data object
    const data = {
        id: Date.now(), // Unique ID for each entry
        firstName,
        lastName,
        email,
        programme,
        year: year ? year.value : '',
        interests,
        photo: photo || 'https://placehold.co/128'
    };

    // Add entry to cards and table
    addEntry(data);

    // Reset form
    regForm.reset();
    liveRegion.textContent = 'Student added successfully!';
});

// Add entry to cards and table
function addEntry(data) {
    // Create profile card
    const card = document.createElement('div');
    card.className = 'card-person';
    card.setAttribute('data-id', data.id);
    card.innerHTML = `
        <img src="${data.photo}" alt="Photo of ${data.firstName} ${data.lastName}">
        <div>
            <h3>${data.firstName} ${data.lastName}</h3>
            <p>
                <span class="badge">${data.programme}</span>
                <span class="badge">Year ${data.year}</span>
            </p>
            <p>${data.interests || 'No interests provided'}</p>
            <button class="remove-btn">Remove</button>
        </div>
    `;
    document.getElementById('cards').prepend(card);

    // Create table row
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', data.id);
    tr.innerHTML = `
        <td>${data.firstName} ${data.lastName}</td>
        <td>${data.programme}</td>
        <td>${data.year}</td>
        <td>${data.interests || 'None'}</td>
        <td><button class="remove-btn">Remove</button></td>
    `;
    document.querySelector('#summary tbody').prepend(tr);

    // Add remove event listeners
    const removeButtons = document.querySelectorAll(`[data-id="${data.id}"] .remove-btn`);
    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector(`.card-person[data-id="${data.id}"]`).remove();
            document.querySelector(`#summary tr[data-id="${data.id}"]`).remove();
            liveRegion.textContent = 'Student removed successfully!';
        });
    });
}