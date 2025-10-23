export function SVGZoomPan(container) {
  if (!container) return;
  const svgElement =
    container.querySelector("svg.excalidraw-svg") || container.querySelector("svg");
  if (!svgElement) return;

  // State
  let zoomLevel = 1;
  const MIN_ZOOM = 0.4;
  const MAX_ZOOM = 12;
  let panX = 0;
  let panY = 0;

  // Pointer state
  const pointers = new Map(); // pointerId -> { x, y }
  let isDragging = false;
  let isPinching = false;
  let lastRootX = 0;
  let lastRootY = 0;
  let lastPinchDist = 0;

  // Styles for smoother interaction
  svgElement.style.cursor = "grab";
  svgElement.style.userSelect = "none";
  svgElement.style.webkitUserSelect = "none";
  svgElement.style.touchAction = "none"; // enable pinch-zoom via pointer events

  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

  // Wrap contents in a group so we can use native SVG transforms (prevents blur)
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ensureViewportGroup = (svg) => {
    let g = svg.querySelector("g[data-zoom-pan-layer]");
    if (!g) {
      g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("data-zoom-pan-layer", "");
      const children = Array.from(svg.childNodes);
      children.forEach((node) => {
        if (node.nodeType === 1 && node.tagName && node.tagName.toLowerCase() === "defs") return;
        g.appendChild(node);
      });
      svg.appendChild(g);
    }
    return g;
  };

  const viewport = ensureViewportGroup(svgElement);

  const applyTransform = () => {
    viewport.setAttribute("transform", `translate(${panX} ${panY}) scale(${zoomLevel})`);
  };

  const enablePointerEvents = (val) => {
    svgElement.querySelectorAll("a").forEach((el) => {
      el.style.pointerEvents = val ? "all" : "none";
    });
  };

  const clientToSvg = (clientX, clientY) => {
    const pt = svgElement.createSVGPoint
      ? svgElement.createSVGPoint()
      : { x: 0, y: 0, matrixTransform: () => ({ x: 0, y: 0 }) };
    if (svgElement.createSVGPoint) {
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svgElement.getScreenCTM();
      if (!ctm) {
        const rect = svgElement.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
      }
      const inv = ctm.inverse();
      const r = pt.matrixTransform(inv);
      return { x: r.x, y: r.y };
    }
    const rect = svgElement.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const zoomAtRootPoint = (rootX, rootY, factor) => {
    const prev = zoomLevel;
    const next = clamp(prev * factor, MIN_ZOOM, MAX_ZOOM);
    if (next === prev) return;
    const worldX = (rootX - panX) / prev;
    const worldY = (rootY - panY) / prev;
    panX += (prev - next) * worldX;
    panY += (prev - next) * worldY;
    zoomLevel = next;
    applyTransform();
  };

  // Wheel zoom (SHIFT + scroll), zoom centered at cursor
  const handleWheel = (event) => {
    if (!event.shiftKey) return;
    event.preventDefault();
    const { x, y } = clientToSvg(event.clientX, event.clientY);
    const factor = Math.exp(-event.deltaY * 0.001);
    zoomAtRootPoint(x, y, factor);
  };

  // Pointer helpers
  const updatePointer = (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };

  const removePointer = (e) => {
    pointers.delete(e.pointerId);
  };

  const getTwoPointersData = () => {
    const vals = Array.from(pointers.values());
    const [p1, p2] = vals;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    return { dist, midX, midY };
  };

  // Panning / Pinch-to-zoom with Pointer Events
  const handlePointerDown = (e) => {
    svgElement.setPointerCapture?.(e.pointerId);
    updatePointer(e);
    if (pointers.size === 1) {
      isDragging = true;
      isPinching = false;
      const p = clientToSvg(e.clientX, e.clientY);
      lastRootX = p.x;
      lastRootY = p.y;
      enablePointerEvents(false);
      svgElement.style.cursor = "grabbing";
    } else if (pointers.size === 2) {
      isDragging = false;
      isPinching = true;
      const { dist } = getTwoPointersData();
      lastPinchDist = dist;
      enablePointerEvents(false);
      svgElement.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e) => {
    updatePointer(e);
    if (isPinching && pointers.size >= 2) {
      const { dist, midX, midY } = getTwoPointersData();
      if (lastPinchDist) {
        const factor = dist / lastPinchDist;
        const { x, y } = clientToSvg(midX, midY);
        zoomAtRootPoint(x, y, factor);
      }
      lastPinchDist = dist;
    } else if (isDragging && pointers.size === 1) {
      const p = clientToSvg(e.clientX, e.clientY);
      const dx = p.x - lastRootX;
      const dy = p.y - lastRootY;
      lastRootX = p.x;
      lastRootY = p.y;
      panX += dx;
      panY += dy;
      applyTransform();
    }
  };

  const handlePointerUp = (e) => {
    removePointer(e);
    if (pointers.size === 1) {
      // transition from pinch to single pointer drag
      const remaining = Array.from(pointers.values())[0];
      if (remaining) {
        isPinching = false;
        isDragging = true;
        const p = clientToSvg(remaining.x, remaining.y);
        lastRootX = p.x;
        lastRootY = p.y;
      }
    } else if (pointers.size === 0) {
      isDragging = false;
      isPinching = false;
      enablePointerEvents(true);
      svgElement.style.cursor = "grab";
      lastPinchDist = 0;
    }
  };

  // Double click to zoom in (Shift + double click to zoom out)
  const handleDblClick = (e) => {
    e.preventDefault();
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    const factor = e.shiftKey ? 1 / 1.6 : 1.6;
    zoomAtRootPoint(x, y, factor);
  };

  // Reset transform with ESC
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      enablePointerEvents(true);
      isDragging = false;
      isPinching = false;
      zoomLevel = 1;
      panX = 0;
      panY = 0;
      applyTransform();
      svgElement.style.cursor = "grab";
    }
  };

  svgElement.addEventListener("wheel", handleWheel, { passive: false });
  svgElement.addEventListener("pointerdown", handlePointerDown);
  svgElement.addEventListener("pointermove", handlePointerMove);
  svgElement.addEventListener("pointerup", handlePointerUp);
  svgElement.addEventListener("pointercancel", handlePointerUp);
  svgElement.addEventListener("pointerleave", handlePointerUp);
  svgElement.addEventListener("dblclick", handleDblClick);
  document.addEventListener("keydown", handleKeyDown);

  applyTransform();

  // Cleanup on unmount
  return () => {
    svgElement.removeEventListener("wheel", handleWheel, { passive: false });
    svgElement.removeEventListener("pointerdown", handlePointerDown);
    svgElement.removeEventListener("pointermove", handlePointerMove);
    svgElement.removeEventListener("pointerup", handlePointerUp);
    svgElement.removeEventListener("pointercancel", handlePointerUp);
    svgElement.removeEventListener("pointerleave", handlePointerUp);
    svgElement.removeEventListener("dblclick", handleDblClick);
    document.removeEventListener("keydown", handleKeyDown);
  };
}
