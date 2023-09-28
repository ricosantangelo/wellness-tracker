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

    async function fetchAndRenderConversations() {
        try {
            const conversations = await fetch('/conversations').then(response => response.json());
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = '';
            conversations.forEach(conversation => {
                const listItem = document.createElement('li');
                listItem.dataset.date = conversation.createdAt;
                const date = new Date(conversation.createdAt);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString(undefined, options);
                listItem.innerHTML = `${formattedDate}`;
                listItem.addEventListener('click', function () {
                    onConversationClick(conversation.id);
                });
                historyList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    }

    fetchAndRenderConversations();

    function onConversationClick(conversationId) {
        console.log('Conversation clicked:', conversationId);
        fetch(`/conversations/${conversationId}`)
            .then(response => response.json())
            .then(messages => {
                const aiResponse = document.getElementById('ai-response');
                aiResponse.innerHTML = '';
                messages.forEach(message => {
                    const messagePara = document.createElement('p');
                    messagePara.classList.add('text-base', 'font-mono');
                    messagePara.textContent = message.content;
                    aiResponse.appendChild(messagePara);
                });
            })
            .catch(error => console.error('Error fetching conversation:', error));
    }

    const wellnessForm = document.querySelector('#wellness-form');
    if (wellnessForm) {
        wellnessForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageInput = document.querySelector('#query');
            const message = messageInput.value;


            
            const conversationId = await getConversationId();
            if (conversationId === null) {
                alert('Could not fetch or create a conversation ID.');
                return;
            }
            loadingIcon.style.display = 'block';
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
                    fetchAndRenderConversations();
                    messageInput.value = '';
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            finally {
                // Hide the loading icon whether there was an error or not
                loadingIcon.style.display = 'none';
            }
        });
    }
});
