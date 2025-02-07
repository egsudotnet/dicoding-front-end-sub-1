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
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
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
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        color: white;
        transition: all 0.3s ease;
        height: 200px; /* Set height to a fixed value */
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Ensures proper spacing for the card content */
      }

      .card.archive{
        background: linear-gradient(145deg, #597DA3FF, #97BDE7FF);
      }

      .card.unarchive{
        background: linear-gradient(145deg, #377742FF, #97BDE7FF);
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

      .archive-btn {
        background-color: #797A79FF;
        color: white;
      }
        
      .unarchive-btn {
        background-color: #2D8F48FF;
        color: white;
      }

      .delete-btn {
        background-color: #e74c3c;
        color: white;
      }

      button:hover {
        opacity: 0.9;
        transform: scale(1.05);
      }
 
      .archive-btn:hover {
        background-color: #6F7470FF;
      }
        
      .unarchive-btn:hover {
        background-color: #1E6632FF;
      }

      .delete-btn:hover {
        background-color: #AA392CFF;
      }

    `;
  }

  _formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  }

  _handleArchive() {
    const event = new CustomEvent("archive-note", {
      detail: this._note.id,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _handleUnarchive() {
    const event = new CustomEvent("unarchive-note", {
      detail: this._note.id,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _handleDelete() {
    const event = new CustomEvent("delete-note", {
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
    const card = document.createElement("div");
    card.classList.add("card");

    if (this._note.archived == true) {
      card.classList.add("archive");
    } else {
      card.classList.add("unarchive");
    }

    // Create note info section
    const noteInfo = document.createElement("div");
    noteInfo.classList.add("note-info");
    noteInfo.innerHTML = `
      <div class="note-info__title">
        <h2>${this._note.title}</h2>
      </div>
      <div class="note-info__description">
        <p>${this._note.body}</p>
      </div>
    `;

    // Create date element
    const dateElement = document.createElement("div");
    dateElement.classList.add("fan-art-note");
    dateElement.innerHTML = `<i>${this._formatDate(this._note.createdAt)}</i>`;

    // Create action buttons (archive & delete)
    const actions = document.createElement("div");
    actions.classList.add("actions");

    const archiveButton = document.createElement("button");
    archiveButton.classList.add("archive-btn");
    archiveButton.textContent = "Archive";
    archiveButton.addEventListener("click", () => this._handleArchive());

    const unarchiveButton = document.createElement("button");
    unarchiveButton.classList.add("unarchive-btn");
    unarchiveButton.textContent = "Unarchive";
    unarchiveButton.addEventListener("click", () => this._handleUnarchive());

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => this._handleDelete());

    // Append buttons to actions
    if (this._note.archived == true) {
      actions.appendChild(unarchiveButton);
    } else {
      actions.appendChild(archiveButton);
    }
    actions.appendChild(deleteButton);

    // Append elements to card
    card.appendChild(dateElement);
    card.appendChild(noteInfo);
    card.appendChild(actions);

    // Append card to shadow DOM
    this._shadowRoot.appendChild(card);
  }
}

customElements.define("note-item", NoteItem);
