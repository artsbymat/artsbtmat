/**
 * Menambahkan interaktivitas zoom/pan/enlarge pada container SVG Excalidraw.
 * @param {HTMLElement} container
 */
export function SVGZoomPan(container) {
  if (!container) return;
  const svgElement = container.querySelector("svg.excalidraw-svg");
  if (!svgElement) return;

  const clickToEnlarge = "Click and hold to enlarge. SHIFT + wheel to zoom. ESC to reset.";
  const clickToCollapse = "ESC to reset. Click and hold to collapse. SHIFT + wheel to zoom";

  let isEnlarged = false;
  let timeout = null;
  let isReadyToPan = false;
  let isPanning = false;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let panStartX = 0;
  let panStartY = 0;

  const textDiv = document.createElement("div");
  textDiv.className = "text";
  textDiv.textContent = clickToEnlarge;
  container.appendChild(textDiv);

  const applyTransform = () => {
    svgElement.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
  };

  const enablePointerEvents = (val) => {
    svgElement.querySelectorAll("a").forEach((el) => {
      el.style.pointerEvents = val ? "all" : "none";
    });
  };

  // Wheel zoom
  const handleWheel = (event) => {
    if (!event.shiftKey) return;
    zoomLevel += event.deltaY > 0 ? -0.1 : 0.1;
    zoomLevel = Math.max(0.4, Math.min(zoomLevel, 12));
    applyTransform();
  };

  // Panning
  const handleMouseDown = (event) => {
    isReadyToPan = true;
    panStartX = event.clientX;
    panStartY = event.clientY;
  };

  const handleMouseMove = (event) => {
    if (!isReadyToPan) return;
    const deltaX = event.clientX - panStartX;
    const deltaY = event.clientY - panStartY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    if (distance > 20) {
      if (!isPanning) {
        enablePointerEvents(false);
        isPanning = true;
      }
      panX += deltaX / zoomLevel;
      panY += deltaY / zoomLevel;
      panStartX = event.clientX;
      panStartY = event.clientY;
      applyTransform();
    }
  };

  const handleMouseUp = () => {
    enablePointerEvents(true);
    isPanning = false;
    isReadyToPan = false;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      enablePointerEvents(true);
      isEnlarged = false;
      isPanning = false;
      isReadyToPan = false;
      container.classList.remove("enlarged");
      textDiv.textContent = clickToEnlarge;
      zoomLevel = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    }
  };

  const handleHold = () => {
    if (isPanning) return;
    isReadyToPan = false;
    if (isEnlarged) {
      container.classList.remove("enlarged");
      textDiv.textContent = clickToEnlarge;
    } else {
      container.classList.add("enlarged");
      textDiv.textContent = clickToCollapse;
    }
    isEnlarged = !isEnlarged;
  };

  const handleMouseDownHold = () => {
    timeout = setTimeout(handleHold, 1000);
  };

  const handleMouseUpHold = () => {
    if (timeout) clearTimeout(timeout);
  };

  svgElement.addEventListener("wheel", handleWheel);
  svgElement.addEventListener("mousedown", handleMouseDown);
  svgElement.addEventListener("mousemove", handleMouseMove);
  svgElement.addEventListener("mouseup", handleMouseUp);
  svgElement.addEventListener("mouseleave", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown);
  svgElement.addEventListener("mousedown", handleMouseDownHold);
  svgElement.addEventListener("mouseup", handleMouseUpHold);

  applyTransform();

  // Cleanup on unmount
  return () => {
    svgElement.removeEventListener("wheel", handleWheel);
    svgElement.removeEventListener("mousedown", handleMouseDown);
    svgElement.removeEventListener("mousemove", handleMouseMove);
    svgElement.removeEventListener("mouseup", handleMouseUp);
    svgElement.removeEventListener("mouseleave", handleMouseUp);
    svgElement.removeEventListener("mousedown", handleMouseDownHold);
    svgElement.removeEventListener("mouseup", handleMouseUpHold);
    document.removeEventListener("keydown", handleKeyDown);
  };
}
