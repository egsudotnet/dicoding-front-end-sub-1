class InputBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.form.addEventListener("submit", this.onFormSubmit);
    this.titleInput.addEventListener("input", this.validateTitle);
    this.bodyInput.addEventListener("input", this.validateBody);
  }

  removeEventListeners() {
    this.form.removeEventListener("submit", this.onFormSubmit);
    this.titleInput.removeEventListener("input", this.validateTitle);
    this.bodyInput.removeEventListener("input", this.validateBody);
  }

  validateTitle = () => {
    const titleValue = this.titleInput.value.trim();
    let errorMessage = "";

    if (!titleValue) {
      errorMessage = "Title cannot be empty!";
    } else if (/\d/.test(titleValue)) {
      errorMessage = "Titles cannot contain numbers!";
    } else if (titleValue.length > 50) {
      errorMessage = "Title maximum 50 characters!";
    }

    this.titleError.textContent = errorMessage;
    this.updateValidationUI(this.titleInput, !errorMessage);
    return !errorMessage;
  };

  validateBody = () => {
    const bodyValue = this.bodyInput.value.trim();
    let errorMessage = "";

    if (!bodyValue) {
      errorMessage = "Description cannot be empty!";
    } else if (bodyValue.length > 500) {
      errorMessage = "Maximum description 500 characters!";
    }

    this.bodyError.textContent = errorMessage;
    this.updateValidationUI(this.bodyInput, !errorMessage);
    return !errorMessage;
  };

  updateValidationUI(input, isValid) {
    if (isValid) {
      input.classList.remove("invalid");
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
      input.classList.add("invalid");
    }
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    if (this.validateTitle() && this.validateBody()) {
      const newNote = {
        // // // id: Date.now(),
        title: this.titleInput.value.trim(),
        body: this.bodyInput.value.trim(),
        // // // createdAt: new Date().toISOString(),
      };

      this.dispatchEvent(
        new CustomEvent("add-note", {
          detail: newNote,
          bubbles: true,
          composed: true,
        }),
      );

      this.form.reset();
    }
  };

  get form() {
    return this.shadowRoot.querySelector("#inputForm");
  }

  get titleInput() {
    return this.shadowRoot.querySelector("#title");
  }

  get bodyInput() {
    return this.shadowRoot.querySelector("#body");
  }

  get titleError() {
    return this.shadowRoot.querySelector("#title-error");
  }

  get bodyError() {
    return this.shadowRoot.querySelector("#body-error");
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }

      /* Floating-form TANPA animasi */
      .floating-form {
        background: #f6f8fa;
        border: 1px solid #d0d7de;
        padding: 24px 50px 24px 24px;
        border-radius: 10px;
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
        width: 100%;
        padding: 12px;
        border: 2px solid #d0d7de;
        border-radius: 8px;
        font-size: 16px;
        background-color: #fff;
        transition: all 0.3s ease;
      }

      .form-group textarea {
        height: 120px;
        resize: vertical;
      }

      /* Efek animasi ketika input fokus */
      .form-group input:focus,
      .form-group textarea:focus {
        border-color: #0969da;
        box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        outline: none;
      }

      .form-group label {
        position: absolute;
        left: 12px;
        top: 14px;
        font-size: 16px;
        color: #6e7781;
        transition: all 0.3s ease;
      }

      .form-group input:focus + label,
      .form-group textarea:focus + label,
      .form-group input:not(:placeholder-shown) + label,
      .form-group textarea:not(:placeholder-shown) + label {
        top: -10px;
        left: 10px;
        font-size: 12px;
        background-color: #f6f8fa;
        padding: 0 6px;
        color: #0969da;
      }


      /* Animasi tombol tetap ada */
      .input-form button {
        padding: 12px;
        background-color: #2da44e;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        align-self: flex-start;
      }

      .input-form button:hover {
        background-color: #2c974b;
        transform: translateY(-2px);
      }

      /* Warna validasi input */
      .form-group input.valid,
      .form-group textarea.valid {
        border-color: #0969da;
      }

      .form-group input.invalid,
      .form-group textarea.invalid {
        border-color: #cf222e;
      }
        
    .error-message {
      color: #cf222e;
    }
    `;

    this.shadowRoot.innerHTML = `
      <div class="floating-form">
        <form id="inputForm" class="input-form">
          <div class="form-group">
            <input id="title" name="title" type="text" required placeholder=" " />
            <label for="title">Note Title</label>
            <div id="title-error" class="error-message"></div>
          </div>

          <div class="form-group">
            <textarea id="body" name="body" required placeholder=" "></textarea>
            <label for="body">Description</label>
            <div id="body-error" class="error-message"></div>
          </div>

          <button type="submit">Save Note</button>
        </form>
      </div>
    `;

    this.shadowRoot.appendChild(style);
  }
}

customElements.define("input-bar", InputBar);
