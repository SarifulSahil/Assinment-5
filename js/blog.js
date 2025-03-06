document.addEventListener('DOMContentLoaded', function() {
    // Load and display total donation amount from localStorage
    const totalDonation = document.getElementById('total-donation');
    if (localStorage.getItem('totalDonated')) {
        totalDonation.textContent = localStorage.getItem('totalDonated') + ' BDT';
    }
});