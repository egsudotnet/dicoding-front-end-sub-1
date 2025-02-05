class InputBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  connectedCallback() {
    const form = this._shadowRoot.querySelector('form');
    form.addEventListener('submit', (event) => this._onFormSubmit(event));

    // Event listener untuk validasi real-time
    this._shadowRoot.querySelector('#title').addEventListener('input', () => this._validateTitle());
    this._shadowRoot.querySelector('#body').addEventListener('input', () => this._validateBody());
  }

  disconnectedCallback() {
    const form = this._shadowRoot.querySelector('form');
    form.removeEventListener('submit', (event) => this._onFormSubmit(event));

    this._shadowRoot.querySelector('#title').removeEventListener('input', () => this._validateTitle());
    this._shadowRoot.querySelector('#body').removeEventListener('input', () => this._validateBody());
  }

  _validateTitle() {
    const titleInput = this._shadowRoot.querySelector('#title');
    const errorElement = this._shadowRoot.querySelector('#title-error');
    const titleValue = titleInput.value.trim();

    if (!titleValue) {
      errorElement.textContent = 'Title tidak boleh kosong!';
    } else if (/\d/.test(titleValue)) {
      errorElement.textContent = 'Title tidak boleh mengandung angka!';
    } else if (titleValue.length > 50) {
      errorElement.textContent = 'Title maksimal 50 karakter!';
    } else {
      errorElement.textContent = ''; // Jika valid, hapus error
    }
  }

  _validateBody() {
    const bodyInput = this._shadowRoot.querySelector('#body');
    const errorElement = this._shadowRoot.querySelector('#body-error');
    const bodyValue = bodyInput.value.trim();

    if (!bodyValue) {
      errorElement.textContent = 'Deskripsi tidak boleh kosong!';
    } else if (bodyValue.length > 500) {
      errorElement.textContent = 'Deskripsi maksimal 500 karakter!';
    } else {
      errorElement.textContent = ''; // Jika valid, hapus error
    }
  }

  _onFormSubmit(event) {
    event.preventDefault();

    // Ambil nilai dari input title & body
    const title = this._shadowRoot.querySelector('#title').value.trim();
    const body = this._shadowRoot.querySelector('#body').value.trim();

    this._validateTitle();
    this._validateBody();

    const titleError = this._shadowRoot.querySelector('#title-error').textContent;
    const bodyError = this._shadowRoot.querySelector('#body-error').textContent;

    if (titleError || bodyError) {
      return; // Jika ada error, jangan submit
    }

    // Buat event `add-note` dengan data catatan baru
    const newNote = {
      id: Date.now(), // ID unik menggunakan timestamp
      title,
      body,
      createdAt: new Date().toISOString(),
    };

    this.dispatchEvent(new CustomEvent('add-note', {
      detail: newNote,
      bubbles: true,
      composed: true,
    }));

    // Reset input form setelah submit
    this._shadowRoot.querySelector('form').reset();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }

      .floating-form {
        /*background: linear-gradient(145deg, #6a82fb, #fc5c7d);*/
        background: linear-gradient(145deg, #3674B5, #3674B5); 
        padding: 16px;
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }

      .input-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-group {
        position: relative;
      }

      .form-group input,
      .form-group textarea {
        width: 98%;
        padding: 14px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .form-group textarea {
        height: 80px;
        resize: vertical;
      }

      .form-group label {
        font-size: 1rem;
        font-weight: bold;
        color: white;
      }

      .error-message {
        color: red;
        font-size: 0.9rem;
        margin-top: 4px;
      }

      .input-form button {
        padding: 10px;
        background-color: cornflowerblue;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
      }

      .input-form button:hover {
        background-color: #fc5c7d;
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="floating-form">
        <form id="inputForm" class="input-form">
          <div class="form-group">
            <label for="title">Note Title</label>
            <input id="title" name="title" type="text" required />
            <div id="title-error" class="error-message"></div>
          </div>

          <div class="form-group">
            <label for="body">Description</label>
            <textarea id="body" name="body" required></textarea>
            <div id="body-error" class="error-message"></div>
          </div>

          <button type="submit">Save</button>
        </form>
      </div>
    `;
  }
}

customElements.define('input-bar', InputBar);
