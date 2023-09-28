document.addEventListener('DOMContentLoaded', () => {
    // Handle Registration Modal
    const registrationModal = document.getElementById('registration-modal');
    
    if (registrationModal) {
        if (sessionStorage.getItem('userJustRegistered') === 'true') {
            registrationModal.classList.remove('hidden');
            sessionStorage.removeItem('userJustRegistered');
        }

        registrationModal.querySelector('.close').addEventListener('click', () => {
            registrationModal.classList.add('hidden');
        });
    }
    
    const logoutButton = document.getElementById('logoutButton');
    
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
            });
    
            if (response.ok) {
                // If logout is successful, redirect to the home page or login page
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                console.error('Error logging out:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function createNewConversation() {
        const createResponse = await fetch('/conversations', {
            method: 'POST',
            credentials: 'include',
        });
        if (createResponse.ok) {
            const createData = await createResponse.json();
            return createData.conversationId;
        } else {
            const errorData = await createResponse.json();
            throw new Error(errorData.error);
        }
    }
    
    async function getConversationId() {
        try {
            const response = await fetch('/conversations/latest', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                return data.conversationId ?? await createNewConversation();
            } else if (response.status === 404) {
                // If no conversation found, create a new one
                return await createNewConversation();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error('Error fetching or creating conversation ID:', error);
            return null;
        }
    }
    

// Fetch Conversations when the chat page is loaded
fetch('/conversations')
.then(response => response.json())
.then(conversations => {
    // Get the history-list element
    const historyList = document.getElementById('history-list');

    // Clear any existing items
    historyList.innerHTML = '';

    // Append each conversation to the history-list
    conversations.forEach(conversation => {
        const listItem = document.createElement('li');
        listItem.dataset.date = conversation.createdAt;
        
        
        // Format the date
        const date = new Date(conversation.createdAt);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options); // Example: Thursday, September 28, 2023
        
        listItem.innerHTML = `${formattedDate}`;
        listItem.addEventListener('click', function () {
            onConversationClick(conversation.id);
        });
        historyList.appendChild(listItem);
    });
})
.catch(error => console.error('Error fetching conversations:', error));

// Function to handle conversation click
function onConversationClick(conversationId) {
// Fetch messages for the clicked conversation
fetch(`/conversations/${conversationId}`)
    .then(response => response.json())
    .then(messages => {
        // Get the ai-response element
        const aiResponse = document.getElementById('ai-response');

        // Clear any existing messages
        aiResponse.innerHTML = '';

        // Append each message to the ai-response
        messages.forEach(message => {
            const messagePara = document.createElement('p');
            messagePara.classList.add('text-base', 'font-mono');
            messagePara.textContent = message.content;
            aiResponse.appendChild(messagePara);
        });
    })
    .catch(error => console.error('Error fetching conversation:', error));
}


      
    // Wellness Form Submission
    const wellnessForm = document.querySelector('#wellness-form');
    if (wellnessForm) {
        wellnessForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const message = document.querySelector('#query').value;
            const conversationId = await getConversationId();
            
            if (conversationId === null) {
                alert('Could not fetch or create a conversation ID.');
                return;
            }

            try {
                const response = await fetch(`/conversations/${conversationId}/ai`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ message })
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiResponse = document.querySelector('#ai-response');
                    aiResponse.innerHTML = `<p class="text-base font-mono">${data.aiMessage}</p>`;
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }         
    
});
