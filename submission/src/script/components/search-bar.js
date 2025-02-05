class SearchBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _searchEvent = 'search';
  _inputHandler = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  connectedCallback() {
    const input = this._shadowRoot.querySelector('input#name');

    // Simpan referensi event handler agar bisa dihapus nanti
    this._inputHandler = this._onSearchBarSubmit.bind(this);
    input.addEventListener('input', this._inputHandler);

    // Pencarian langsung saat halaman dimuat
    this._onSearchBarSubmit();
  }

  disconnectedCallback() {
    const input = this._shadowRoot.querySelector('input#name');
    if (this._inputHandler) {
      input.removeEventListener('input', this._inputHandler);
    }
  }

  _onSearchBarSubmit() {
    const query = this._shadowRoot.querySelector('input#name').value.trim();
    this.dispatchEvent(new CustomEvent(this._searchEvent, {
      detail: { query },
      bubbles: true,
    }));
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: inline;
      }

      .floating-form {
        /*background: linear-gradient(145deg, #6a82fb, #fc5c7d);*/
        background: linear-gradient(145deg, #3674B5, #7CA5D2FF);
        padding: 10px;
        border-radius: 5px;
        position: sticky;
        top: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .search-form {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .search-form .form-group {
        flex-grow: 1;
        position: relative;
      }

      .search-form .form-group input {
        display: block;
        width: 100%;
        height: 50px;
        padding: 5px;
        border-inline: none;
        border-block-start: none;
        border-block-end: none;
        font-size: 1rem;
        border-radius: 4px;
        outline: none;
      }

      .search-form .form-group input:focus-visible {
        outline: none;
      }
 

      .search-form button {
        padding: 12px 20px;
        background-color: white;
        color: cornflowerblue;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease, transform 0.3s ease;
      }

      .search-form button:hover {
        background-color: #dcdcdc;
        transform: scale(1.05);
      }
    `;
  }

  render() {
    this._shadowRoot.innerHTML = '';
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="floating-form">
        <form id="searchForm" class="search-form">
          <div class="form-group">
            <input id="name" name="name" type="search" required placeholder="Search ..."/>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);
