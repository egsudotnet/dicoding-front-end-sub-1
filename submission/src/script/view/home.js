import Utils from '../utils.js';
import Notes from '../data/local/notes.js';

const home = () => {
  const searchFormElement = document.querySelector('search-bar');

  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteQueryWaitingElement = document.querySelector('query-waiting');
  const noteLoadingElement = document.querySelector('search-loading');
  const noteListElement = noteListContainerElement.querySelector('note-list');

  const showNote = (query) => {
    showLoading();

    const result = Notes.searchNote(query);
    displayResult(result);

    showNoteList();
  };

  const onSearchHandler = (event) => {
    event.preventDefault();

    const { query } = event.detail;
    showNote(query);
  };

  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;

      return noteItemElement;
    });

    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showQueryWaiting = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteQueryWaitingElement);
  };

  searchFormElement.addEventListener('search', onSearchHandler);
  showQueryWaiting();
};

export default home;
