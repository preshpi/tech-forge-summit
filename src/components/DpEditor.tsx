"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { clampOffset, drawDP, loadAssets, MAX_NAME, SIZE, type DpAssets, type DpState, type Photo } from "@/lib/drawDP";
import { THEMES, type ThemeId } from "@/lib/themes";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";
const FILENAME = "techforge-2-0-dp.png";

type LoadedPhoto = Photo & { release: () => void };

/** Decode a photo with EXIF orientation applied. Falls back to <img> where createImageBitmap can't. */
async function decodePhoto(file: File): Promise<LoadedPhoto> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode(); // browsers apply EXIF orientation to <img> by default
      return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => {} };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/** next/font gives the family a scoped name; read it from the variable the layout sets. */
async function loadFont() {
  const family =
    getComputedStyle(document.documentElement).getPropertyValue("--font-jakarta").trim() ||
    "'Plus Jakarta Sans', -apple-system, 'Helvetica Neue', Arial, sans-serif";
  // Canvas only triggers a font download lazily, so request every weight we draw with first.
  await Promise.all([500, 600, 700, 800].map(weight => document.fonts.load(`${weight} 40px ${family}`).catch(() => [])));
  await document.fonts.ready;
  return family;
}

export default function DpEditor() {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const photoRef = useRef<LoadedPhoto | null>(null);

  const [assets, setAssets] = useState<DpAssets | null>(null);
  const [font, setFont] = useState("");
  const [loadError, setLoadError] = useState("");
  const [theme, setTheme] = useState<ThemeId>("light");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const ready = Boolean(assets && font);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadAssets(), loadFont()])
      .then(([loadedAssets, family]) => {
        if (cancelled) return;
        setAssets(loadedAssets);
        setFont(family);
      })
      .catch(() => !cancelled && setLoadError("The DP maker couldn’t load. Check your connection and refresh the page."));
    return () => {
      cancelled = true;
    };
  }, []);

  // Free the decoded photo when it's replaced or the page unmounts.
  useEffect(() => {
    photoRef.current = photo;
  }, [photo]);
  useEffect(() => () => photoRef.current?.release(), []);

  const state = useCallback(
    (): DpState => ({ theme, name, photo, zoom, offsetX: offset.x, offsetY: offset.y, font }),
    [theme, name, photo, zoom, offset, font],
  );

  useEffect(() => {
    const ctx = previewRef.current?.getContext("2d");
    if (!ctx || !assets || !font) return;
    const frame = requestAnimationFrame(() => drawDP(ctx, state(), assets));
    return () => cancelAnimationFrame(frame);
  }, [assets, font, state]);

  async function acceptFile(file: File | null | undefined) {
    if (!file) return;
    setError("");
    const looksLikeImage = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
    if (!looksLikeImage) return setError("That file isn’t a photo. Try a JPG, PNG or WEBP.");
    if (file.size > MAX_FILE_BYTES) return setError("That photo is over 25 MB. Try a smaller one.");
    try {
      const next = await decodePhoto(file);
      photo?.release();
      setPhoto(next);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } catch {
      setError(
        /\.(heic|heif)$/i.test(file.name) || /hei[cf]/.test(file.type)
          ? "This browser can’t open HEIC photos. Try a JPG or PNG, or on iPhone choose “Most Compatible” in Camera settings."
          : "We couldn’t read that photo. Try a JPG, PNG or WEBP.",
      );
    }
  }

  function removePhoto() {
    photo?.release();
    setPhoto(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  function moveBy(dx: number, dy: number) {
    if (!photo) return;
    setOffset(current => clampOffset(photo, zoom, current.x + dx, current.y + dy));
  }

  function changeZoom(value: number) {
    setZoom(value);
    if (photo) setOffset(current => clampOffset(photo, value, current.x, current.y));
  }

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (!photo) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    // Screen pixels → canvas pixels.
    const scale = SIZE / event.currentTarget.getBoundingClientRect().width;
    moveBy((event.clientX - drag.x) * scale, (event.clientY - drag.y) * scale);
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
  }

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    const step = event.shiftKey ? 40 : 10;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveBy(...move);
  }

  async function download() {
    if (!assets || downloading) return;
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error();
      drawDP(ctx, state(), assets);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = FILENAME;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Your DP couldn’t be saved. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const canDownload = ready && Boolean(photo) && Boolean(name.trim());
  const missing = [!photo && "photo", !name.trim() && "name"].filter(Boolean).join(" and ");

  return (
    <div className="dp">
      <div className="dp-inner">
        <header className="dp-header">
          <h1>The TechForge 2.0</h1>
          <p>Make your DP in under a minute.</p>
        </header>

        <div className="dp-layout">
          <div>
            <div
              className="dp-preview"
              data-dropping={dropping || undefined}
              onDragOver={event => {
                event.preventDefault();
                setDropping(true);
              }}
              onDragLeave={() => setDropping(false)}
              onDrop={event => {
                event.preventDefault();
                setDropping(false);
                void acceptFile(event.dataTransfer.files[0]);
              }}
            >
              <canvas
                ref={previewRef}
                width={SIZE}
                height={SIZE}
                role="img"
                aria-label={`Preview of your DP${name.trim() ? ` for ${name.trim()}` : ""}, ${THEMES[theme].label} theme${
                  photo ? ". Drag or use arrow keys to reposition your photo." : ""
                }`}
                tabIndex={photo ? 0 : -1}
                className="dp-canvas"
                data-ready={ready || undefined}
                data-mode={photo ? (dragging ? "dragging" : "drag") : "pick"}
                onClick={() => !photo && inputRef.current?.click()}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown}
              />
              {showCrop && ready && <div aria-hidden="true" className="dp-crop" />}
              {!ready && (
                <div className="dp-overlay" role="status">
                  {loadError || "Loading…"}
                </div>
              )}
              {dropping && <div className="dp-overlay dp-overlay--drop">Drop your photo</div>}
            </div>
            <label className="dp-check">
              <input type="checkbox" checked={showCrop} onChange={event => setShowCrop(event.target.checked)} />
              Show round crop
            </label>
          </div>

          <div className="dp-card">
            <section aria-labelledby="dp-photo">
              <h2 id="dp-photo" className="dp-label">
                Photo
              </h2>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="dp-sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={event => {
                  void acceptFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <div className="dp-row">
                <button type="button" className="dp-button" onClick={() => inputRef.current?.click()}>
                  {photo ? "Change photo" : "Add your photo"}
                </button>
                {photo && (
                  <button type="button" className="dp-text-button" onClick={removePhoto}>
                    Remove
                  </button>
                )}
              </div>
              <p className="dp-hint">
                {photo ? "Drag the photo in the preview to reposition it." : "Or drop a photo onto the preview."}
              </p>
              {error && (
                <p role="alert" className="dp-error">
                  {error}
                </p>
              )}

              {photo && (
                <label className="dp-zoom">
                  <span className="dp-label dp-label--split">
                    Zoom <span className="dp-value">{zoom.toFixed(1)}×</span>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={event => changeZoom(Number(event.target.value))}
                  />
                </label>
              )}
            </section>

            <label className="dp-field">
              <span className="dp-label">Your name</span>
              <input
                type="text"
                value={name}
                maxLength={MAX_NAME}
                placeholder="Your Name"
                autoComplete="name"
                onChange={event => setName(event.target.value)}
              />
              <span className="dp-value dp-count">
                {name.length}/{MAX_NAME}
              </span>
            </label>

            <fieldset className="dp-fieldset">
              <legend className="dp-label">Theme</legend>
              <div className="dp-segment">
                {(Object.keys(THEMES) as ThemeId[]).map(id => (
                  <button key={id} type="button" aria-pressed={theme === id} onClick={() => setTheme(id)}>
                    <span aria-hidden="true" className="dp-swatch" style={{ background: THEMES[id].swatch }} />
                    {THEMES[id].label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="dp-download">
              <button
                type="button"
                className="dp-primary"
                disabled={!canDownload || downloading}
                onClick={() => void download()}
              >
                {downloading ? "Saving…" : "Download DP"}
              </button>
              <p className="dp-hint dp-hint--center">
                {canDownload || !ready ? "" : `Add your ${missing} to download. `}
                Your photo never leaves your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
