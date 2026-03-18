document.addEventListener('DOMContentLoaded', function() {
    let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');

    function updateStats() {
        const statsData = {
            totalStudents: registrations.length,
            totalClubs: new Set(registrations.flatMap(r => r.clubs)).size,
            avgClubsPerStudent: (registrations.reduce((sum, r) => sum + r.clubs.length, 0) / registrations.length).toFixed(1),
            grade9: registrations.filter(r => r.grade === '9').length,
            grade10: registrations.filter(r => r.grade === '10').length,
            grade11: registrations.filter(r => r.grade === '11').length,
            grade12: registrations.filter(r => r.grade === '12').length
        };

        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <i class="fas fa-user-graduate"></i>
                <div class="stat-number">${statsData.totalStudents}</div>
                <div>Total Students</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-number">${statsData.totalClubs}</div>
                <div>Active Clubs</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-chart-line"></i>
                <div class="stat-number">${statsData.avgClubsPerStudent}</div>
                <div>Avg Clubs/Student</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-graduation-cap"></i>
                <div class="stat-number">${statsData.grade12}</div>
                <div>12th Graders</div>
            </div>
        `;
    }

    function updateTable() {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';

        registrations.slice(-10).reverse().forEach(registration => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${registration.name}</strong></td>
                <td>${registration.studentId}</td>
                <td>${registration.grade}th Grade</td>
                <td>${registration.clubs.join(', ')}</td>
                <td>${new Date(registration.timestamp).toLocaleDateString()}</td>
                <td>
                    <button class="btn" onclick="viewStudent('${registration.studentId}')" style="padding: 8px 16px; font-size: 0.9rem;">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn" onclick="deleteStudent('${registration.studentId}')" style="padding: 8px 16px; font-size: 0.9rem; background: #ff4757; color: white; margin-left: 5px;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function viewStudent(studentId) {
        const student = registrations.find(r => r.studentId === studentId);
        if (student) {
            alert(`Student Details:\n\nName: ${student.name}\nID: ${student.studentId}\nGrade: ${student.grade}th\nClubs: ${student.clubs.join(', ')}\nRegistered: ${new Date(student.timestamp).toLocaleString()}`);
        }
    }

    window.deleteStudent = function(studentId) {
        if (confirm('Are you sure you want to delete this registration?')) {
            registrations = registrations.filter(r => r.studentId !== studentId);
            localStorage.setItem('registrations', JSON.stringify(registrations));
            updateStats();
            updateTable();
        }
    };

    // Export data
    window.exportData = function() {
        const dataStr = JSON.stringify(registrations, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `club-registrations-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    // Initial load
    updateStats();
    updateTable();

    // Add export button
    const tableHeader = document.querySelector('.table-header');
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Data';
    exportBtn.style.cssText = 'margin-left: 1rem; padding: 10px 20px;';
    exportBtn.onclick = exportData;
    tableHeader.appendChild(exportBtn);
});
