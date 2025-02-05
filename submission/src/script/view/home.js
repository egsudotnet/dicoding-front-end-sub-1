import Utils from '../utils.js';
import Notes from '../data/local/notes.js';

const home = () => {
  const searchFormElement = document.querySelector('search-bar');
  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteQueryWaitingElement = document.querySelector('query-waiting');
  const noteLoadingElement = document.querySelector('search-loading');
  const noteListElement = noteListContainerElement.querySelector('note-list');
  const createFormElement = document.querySelector('input-bar'); // Form untuk membuat catatan 

  /**
   * Menampilkan semua catatan yang ada
   */
  const showAllNotes = () => {
    showLoading();
    const result = Notes.getAll();
    displayResult(result);
    showNoteList();
  };

  /**
   * Menampilkan hasil pencarian catatan berdasarkan query
   */
  const showNote = (query) => {
    showLoading();
    const result = Notes.searchNote(query);
    displayResult(result);
    showNoteList();
  };

  /**
   * Menampilkan daftar catatan dalam tampilan
   */
  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;

      // Tambahkan event listener untuk tombol edit & archive
      noteItemElement.addEventListener('edit', () => onUpdateNoteHandler(note.id));
      noteItemElement.addEventListener('archive', () => onArchiveNoteHandler(note.id));

      return noteItemElement;
    });

    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  // Tangani event saat catatan baru dibuat
  createFormElement.addEventListener('add-note', (event) => {
    const newNote = event.detail;
    Notes.createNote(newNote);
    showAllNotes();
  });

  /**
   * Event listener saat pencarian dilakukan
   */
  const onSearchHandler = (event) => {
    event.preventDefault();
    const { query } = event.detail;
    showNote(query);
  };

  /**
   * Event listener untuk menambahkan catatan baru
   */
  const onCreateNoteHandler = (event) => {
    event.preventDefault();

    const titleInput = document.querySelector('#noteTitle');
    const bodyInput = document.querySelector('#noteBody');

    if (titleInput.value.trim() === '' || bodyInput.value.trim() === '') {
      alert('Judul dan isi catatan tidak boleh kosong!');
      return;
    }

    Notes.createNote({
      title: titleInput.value,
      body: bodyInput.value,
    });

    titleInput.value = '';
    bodyInput.value = '';

    showAllNotes();
  };

  /**
   * Event listener untuk mengupdate catatan
   */
  const onUpdateNoteHandler = (id) => {
    const note = Notes.selectNoteById(id);
    if (!note) {
      alert('Catatan tidak ditemukan');
      return;
    }

    const newTitle = prompt('Edit Judul:', note.title);
    const newBody = prompt('Edit Isi:', note.body);

    if (newTitle && newBody) {
      Notes.updateNote(id, { title: newTitle, body: newBody });
      showAllNotes();
    }
  };

  /**
   * Event listener untuk mengarsipkan catatan
   */
  const onArchiveNoteHandler = (id) => {
    const confirmation = confirm('Apakah Anda yakin ingin mengarsipkan catatan ini?');
    if (confirmation) {
      Notes.archiveNote(id);
      showAllNotes();
    }
  };

  /**
   * Menampilkan daftar catatan
   */
  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  /**
   * Menampilkan loading saat mengambil data
   */
  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  /**
   * Menampilkan pesan menunggu input query
   */
  const showQueryWaiting = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteQueryWaitingElement);
  };

  // Event listener untuk pencarian
  searchFormElement.addEventListener('search', onSearchHandler);

  // Event listener untuk form penambahan catatan
  createFormElement.addEventListener('submit', onCreateNoteHandler);

  ///
  noteListElement.addEventListener('edit-note', (event) => {
    const note = event.detail;
    const newTitle = prompt('Edit Judul:', note.title);
    const newBody = prompt('Edit Isi:', note.body);
  
    if (newTitle && newBody) {
      Notes.updateNote(note.id, { title: newTitle, body: newBody });
      showAllNotes();
    }
  });
  
  ///
  noteListElement.addEventListener('archive-note', (event) => {
    const noteId = event.detail;
    const confirmation = confirm('Apakah Anda yakin ingin mengarsipkan catatan ini?');
    if (confirmation) {
      Notes.archiveNote(noteId);
      showAllNotes();
    }
  });
  
  // Tampilkan semua catatan saat halaman dimuat
  showAllNotes();
};

export default home;
