document.querySelector(".oliur-newsletter-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const email = form.email.value.trim();
  const msg = form.parentElement.querySelector(".form-msg");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.hidden = false;
    msg.className = "form-msg err";
    msg.textContent = "Please enter a valid email address.";
    return;
  }
  form.reset();
  msg.hidden = false;
  msg.className = "form-msg ok";
  msg.textContent = "Thanks — you're on the list.";
});
