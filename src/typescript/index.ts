const navMenuButton = document.getElementById("nav-menu-button");

navMenuButton?.addEventListener?.("click", () => {
  document.getElementById("nav-menu-container")?.classList.toggle("hidden");
  Array.from(navMenuButton?.children).forEach((child) => {
    child.classList.toggle("opacity-0");
    child.classList.toggle("opacity-100");
  });
});