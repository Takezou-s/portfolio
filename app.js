let negativeX = true;
let negativeY = false;
let disableX = false;
let disableY = false;
let perspective = 1000;
let maxDegX = 4;
let maxDegY = 10;
let deadRangeX = 1;
let deadRangeY = 1;

const rotatePerspectiveMouseMoveHandler = (el, event) => {
  if (el !== event.target) return;
  const pointerX = event.offsetX;
  const pointerY = event.offsetY;
  const deadAmountX = (el.offsetWidth * deadRangeX) / 100;
  const deadAmountY = (el.offsetHeight * deadRangeY) / 100;
  const minX = deadAmountX;
  const maxX = el.offsetWidth - deadAmountX;
  const minY = deadAmountY;
  const maxY = el.offsetHeight - deadAmountY;
  if (pointerX < minX || pointerX > maxX || pointerY < minY || pointerY > maxY) return;
  el.classList.remove("rotate-perspective");
  const midX = el.offsetWidth / 2;
  const midY = el.offsetHeight / 2;
  let rotateX = ((pointerY - midY) * maxDegX) / midY;
  let rotateY = ((pointerX - midX) * maxDegY) / midX;
  rotateX = negativeX ? -rotateX : rotateX;
  rotateY = negativeY ? -rotateY : rotateY;
  rotateX = disableX ? 0 : rotateX;
  rotateY = disableY ? 0 : rotateY;
  el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

const rotatePerspectiveMouseLeaveHandler = (el, event) => {
  el.classList.add("rotate-perspective");
  el.style.transform = `perspective(${perspective}px) rotateX(${0}deg) rotateY(${0}deg)`;
};

const expandClickHandler = (event) => {
  let parent = event.target;
  while (parent && !parent.classList.contains("project") && parent !== document.body) {
    parent = parent.parentElement;
  }
  if (!parent || parent === document.body) return;

  document.querySelector(".modal-title").textContent = parent.querySelector(".project-name").textContent;

  const img = document.createElement("img");
  const src = parent.querySelector(".project-img").src;
  img.src = src;
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";

  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = "";
  modalBody.append(img);
  img.onload = () => {
    if (img.naturalWidth > img.offsetWidth || img.naturalHeight > img.offsetHeight) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        if (img.style.maxWidth === "100%") {
          img.style.maxWidth = "";
          img.style.maxHeight = "";
          img.style.cursor = "zoom-out";
        } else {
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          img.style.cursor = "zoom-in";
        }
      });
    }
  };

  const footer = document.querySelector(".modal-footer");
  footer.innerHTML = "";
  footer.appendChild(parent.querySelector(".project-info").cloneNode(true));

  new bootstrap.Modal(".modal").show();
};

const rotatePerspectiveEls = document.querySelectorAll(`[data-rotate-pers="true"]`);
rotatePerspectiveEls.forEach((el) => {
  el.parentElement.addEventListener("mousemove", rotatePerspectiveMouseMoveHandler.bind(null, el));
  el.parentElement.addEventListener("mouseleave", rotatePerspectiveMouseLeaveHandler.bind(null, el));
});

const expandButtons = document.querySelectorAll("[data-expand='true']");
expandButtons.forEach((button) => {
  button.addEventListener("click", expandClickHandler);
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
