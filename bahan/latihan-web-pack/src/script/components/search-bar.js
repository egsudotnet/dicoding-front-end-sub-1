class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.input.addEventListener('input', this.onSearchInput);
  }

  removeEventListeners() {
    this.input.removeEventListener('input', this.onSearchInput);
  }

  onSearchInput = () => {
    const query = this.input.value.trim();
    this.dispatchEvent(new CustomEvent('search', {
      detail: { query },
      bubbles: true,
      composed: true,
    }));
  }

  get input() {
    return this.shadowRoot.querySelector('#searchInput');
  }

  render() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }

      /* Floating-form tanpa animasi */
      .floating-form {
        background: #f6f8fa;
        border: 1px solid #d0d7de;
        padding: 1px 28px 1px 1px;
        border-radius: 8px;
      }

      .form-group {
        position: relative;
      }

      .form-group input {
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #d0d7de;
        border-radius: 6px;
        font-size: 14px;
        background-color: #fff;
        transition: all 0.3s ease;
      }

      .form-group label {
        position: absolute;
        left: 14px;
        top: 12px;
        font-size: 14px;
        color: #6e7781;
        transition: all 0.3s ease;
        pointer-events: none;
      }

      /* Animasi label */
      .form-group input:focus + label,
      .form-group input:not(:placeholder-shown) + label {
        top: -8px;
        left: 10px;
        font-size: 12px;
        background-color: #fff;
        padding: 0 6px;
        color: #0969da;
      }

      /* Efek fokus */
      .form-group input:focus {
        border-color: #0969da;
        box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        outline: none;
      }

      /* RESPONSIVE LAYOUT */
      .container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      @media (max-width: 768px) {
        .container {
          justify-content: center;
        }
        .floating-form {
          width: 100%;
        }
      }

      @media (min-width: 769px) {
        .floating-form {
          width: 350px;
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <div class="container">
        <div class="floating-form">
          <div class="form-group">
            <input id="searchInput" name="search" type="text" required placeholder=" " />
            <label for="searchInput">Search...</label>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(style);
  }
}

customElements.define('search-bar', SearchBar);
