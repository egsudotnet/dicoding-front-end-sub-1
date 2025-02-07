const notes = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, archive it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Discuss project updates and assign tasks for the upcoming week.",
    createdAt: "2022-08-05T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2022-08-10T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language.",
    createdAt: "2022-08-15T18:12:55.789Z",
    archived: false,
  },
  {
    id: "notes-LMN-456789",
    title: "Recipe: Spaghetti Bolognese",
    body: "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
    createdAt: "2022-08-20T12:30:40.200Z",
    archived: false,
  },
  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2022-08-25T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: "2022-09-01T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2022-09-07T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2022-09-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2022-09-20T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on October 1st.",
    createdAt: "2022-09-28T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2022-10-05T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2022-10-12T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2022-10-20T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice Spanish vocabulary for 30 minutes every day.",
    createdAt: "2022-10-28T08:00:20.120Z",
    archived: false,
  },
];

class Notes {
  /**
   * Mengembalikan semua catatan
   */
  static getAll() {
    return notes;
  }

  /**
   * Mencari catatan berdasarkan kata kunci dalam `body`
   * @param {string} query - Kata kunci pencarian
   * @returns {Array} - Daftar catatan yang cocok
   */
  static searchNote(query) {
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

  /**
   * Memilih catatan berdasarkan ID
   * @param {string} id - ID catatan yang dicari
   * @returns {Object|null} - Catatan yang ditemukan atau null jika tidak ada
   */
  static selectNoteById(id) {
    return notes.find((note) => note.id === id) || null;
  }

  /**
   * Membuat catatan baru
   * @param {Object} newNote - Data catatan baru (title, body)
   * @returns {Object} - Catatan yang baru dibuat
   */
  static createNote(newNote) {
    const newId = `notes-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    const note = {
      id: newId,
      title: newNote.title,
      body: newNote.body,
      createdAt,
      archived: false,
    };

    notes.push(note);
    return note;
  }

  /**
   * Memperbarui catatan berdasarkan ID
   * @param {string} id - ID catatan yang akan diperbarui
   * @param {Object} newData - Data baru yang ingin diperbarui
   * @returns {boolean} - True jika berhasil, false jika tidak ditemukan
   */
  static updateNote(id, newData) {
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) {
      return false; // Jika tidak ditemukan
    }

    notes[index] = { ...notes[index], ...newData }; // Update catatan dengan data baru
    return true; // Berhasil diperbarui
  }

  /**
   * mengarsipkan catatan berdasarkan ID
   * @param {string} id - ID catatan yang akan dihapus
   * @returns {boolean} - True jika berhasil dihapus, false jika tidak ditemukan
   */
  static archiveNote(id) {
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) {
      return false; // Jika tidak ditemukan
    }

    notes[index].archived = true; // Hapus catatan dari array
    return true; // Berhasil dihapus
  }
}

export default Notes;
