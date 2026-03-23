document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const clubItems = document.querySelectorAll('.club-item');
    const selectedClubsDiv = document.getElementById('selectedClubs');
    let selectedClubs = [];
    const maxClubs = 3;

    // Club selection
    clubItems.forEach(item => {
        item.addEventListener('click', function() {
            const clubName = this.dataset.club;
            
            if (selectedClubs.includes(clubName)) {
                selectedClubs = selectedClubs.filter(club => club !== clubName);
                this.classList.remove('selected');
            } else if (selectedClubs.length < maxClubs) {
                selectedClubs.push(clubName);
                this.classList.add('selected');
            } else {
                alert(`Maximum ${maxClubs} clubs allowed!`);
            }
            
            updateSelectedClubs();
        });
    });

    function updateSelectedClubs() {
        if (selectedClubs.length > 0) {
            selectedClubsDiv.innerHTML = `Selected: ${selectedClubs.join(', ')} (${selectedClubs.length}/${maxClubs})`;
        } else {
            selectedClubsDiv.innerHTML = 'No clubs selected';
        }
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedClubs.length === 0) {
            alert('Please select at least one club!');
            return;
        }

        const formData = {
            name: document.getElementById('studentName').value,
            studentId: document.getElementById('studentId').value,
            year: document.getElementById('year').value,
                        clubs: selectedClubs,
            timestamp: new Date().toISOString()
        };

        // Simulate API call
        showSuccessMessage(formData);
    });

    function showSuccessMessage(data) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            margin-top: 1rem;
            animation: slideIn 0.5s ease;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h2>Registration Successful!</h2>
            <p><strong>${data.name}</strong> has been registered for:</p>
            <ul style="text-align: left; display: inline-block;">
                ${data.clubs.map(club => `<li>${club}</li>`).join('')}
            </ul>
            <p><em>Student ID: ${data.studentId}</em></p>
            <button onclick="window.location.href='admin.html'" class="btn" style="margin-top: 1rem; background: white; color: #667eea;">
                View in Admin Dashboard
            </button>
        `;
        
        document.querySelector('.form-card').appendChild(successDiv);
        form.style.display = 'none';
        
        // Store in localStorage for admin demo
        let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.push(data);
        localStorage.setItem('registrations', JSON.stringify(registrations));
    }
});
