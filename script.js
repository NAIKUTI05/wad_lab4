// Student data storage
let students = [];
let studentToRemove = null;

// DOM elements
const regForm = document.getElementById('regForm');
const cardsContainer = document.getElementById('cardsContainer');
const summaryBody = document.getElementById('summaryBody');
const emptyState = document.getElementById('emptyState');
const liveRegion = document.getElementById('live');
const confirmationModal = document.getElementById('confirmationModal');
const confirmRemoveBtn = document.getElementById('confirmRemove');
const cancelRemoveBtn = document.getElementById('cancelRemove');
const modalCloseBtn = document.getElementById('modalClose');

// Validation functions
function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} is required.`;
    }
    return '';
}

function validateEmail(email) {
    if (!email) return 'Email is required.';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}

function validateURL(url) {
    if (!url || url.trim() === '') return '';
    
    try {
        new URL(url);
        return '';
    } catch (e) {
        return 'Please enter a valid URL.';
    }
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(`err-${fieldId}`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('error');
    }
}

// Clear error message
function clearError(fieldId) {
    const errorElement = document.getElementById(`err-${fieldId}`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
}

// Validate form on input change
document.querySelectorAll('#regForm input, #regForm select').forEach(element => {
    element.addEventListener('blur', function() {
        validateField(this.id, this.value);
    });
});

// Radio and checkbox validation
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        validateField('year', getSelectedValue('year'));
    });
});

// Field validation function
function validateField(fieldId, value) {
    let error = '';
    
    switch(fieldId) {
        case 'firstName':
        case 'lastName':
        case 'programme':
            error = validateRequired(value, fieldId === 'programme' ? 'Programme' : 
                                   fieldId === 'firstName' ? 'First name' : 'Last name');
            break;
        case 'email':
            error = validateEmail(value);
            break;
        case 'photo':
            error = validateURL(value);
            break;
        case 'year':
            error = validateRequired(value, 'Year of study');
            break;
    }
    
    if (error) {
        showError(fieldId, error);
    } else {
        clearError(fieldId);
    }
    
    return error === '';
}

// Get selected value for radio buttons
function getSelectedValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : '';
}

// Get selected values for checkboxes
function getSelectedValues(name) {
    const selected = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(selected).map(cb => cb.value);
}

// Form submission
regForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const programme = document.getElementById('programme').value;
    const year = getSelectedValue('year');
    const photo = document.getElementById('photo').value;
    const interests = getSelectedValues('interests');
    
    const isFirstNameValid = validateField('firstName', firstName);
    const isLastNameValid = validateField('lastName', lastName);
    const isEmailValid = validateField('email', email);
    const isProgrammeValid = validateField('programme', programme);
    const isYearValid = validateField('year', year);
    const isPhotoValid = validateField('photo', photo);
    
    const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && 
                      isProgrammeValid && isYearValid && isPhotoValid;
    
    if (isFormValid) {
        // Check for duplicate email
        if (students.some(student => student.email === email)) {
            showError('email', 'A student with this email already exists.');
            liveRegion.textContent = 'A student with this email already exists. Please use a different email.';
            return;
        }
        
        // Create student object
        const student = {
            id: Date.now(), // Simple unique ID
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            programme: programme,
            year: year,
            interests: interests,
            photo: photo.trim() || 'https://placehold.co/200x200?text=No+Photo'
        };
        
        // Add to students array
        students.push(student);
        
        // Update UI
        renderStudentCard(student);
        updateSummaryTable();
        
        // Reset form
        regForm.reset();
        
        // Announce success
        liveRegion.textContent = `Student ${firstName} ${lastName} has been successfully registered.`;
        
        // Hide empty state if it's the first student
        if (emptyState.style.display !== 'none') {
            emptyState.style.display = 'none';
        }
    } else {
        liveRegion.textContent = 'Please fix the errors in the form before submitting.';
    }
});

// Render student card
function renderStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', student.id);
    
    // Format interests as badges
    const interestsHTML = student.interests.length > 0 
        ? student.interests.map(interest => `<span class="badge">${interest}</span>`).join('')
        : '<span class="badge">No interests specified</span>';
    
    card.innerHTML = `
        <div class="card-header">
            <img src="${student.photo}" alt="${student.firstName} ${student.lastName}" class="card-avatar">
            <h3 class="card-name">${student.firstName} ${student.lastName}</h3>
            <p class="card-email">${student.email}</p>
        </div>
        <div class="card-body">
            <div class="card-detail">
                <span class="card-label">Programme:</span>
                <span>${student.programme}</span>
            </div>
            <div class="card-detail">
                <span class="card-label">Year:</span>
                <span class="badge badge-primary">Year ${student.year}</span>
            </div>
            <div class="card-detail">
                <span class="card-label">Interests:</span>
                <div>${interestsHTML}</div>
            </div>
        </div>
        <div class="card-actions">
            <button class="btn-remove" onclick="removeStudent(${student.id})">
                Remove
            </button>
        </div>
    `;
    
    // Add to container (prepend to show newest first)
    cardsContainer.prepend(card);
}

// Update summary table
function updateSummaryTable() {
    // Clear table body
    summaryBody.innerHTML = '';
    
    if (students.length === 0) {
        summaryBody.innerHTML = '<tr><td colspan="6" class="empty-state">No students registered yet</td></tr>';
        emptyState.style.display = 'block';
        return;
    }
    
    // Add rows for each student
    students.forEach(student => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', student.id);
        
        // Format interests as comma-separated list
        const interestsText = student.interests.length > 0 
            ? student.interests.join(', ')
            : 'None';
        
        row.innerHTML = `
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.programme}</td>
            <td>Year ${student.year}</td>
            <td>${interestsText}</td>
            <td class="actions-cell">
                <button class="btn-remove" onclick="removeStudent(${student.id})">
                    Remove
                </button>
            </td>
        `;
        
        summaryBody.appendChild(row);
    });
    
    // Hide empty state in cards container
    emptyState.style.display = 'none';
}

// Remove student
function removeStudent(studentId) {
    // Find student index
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        const student = students[studentIndex];
        
        // Remove from array
        students.splice(studentIndex, 1);
        
        // Remove from UI
        const cardElement = document.querySelector(`.card[data-id="${studentId}"]`);
        const rowElement = document.querySelector(`tr[data-id="${studentId}"]`);
        
        if (cardElement) cardElement.remove();
        if (rowElement) rowElement.remove();
        
        // Update empty state if needed
        if (students.length === 0) {
            emptyState.style.display = 'block';
            summaryBody.innerHTML = '<tr><td colspan="6" class="empty-state">No students registered yet</td></tr>';
        }
        
        // Announce removal
        liveRegion.textContent = `Student ${student.firstName} ${student.lastName} has been removed.`;
    }
}

// Modal event listeners
if (confirmRemoveBtn) {
    confirmRemoveBtn.addEventListener('click', function() {
        if (studentToRemove) {
            removeStudent(studentToRemove);
            studentToRemove = null;
            confirmationModal.style.display = 'none';
            confirmationModal.setAttribute('hidden', 'true');
        }
    });
}

if (cancelRemoveBtn) {
    cancelRemoveBtn.addEventListener('click', function() {
        studentToRemove = null;
        confirmationModal.style.display = 'none';
        confirmationModal.setAttribute('hidden', 'true');
    });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function() {
        studentToRemove = null;
        confirmationModal.style.display = 'none';
        confirmationModal.setAttribute('hidden', 'true');
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === confirmationModal) {
        studentToRemove = null;
        confirmationModal.style.display = 'none';
        confirmationModal.setAttribute('hidden', 'true');
    }
});

// Initialize with sample data for demonstration
window.addEventListener('DOMContentLoaded', function() {
    // Add a sample student for demonstration
    const sampleStudent = {
        id: 1,
        firstName: 'Nambinga',
        lastName: 'Naikuti',
        email: 'naikuti05@gmail.com',
        programme: 'Computer Science',
        year: '2',
        interests: ['Web Development', 'Data Analysis'],
        photo: 'https://tse1.mm.bing.net/th/id/OIP._GwgHgaQAkHlCRuO1-W2JQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
    };
    
    students.push(sampleStudent);
    renderStudentCard(sampleStudent);
    updateSummaryTable();
    
    // Hide empty state
    emptyState.style.display = 'none';
});