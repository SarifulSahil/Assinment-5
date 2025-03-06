document.addEventListener('DOMContentLoaded', function() {
    // Initialize donations in local storage if not exists
    if (!localStorage.getItem('donationHistory')) {
        localStorage.setItem('donationHistory', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('totalDonated')) {
        localStorage.setItem('totalDonated', '5500');
    }
    
    // Initialize card amounts in local storage if not exists
    if (!localStorage.getItem('cardAmounts')) {
        const initialAmounts = {
            noakhali: 0,
            feni: 600,
            quota: 2400
        };
        localStorage.setItem('cardAmounts', JSON.stringify(initialAmounts));
    }
    
    // Update card amounts from localStorage
    updateCardAmounts();

    // Update total donation display
    updateTotalDonation();

    // Handle tab switching
    const donationTab = document.getElementById('donation-tab');
    const historyTab = document.getElementById('history-tab');
    const donationContainer = document.getElementById('donation-container');
    const historyContainer = document.getElementById('history-container');

    donationTab.addEventListener('click', function() {
        donationTab.classList.add('bg-btngreen');
        donationTab.classList.remove('bg-white', 'border', 'border-gray-200');
        historyTab.classList.remove('bg-btngreen');
        historyTab.classList.add('bg-white', 'border', 'border-gray-200');
        donationContainer.classList.remove('hidden');
        historyContainer.classList.add('hidden');
    });

    historyTab.addEventListener('click', function() {
        historyTab.classList.add('bg-btngreen');
        historyTab.classList.remove('bg-white', 'border', 'border-gray-200');
        donationTab.classList.remove('bg-btngreen');
        donationTab.classList.add('bg-white', 'border', 'border-gray-200');
        historyContainer.classList.remove('hidden');
        donationContainer.classList.add('hidden');
        
        // Load and display history
        displayDonationHistory();
    });

    // Function to show the donation modal
    function showDonationModal() {
        const modal = document.getElementById('donation-modal');
        modal.classList.remove('hidden');
    }

    // Function to hide the donation modal
    function hideDonationModal() {
        const modal = document.getElementById('donation-modal');
        modal.classList.add('hidden');
    }

    // Close button event listener
    document.getElementById('close-modal').addEventListener('click', hideDonationModal);

    // Handle donate buttons
    const donateButtons = document.querySelectorAll('.donate-btn');
    donateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amountInput = this.previousElementSibling;
            const amount = parseInt(amountInput.value);
            const cause = amountInput.getAttribute('data-cause');
            const cardId = amountInput.getAttribute('data-card');
            
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid donation amount');
                return;
            }

            // Save donation to history
            saveDonation(amount, cause, cardId);
            
            // Clear input
            amountInput.value = '';
            
            // Update total and card amount
            updateTotalDonation();
            updateCardAmounts();
            
            // Show donation confirmation modal instead of alert
            showDonationModal();
        });
    });

    // Function to save donation to history and update card amount
    function saveDonation(amount, cause, cardId) {
        const donation = {
            amount: amount,
            cause: cause,
            date: new Date().toISOString(),
            cardId: cardId
        };

        // Get existing donations
        const donationHistory = JSON.parse(localStorage.getItem('donationHistory'));
        donationHistory.push(donation);
        
        // Save updated history
        localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
        
        // Update total amount
        const totalDonated = parseInt(localStorage.getItem('totalDonated')) + amount;
        localStorage.setItem('totalDonated', totalDonated.toString());
        
        // Update card amount
        const cardAmounts = JSON.parse(localStorage.getItem('cardAmounts'));
        cardAmounts[cardId] = (cardAmounts[cardId] || 0) + amount;
        localStorage.setItem('cardAmounts', JSON.stringify(cardAmounts));
    }

    // Function to update total donation display
    function updateTotalDonation() {
        const totalDonation = document.getElementById('total-donation');
        totalDonation.textContent = localStorage.getItem('totalDonated') + ' BDT';
    }
    
    // Function to update card amounts display
    function updateCardAmounts() {
        const cardAmounts = JSON.parse(localStorage.getItem('cardAmounts'));
        const cardAmountElements = document.querySelectorAll('.card-amount');
        
        cardAmountElements.forEach(element => {
            const cardId = element.closest('[data-card-id]').getAttribute('data-card-id');
            const amount = cardAmounts[cardId] || 0;
            element.textContent = amount + ' BDT';
            element.setAttribute('data-amount', amount);
        });
    }

    // Function to display donation history
    function displayDonationHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Clear previous history
        
        const donationHistory = JSON.parse(localStorage.getItem('donationHistory'));
        
        if (donationHistory.length === 0) {
            historyList.innerHTML = '<div class="text-center py-8"><p class="text-gray-500">No donation history yet</p></div>';
            return;
        }

        // Reverse to show newest first
        donationHistory.slice().reverse().forEach(donation => {
            const date = new Date(donation.date);
            const formattedDate = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            const historyItem = document.createElement('div');
            historyItem.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-100';
            historyItem.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${donation.amount} Taka is Donated for ${donation.cause}</h3>
                <p class="text-gray-600">Date: ${formattedDate} (Bangladesh Standard Time)</p>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
});