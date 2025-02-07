import Utils from "../utils.js";
// import Notes from '../data/local/notes.js';
import Notes from "../data/remote/notes-api.js";

const home = () => {
  const searchFormElement = document.querySelector("search-bar");
  const noteListContainerElement = document.querySelector("#noteListContainer");
  const noteQueryWaitingElement = document.querySelector("query-waiting");
  const noteLoadingElement = document.querySelector("search-loading");
  const noteListElement = noteListContainerElement.querySelector("note-list");
  const createFormElement = document.querySelector("input-bar"); // Form untuk membuat catatan

  /**
   * Menampilkan semua catatan yang ada
   */
  const showAllNotes = () => {
    showLoading();

    setTimeout(() => {
      Notes.getNotes()
        .then((result) => {
          displayResult(result);
          showNoteList();
        })
        .catch((error) => {
          Utils.showMessage(error, "error");
        });
    }, 1000);
  };

  /**
   * Menampilkan hasil pencarian catatan berdasarkan query
   */
  const showNote = (query = "", filter = "") => {
    showLoading();

    const lastFilter = localStorage.getItem("filter") || "archive";
    if (!filter) filter = lastFilter;
    const radio = searchFormElement.shadowRoot?.querySelector(
      `input[value="${filter}"]`,
    );
    if (radio) {
      radio.checked = true;
    }

    setTimeout(() => {
      if (filter == "unarchive") {
        Notes.getNotes()
          .then((result) => {
            const notes = Notes.searchNote(result, query);
            displayResult(notes);
            showNoteList();
          })
          .catch((error) => {
            Utils.showMessage(error, "error");
          });
      } else {
        Notes.getArchivedNotes()
          .then((result) => {
            const notes = Notes.searchNote(result, query);
            displayResult(notes);
            showNoteList();
          })
          .catch((error) => {
            Utils.showMessage(error, "error");
          });
      }
    }, 1000);
  };

  /**
   * Menampilkan daftar catatan dalam tampilan
   */
  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.note = note;

      // Tambahkan event listener untuk tombol archive & delete
      noteItemElement.addEventListener("archive", () =>
        onArchiveNoteHandler(note.id),
      );
      noteItemElement.addEventListener("delete", () =>
        onDeleteNoteHandler(note.id),
      );

      return noteItemElement;
    });

    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  /**
   * Event listener saat pencarian dilakukan
   */
  const onSearchHandler = (event) => {
    event.preventDefault();
    const { query, filter } = event.detail;
    showNote(query, filter);
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
  searchFormElement.addEventListener("search", onSearchHandler);

  // Tangani event saat catatan baru dibuat
  createFormElement.addEventListener("add-note", (event) => {
    const newNote = event.detail;

    Notes.createNote(newNote)
      .then((result) => {
        Utils.showMessage("Note successfully added!");
        showAllNotes();
      })
      .catch((error) => {
        Utils.showMessage(error, "error");
      });
  });

  noteListElement.addEventListener("archive-note", (event) => {
    const noteId = event.detail;

    const confirmation = confirm("Are you sure you want to archive this note?");
    if (confirmation) {
      Notes.archiveNote(noteId)
        .then((response) => {
          if (response.status === "success") {
            Utils.showMessage("Note successfully archived!");
            showNote();
          } else {
            Utils.showMessage(response.message, "error");
          }
        })
        .catch((error) => {
          Utils.showMessage(error, "error");
        });
    }
  });

  noteListElement.addEventListener("unarchive-note", (event) => {
    const noteId = event.detail;
    const confirmation = confirm(
      "Are you sure you want to unarchive this note?",
    );
    if (confirmation) {
      Notes.unarchiveNote(noteId)
        .then((response) => {
          if (response.status === "success") {
            Utils.showMessage("Note successfully unarchived!");
            showNote();
          } else {
            Utils.showMessage(response.message, "error");
          }
        })
        .catch((error) => {
          Utils.showMessage(error, "error");
        });
    }
  });

  noteListElement.addEventListener("delete-note", (event) => {
    const noteId = event.detail;
    const confirmation = confirm(
      "Are you sure you want to delete this record?",
    );
    if (confirmation) {
      Notes.deleteNote(noteId)
        .then((response) => {
          if (response.status === "success") {
            Utils.showMessage("Note successfully deleted!");
            showNote();
          } else {
            Utils.showMessage(response.message, "error");
          }
        })
        .catch((error) => {
          Utils.showMessage(error, "error");
        });
    }
  });

  // Tampilkan semua catatan saat halaman dimuat
  showAllNotes();
};

export default home;
