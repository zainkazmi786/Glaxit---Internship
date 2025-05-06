
const token = localStorage.getItem('token');
// Function to add a new idea
async function addIdea() {
    const title = document.getElementById('idea_title').value.trim();
    const category = document.getElementById('idea_category').value.trim();
    const description = document.getElementById('idea_description').value.trim();

    if (!title || !category || !description) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/ideas', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`

             },
            body: JSON.stringify({ title, category, description })
        });

        const data = await res.json();
        if (res.ok) {
            showMessage('Idea added successfully!', 'success');
            getIdeas();
            document.getElementById('idea_title').value = '';
            document.getElementById('idea_category').value = '';
            document.getElementById('idea_description').value = '';
        } else {
            showMessage(data.error || 'Failed to add idea', 'error');
        }
    } catch (error) {
        showMessage('Network error while adding idea', 'error');
    }
}
// Function to get and display ideas
async function getIdeas() {
    const ideasList = document.getElementById('ideas_list');
    ideasList.innerHTML = '<div class="spinner"></div>';

    try {
        const res = await fetch('http://localhost:5000/api/ideas', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`

             }
        });
        const data = await res.json();
        console.log(data)
        if (data.length === 0) {
            ideasList.innerHTML = '<p>No ideas yet. Add your first idea above!</p>';
            return;
        }

        let html = '';
        data.forEach(idea => {
            html += `
                <div class="idea-card" data-id="${idea._id}">
                    <div class="idea-header">
                        <div class="idea-title">${idea.title}</div>
                        <div class="idea-category">${idea.category}</div>
                    </div>
                    <div class="idea-description">${idea.description}</div>
                    <div class="idea-actions">
                        <button class="edit-btn" onclick="editIdea('${idea._id}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="delete-btn" onclick="deleteIdea('${idea._id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            `;
        });

        ideasList.innerHTML = html;
    } catch (error) {
        showMessage('Error fetching ideas', 'error');
    }
}

// Function to edit an idea
let currentEditingId = null;

async function editIdea(id) {
    const res = await fetch(`http://localhost:5000/api/ideas/${id}`,{
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`

         }
     })
     const idea = await res.json()
     console.log(idea)
        
      
    document.getElementById('idea_title').value = idea.title;
    document.getElementById('idea_category').value = idea.category;
    document.getElementById('idea_description').value = idea.description;
    currentEditingId = id;

    const addButton = document.querySelector('.auth-form button');
    addButton.innerHTML = '<i class="fas fa-save"></i> Update Idea';
    addButton.onclick = updateIdea;
      
}

// Function to update an idea
async function updateIdea() {
    const title = document.getElementById('idea_title').value.trim();
    const category = document.getElementById('idea_category').value.trim();
    const description = document.getElementById('idea_description').value.trim();

    if (!title || !category || !description) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/ideas/${currentEditingId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`

             },
            body: JSON.stringify({ title, category, description })
        });
        const data = await res.json();
        if (res.ok) {
            showMessage('Idea updated successfully!', 'success');
            getIdeas();
            document.querySelector('.auth-form button').innerHTML = '<i class="fas fa-plus"></i> Add Idea';
            document.querySelector('.auth-form button').onclick = addIdea;
            document.getElementById('idea_title').value = '';
            document.getElementById('idea_category').value = '';
            document.getElementById('idea_description').value = '';
        } else {
            showMessage(data.error || 'Failed to update idea', 'error');
        }
    } catch (error) {
        showMessage('Error updating idea', 'error');
    }
}

// Function to delete an idea
async function deleteIdea(id) {
    if (!confirm('Are you sure you want to delete this idea?')) return;

    try {
        const res = await fetch(`http://localhost:5000/api/ideas/${id}`,{
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`

             }
        });
        if (res.ok) {
            showMessage('Idea deleted successfully!', 'success');
            getIdeas();
        } else {
            showMessage('Failed to delete idea', 'error');
        }
    } catch (error) {
        showMessage('Error deleting idea', 'error');
    }
}
// Function to show messages
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Load ideas when page loads
document.addEventListener('DOMContentLoaded', getIdeas);