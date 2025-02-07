class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      div {
        padding: 20px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .brand-name {
        margin: 0;
        font-size: 1.8em;
        font-weight: bold;
        color: white;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      /* Gradient background for the app bar */
      :host {
        background:  #3674B5;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
      <div>
        <h1 class="brand-name">EgSu Notes</h1>
      </div>
    `;
  }
}

customElements.define("app-bar", AppBar);
