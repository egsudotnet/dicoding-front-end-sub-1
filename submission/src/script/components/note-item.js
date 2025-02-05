class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
  };

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        transition: transform 0.3s ease;
      }

      :host(:hover) {
        transform: translateY(-5px);
      }

      .card {
        padding: 20px;
        border: none;
        border-radius: 12px;
        // background: linear-gradient(145deg, #6a82fb, #fc5c7d);
        background: linear-gradient(145deg, #3674B5, #7CA5D2FF);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        color: white;
        transition: all 0.3s ease;
        height: 200px; /* Set height to a fixed value */
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Ensures proper spacing for the card content */
      }

      .note-info {
        padding: 10px 0;
        flex-grow: 1; /* Allows the description to take remaining space if needed */
      }

      .note-info__title h2 {
        font-weight: bold;
        margin: 0;
        font-size: 24px;
        color: white;
      }

      .note-info__description p {
        margin-top: 10px;
        color: white;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; /* Max 4 lines */
      }

      .fan-art-note {
        text-align: right;
        font-size: 14px;
        color: #dcdcdc;
        margin-top: 10px;
        font-style: italic;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
      }

      button {
        padding: 8px 16px;
        margin-left: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s, transform 0.3s;
      }

      .edit-btn {
        background-color: #3498db;
        color: white;
      }

      .archive-btn {
        background-color: #e74c3c;
        color: white;
      }

      button:hover {
        opacity: 0.9;
        transform: scale(1.05);
      }

      .edit-btn:hover {
        background-color: #2980b9;
      }

      .archive-btn:hover {
        background-color: #c0392b;
      }
    `;
  }

  _formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  }

  _handleEdit() {
    const event = new CustomEvent('edit-note', {
      detail: this._note,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _handleArchive() {
    const event = new CustomEvent('archive-note', {
      detail: this._note.id,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    this._emptyContent();
    this._updateStyle();
    
    this._shadowRoot.appendChild(this._style);

    // Create main card element
    const card = document.createElement('div');
    card.classList.add('card');

    // Create note info section
    const noteInfo = document.createElement('div');
    noteInfo.classList.add('note-info');
    noteInfo.innerHTML = `
      <div class="note-info__title">
        <h2>${this._note.title}</h2>
      </div>
      <div class="note-info__description">
        <p>${this._note.body}</p>
      </div>
    `;

    // Create date element
    const dateElement = document.createElement('div');
    dateElement.classList.add('fan-art-note');
    dateElement.innerHTML = `<i>${this._formatDate(this._note.createdAt)}</i>`;

    // Create action buttons (edit & archive)
    const actions = document.createElement('div');
    actions.classList.add('actions');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => this._handleEdit());

    const archiveButton = document.createElement('button');
    archiveButton.classList.add('archive-btn');
    archiveButton.textContent = 'Archive';
    archiveButton.addEventListener('click', () => this._handleArchive());

    // Append buttons to actions
    actions.appendChild(editButton);
    actions.appendChild(archiveButton);

    // Append elements to card
    card.appendChild(dateElement);
    card.appendChild(noteInfo);
    card.appendChild(actions);

    // Append card to shadow DOM
    this._shadowRoot.appendChild(card);
  }
}

customElements.define('note-item', NoteItem);
