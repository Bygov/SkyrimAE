const joinBtn = document.getElementById("joinBtn");
const joinModal = document.getElementById("joinModal");
const joinClose = document.getElementById("joinClose");
const joinForm = document.getElementById("joinForm");

function openJoinModal() {
  if (!joinModal) return;
  joinModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeJoinModal() {
  if (!joinModal) return;
  joinModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (joinBtn) {
  joinBtn.addEventListener("click", openJoinModal);
}

// Исправлено с .click(closeJoinModal) на корректный addEventListener
if (joinClose) {
  joinClose.addEventListener("click", closeJoinModal);
}

if (joinModal) {
  joinModal.addEventListener("click", (e) => {
    if (e.target === joinModal || e.target.classList.contains("modal_dialog")) {
      closeJoinModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    joinModal &&
    joinModal.classList.contains("is-open")
  ) {
    closeJoinModal();
  }
});

if (joinForm) {
  joinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("joinName").value.trim();
    const email = document.getElementById("joinEmail").value.trim();
    const number = document.getElementById("joinNumber").value.trim();

    console.log("Join form submitted:", { name, email, number });

    joinForm.reset();
    closeJoinModal();
  });
}
