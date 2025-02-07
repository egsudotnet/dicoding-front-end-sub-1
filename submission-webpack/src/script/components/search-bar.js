class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();

    // Ambil nilai filter dari localStorage saat komponen pertama kali dimuat
    const savedFilter = localStorage.getItem("filter");
    if (savedFilter) {
      const radioToCheck = this.shadowRoot.querySelector(
        `input[value="${savedFilter}"]`,
      );
      if (radioToCheck) {
        radioToCheck.checked = true;
      }
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.input.addEventListener("input", this.onSearchInput);
    this.radios.forEach((radio) =>
      radio.addEventListener("change", this.onRadioChange),
    );
  }

  removeEventListeners() {
    this.input.removeEventListener("input", this.onSearchInput);
    this.radios.forEach((radio) =>
      radio.removeEventListener("change", this.onRadioChange),
    );
  }

  onSearchInput = () => {
    this.dispatchSearchEvent();
  };

  onRadioChange = () => {
    const selectedFilter = this.selectedRadio
      ? this.selectedRadio.value
      : "archive";

    // Simpan ke localStorage
    localStorage.setItem("filter", selectedFilter);
    this.dispatchSearchEvent();
  };

  dispatchSearchEvent() {
    const query = this.input.value.trim();
    const filter = this.selectedRadio ? this.selectedRadio.value : "archive";

    this.dispatchEvent(
      new CustomEvent("search", {
        detail: { query, filter },
        bubbles: true,
        composed: true,
      }),
    );
  }

  get input() {
    return this.shadowRoot.querySelector("#searchInput");
  }

  get radios() {
    return this.shadowRoot.querySelectorAll("input[name='filter']");
  }

  get selectedRadio() {
    return this.shadowRoot.querySelector("input[name='filter']:checked");
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }

      /* Floating-form tanpa animasi */
      .floating-form {
        background: #f6f8fa;
        border: 1px solid #d0d7de;
        padding: 10px 35px 10px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .form-group {
        position: relative;
        flex: 1;
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
        background-color: #f6f8fa;
        padding: 0 6px;
        color: #0969da;
      }

      /* Efek fokus */
      .form-group input:focus {
        border-color: #0969da;
        box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        outline: none;
      }

      /* Radio Button */
      .radio-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .radio-group label {
        font-size: 14px;
        color: #333;
        cursor: pointer;
      }

      input[type="radio"] {
        accent-color: #0969da;
        cursor: pointer;
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
          width: 400px;
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <div class="container">
        <div class="floating-form">
          <div class="radio-group">
            <input type="radio" id="unarchive" name="filter" value="unarchive" checked/>
            <label for="unarchive">Active</label>
            <input type="radio" id="archive" name="filter" value="archive" />
            <label for="archive">Archive</label>
          </div>
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

customElements.define("search-bar", SearchBar);
