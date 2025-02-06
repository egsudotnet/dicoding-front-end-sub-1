const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class NotesApi {
  // Create a new note
  static createNote(newNotes) {
    return fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNotes),
    })
      .then((response) => {
        if (response.status >= "success") {
          
          this.showSuccessMessage("Note successfully added!");
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to create note`));
        }
      })
      .then((responseJson) => responseJson);
  }

  // Get all non-archived notes
  static getNotes() {
    return fetch(`${BASE_URL}/notes`)
      .then((response) => {
        if (response.status >= "success") {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to retrieve notes`));
        }
      })
      .then((responseJson) => responseJson.data);
  }

  // Get all archived notes
  static getArchivedNotes() {
    return fetch(`${BASE_URL}/notes/archived`)
      .then((response) => {
        if (response.status >= "success") {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to retrieve archived notes`));
        }
      })
      .then((responseJson) => responseJson.data);
  }

  // Get a single note by ID
  static getNoteById(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}`)
      .then((response) => {
        if (response.status >= "success") {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to retrieve note`));
        }
      })
      .then((responseJson) => responseJson.data);
  }

  // Archive a note
  static archiveNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}/archive`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status >= "success") {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to archive note`));
        }
      })
      .then((responseJson) => responseJson);
  }

  // Unarchive a note
  static unarchiveNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status >= "success") {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to unarchive note`));
        }
      })
      .then((responseJson) => responseJson);
  }

  // Delete a note
  static deleteNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status >= "success") {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to delete note`));
        }
      })
      .then((responseJson) => responseJson);
  }
  
  showSuccessMessage(message = "", type = "success") {
    const successMessage = document.createElement('div');
    successMessage.textContent = message;
    successMessage.className = type + '-message';
    this.shadowRoot.appendChild(successMessage);

    setTimeout(() => {
      successMessage.classList.add('show');
    }, 10);

    setTimeout(() => {
      successMessage.classList.remove('show');
      setTimeout(() => {
        this.shadowRoot.removeChild(successMessage);
      }, 300);
    }, 3000);
  }

}

export default NotesApi;
