export function SVGZoomPan(container) {
  if (!container) return;
  const svgElement = container.querySelector("svg.excalidraw-svg");
  if (!svgElement) return;

  let isReadyToPan = false;
  let isPanning = false;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let panStartX = 0;
  let panStartY = 0;

  const applyTransform = () => {
    svgElement.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
  };

  const enablePointerEvents = (val) => {
    svgElement.querySelectorAll("a").forEach((el) => {
      el.style.pointerEvents = val ? "all" : "none";
    });
  };

  // Wheel zoom (SHIFT + scroll)
  const handleWheel = (event) => {
    if (!event.shiftKey) return;
    zoomLevel += event.deltaY > 0 ? -0.1 : 0.1;
    zoomLevel = Math.max(0.4, Math.min(zoomLevel, 12));
    applyTransform();
  };

  // Panning (drag)
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

  // Reset transform dengan ESC
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      enablePointerEvents(true);
      isPanning = false;
      isReadyToPan = false;
      zoomLevel = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    }
  };

  svgElement.addEventListener("wheel", handleWheel);
  svgElement.addEventListener("mousedown", handleMouseDown);
  svgElement.addEventListener("mousemove", handleMouseMove);
  svgElement.addEventListener("mouseup", handleMouseUp);
  svgElement.addEventListener("mouseleave", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown);

  applyTransform();

  // Cleanup on unmount
  return () => {
    svgElement.removeEventListener("wheel", handleWheel);
    svgElement.removeEventListener("mousedown", handleMouseDown);
    svgElement.removeEventListener("mousemove", handleMouseMove);
    svgElement.removeEventListener("mouseup", handleMouseUp);
    svgElement.removeEventListener("mouseleave", handleMouseUp);
    document.removeEventListener("keydown", handleKeyDown);
  };
}
