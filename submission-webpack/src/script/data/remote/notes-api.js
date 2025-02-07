const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  // Create a new note
  static createNote(newNotes) {
    return fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNotes),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to create note`));
        }
      })
      .then((responseJson) => {
        responseJson;
      });
  }

  // Get all non-archived notes
  static getNotes() {
    return fetch(`${BASE_URL}/notes`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to retrieve notes`));
        }
      })
      .then((responseJson) => responseJson.data);
  }

  static searchNote(notes, query) {
    return notes
      .filter((note) => {
        const loweredCaseQuery = query.toLowerCase();
        const jammedQuery = loweredCaseQuery.replace(/\s/g, "");

        /// title
        const loweredCaseNoteTitle = (note.title || "-").toLowerCase();
        const jammedNoteTitle = loweredCaseNoteTitle.replace(/\s/g, "");

        /// body
        const loweredCaseNoteBody = (note.body || "-").toLowerCase();
        const jammedNoteBody = loweredCaseNoteBody.replace(/\s/g, "");

        return (
          jammedNoteTitle.includes(jammedQuery) ||
          jammedNoteBody.includes(jammedQuery)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all archived notes
  static getArchivedNotes() {
    return fetch(`${BASE_URL}/notes/archived`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
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
        if (response.status >= 200 && response.status < 300) {
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
      method: "POST",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
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
      method: "POST",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
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
      method: "DELETE",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Failed to delete note`));
        }
      })
      .then((responseJson) => responseJson);
  }
}

export default NotesApi;
