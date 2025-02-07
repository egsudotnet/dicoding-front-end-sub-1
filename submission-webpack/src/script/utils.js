class Utils {
  static emptyElement(element) {
    element.innerHTML = "";
  }

  static showElement(element) {
    element.style.display = "block";
    element.hidden = false;
  }

  static hideElement(element) {
    element.style.display = "none";
    element.hidden = true;
  }

  static isValidInteger(newValue) {
    return Number.isNaN(newValue) || Number.isFinite(newValue);
  }
  static showMessage = (message = "", type = "success") => {
    const successMessage = document.createElement("div");
    successMessage.textContent = message;
    successMessage.className = "alert";
    successMessage.classList.add(type + "-alert");

    document.body.appendChild(successMessage); // Tambahkan ke body agar bisa diakses dari mana saja

    setTimeout(() => {
      successMessage.classList.add("show");
    }, 10);

    setTimeout(() => {
      successMessage.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 300);
    }, 3000);
  };
}

export default Utils;
