"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowDownToLine, Check, Loader2, RotateCcw } from "lucide-react";
import Logo from "./Logo";
import {
  DEFAULT_FRAME,
  INK_SOFT,
  NAME_MAX_LENGTH,
  PLATE,
  PLATE_EXPORT_SIZE,
  PROOF_SIZES,
  SPARKLE_POINTS,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  clampFrame,
  editionOrder,
  editions,
  notchOf,
  offsetBounds,
  plateFileName,
  tidyName,
  type EditionId,
  type Frame,
} from "@/lib/plate";
import { blitPlate, drawPlate, resolveFontFamily } from "@/lib/plateRender";

const MAX_FILE_BYTES = 12 * 1024 * 1024;

/** Capped: past 2× the extra pixels cost more than they show. */
const pixelRatio = () => Math.min(2, window.devicePixelRatio || 1);

/**
 * The site's section mark, drawn from the same points the plate uses, but
 * inheriting `currentColor` so it can sit in a coloured eyebrow.
 */
function SparkMark() {
  return (
    <svg
      viewBox="0 0 80 80"
      width="1em"
      height="1em"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points={SPARKLE_POINTS.map(([x, y]) => `${x},${y}`).join(" ")} />
    </svg>
  );
}

type Source = { image: HTMLImageElement; width: number; height: number };

export default function PlateStudio() {
  const [source, setSource] = useState<Source | null>(null);
  const [fileName, setFileName] = useState("");
  const [frame, setFrame] = useState<Frame>(DEFAULT_FRAME);
  const [name, setName] = useState("");
  const [editionId, setEditionId] = useState<EditionId>("signal");

  const [fontsReady, setFontsReady] = useState(false);
  const [stageSize, setStageSize] = useState(0);

  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const masterRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const proofRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const savedTimer = useRef<number | null>(null);
  const dragRef = useRef<{ id: number; x: number; y: number; frame: Frame } | null>(
    null,
  );

  const canPan = (() => {
    if (!source) return false;
    const bounds = offsetBounds(source.width, source.height, frame.zoom);
    return bounds.x > 0.001 || bounds.y > 0.001;
  })();

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setStageSize(Math.round(entry.contentRect.width));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  /** Paint the master plate, then copy it into the live preview. */
  const paint = useCallback(() => {
    // Text metrics aren't final until the face has loaded, and every position
    // on the plate is measured from them — so wait rather than draw twice.
    if (!fontsReady) return;

    let master = masterRef.current;
    if (!master) {
      master = document.createElement("canvas");
      master.width = PLATE_EXPORT_SIZE;
      master.height = PLATE_EXPORT_SIZE;
      masterRef.current = master;
    }
    const ctx = master.getContext("2d");
    if (!ctx) return;

    drawPlate(ctx, PLATE_EXPORT_SIZE, {
      edition: editions[editionId],
      image: source?.image ?? null,
      imageW: source?.width ?? 0,
      imageH: source?.height ?? 0,
      frame,
      name,
      fontFamily: resolveFontFamily(),
    });

    const preview = previewRef.current;
    if (preview && stageSize > 0) blitPlate(master, preview, stageSize, pixelRatio());
  }, [editionId, source, frame, name, stageSize, fontsReady]);

  useEffect(() => {
    paint();
  }, [paint]);

  // The proofs are a check, not a toy — settle them after the drag rather than
  // downsampling four times a frame.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const master = masterRef.current;
      if (!master) return;
      PROOF_SIZES.forEach((size, index) => {
        const canvas = proofRefs.current[index];
        if (canvas) blitPlate(master, canvas, size, pixelRatio());
      });
    }, 110);
    return () => window.clearTimeout(id);
  }, [paint]);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const acceptFile = useCallback(async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn’t an image. Try a JPG, PNG or WebP.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That image is over 12MB. Try a smaller one.");
      return;
    }

    setError(null);
    setReading(true);
    const url = URL.createObjectURL(file);
    const image = new Image();

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("decode failed"));
        image.src = url;
      });
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      setSource({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setFrame(DEFAULT_FRAME);
      setFileName(file.name);
    } catch {
      URL.revokeObjectURL(url);
      setError("That image couldn’t be opened. Try another file.");
    } finally {
      setReading(false);
    }
  }, []);

  function clearPhoto() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSource(null);
    setFileName("");
    setFrame(DEFAULT_FRAME);
    setError(null);
  }

  function setZoom(zoom: number) {
    setFrame((current) =>
      source
        ? clampFrame({ ...current, zoom }, source.width, source.height)
        : { ...current, zoom },
    );
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!source || !canPan || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      frame,
    };
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId || !source) return;
    const notch = notchOf(stageSize);
    if (!notch.w || !notch.h) return;
    setFrame(
      clampFrame(
        {
          zoom: drag.frame.zoom,
          offsetX: drag.frame.offsetX + (event.clientX - drag.x) / notch.w,
          offsetY: drag.frame.offsetY + (event.clientY - drag.y) / notch.h,
        },
        source.width,
        source.height,
      ),
    );
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!source) return;
    const step = event.shiftKey ? 0.06 : 0.015;
    const nudge: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = nudge[event.key];
    if (!delta) return;
    event.preventDefault();
    setFrame((current) =>
      clampFrame(
        {
          zoom: current.zoom,
          offsetX: current.offsetX + delta[0],
          offsetY: current.offsetY + delta[1],
        },
        source.width,
        source.height,
      ),
    );
  }

  async function download() {
    const master = masterRef.current;
    if (!master || !source) return;

    setSaved(false);
    setSaving(true);
    // Let the button reach its rendering state before the encode blocks.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        master.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("encode failed");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = plateFileName(name);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      setSaved(true);
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setSaved(false), 2600);
    } catch {
      setError("The plate couldn’t be exported. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const trimmedName = tidyName(name);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="flex items-center"
            aria-label="The TechForge — home"
          >
            <Logo imgClassName="h-8 w-auto" />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper/40">
            Attendee plate
          </span>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 md:pt-24">
        <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal">
          <SparkMark />
          Get your DP
        </p>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
          <h1 className="max-w-3xl font-display text-[32px] font-bold leading-[1.08] tracking-tight sm:text-[44px] md:text-[56px]">
            Tell the room you&apos;re coming.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-paper/60 sm:text-base">
            Your photo, your name, and the same blue, hairline and type this
            whole site is set in. Everything renders here on your device.
          </p>
        </div>
      </section>

      <div className="border-y border-line">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-4 py-5 font-mono text-[10px] uppercase tracking-wider sm:px-6 md:grid-cols-4">
          {[
            ["Date", "Dec 5, 2026"],
            ["Location", "Lagos, Nigeria"],
            ["Export", "1024 × 1024 PNG"],
            ["Editions", "Three"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-paper/40">{label}</dt>
              <dd className="mt-1.5 text-paper/75">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20 lg:py-20">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <div
            ref={stageRef}
            role="img"
            aria-label={
              source
                ? `Attendee plate preview${
                    trimmedName ? ` for ${trimmedName}` : ""
                  }`
                : "Attendee plate preview — no photo chosen yet"
            }
            tabIndex={source ? 0 : -1}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={source ? undefined : openPicker}
            onDragOver={(event) => {
              event.preventDefault();
              setDropping(true);
            }}
            onDragLeave={() => setDropping(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDropping(false);
              void acceptFile(event.dataTransfer.files?.[0]);
            }}
            className={`relative aspect-square w-full max-w-[560px] touch-none select-none transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${
              dropping ? "outline outline-2 outline-offset-4 outline-signal" : ""
            } ${source ? "" : "cursor-pointer border border-line"} ${
              dragging ? "cursor-grabbing" : canPan ? "cursor-grab" : ""
            }`}
          >
            <canvas ref={previewRef} className="block h-full w-full" />

            {!source && !reading ? (
              <div
                className="pointer-events-none absolute flex flex-col items-center justify-center px-6 text-center"
                style={{
                  left: `${PLATE.gutter * 100}%`,
                  top: 0,
                  right: 0,
                  bottom: `${PLATE.band * 100}%`,
                }}
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-paper/50">
                  {dropping ? "Release to place" : "Drop a photo here"}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-paper/25">
                  or click to choose one
                </p>
              </div>
            ) : null}

            {reading ? (
              <div
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                  left: `${PLATE.gutter * 100}%`,
                  top: 0,
                  right: 0,
                  bottom: `${PLATE.band * 100}%`,
                }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-paper/50" />
              </div>
            ) : null}
          </div>

          <div className="mt-10 max-w-[560px] border-t border-line pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">
                Reads at avatar size
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper/25">
                Actual pixels
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-end gap-5 sm:gap-7">
              {PROOF_SIZES.map((size, index) => (
                <div key={size} className="flex flex-col items-center gap-2.5">
                  <canvas
                    aria-hidden="true"
                    ref={(element) => {
                      proofRefs.current[index] = element;
                    }}
                    style={{ width: size, height: size }}
                    className="block"
                  />
                  <span className="font-mono text-[10px] tracking-widest text-paper/30">
                    {size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              void acceptFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />

          <Row index="01" title="Portrait">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                onClick={openPicker}
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold transition-colors hover:border-signal/50"
              >
                {source ? "Replace photo" : "Choose a photo"}
              </button>
              {source ? (
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="font-mono text-[10px] uppercase tracking-widest text-paper/40 transition-colors hover:text-paper"
                >
                  Remove
                </button>
              ) : null}
            </div>
            <p className="mt-3.5 truncate font-mono text-[10px] uppercase tracking-widest text-paper/30">
              {source ? fileName : "JPG, PNG or WebP · up to 12MB"}
            </p>
            {error ? (
              <p className="mt-3 text-xs text-[var(--color-accent-3)]">{error}</p>
            ) : null}
          </Row>

          <Row index="02" title="Framing" hint={source ? undefined : "Add a photo first"}>
            <div className="flex items-center gap-5">
              <input
                type="range"
                aria-label="Zoom"
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                step={ZOOM_STEP}
                value={frame.zoom}
                disabled={!source}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="dp-range flex-1"
              />
              <span className="w-11 shrink-0 text-right font-mono text-[10px] tracking-widest text-paper/40">
                {Math.round(frame.zoom * 100)}%
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper/30">
                {canPan ? "Drag the portrait to reposition" : "Zoom in to reposition"}
              </p>
              <button
                type="button"
                onClick={() => setFrame(DEFAULT_FRAME)}
                disabled={!source}
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-paper/40 transition-colors hover:text-paper disabled:opacity-30 disabled:hover:text-paper/40"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Recenter
              </button>
            </div>
          </Row>

          <Row index="03" title="Name" hint="Optional">
            <div className="relative">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={NAME_MAX_LENGTH}
                placeholder="Your name"
                className="w-full rounded-xl border border-line bg-ink-soft px-3.5 py-3 pr-16 text-sm placeholder:text-paper/25 focus:border-signal/50 focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-paper/25">
                {name.length}/{NAME_MAX_LENGTH}
              </span>
            </div>
            <p className="mt-3.5 font-mono text-[10px] uppercase tracking-widest text-paper/30">
              Leave it empty for the summit line
            </p>
          </Row>

          <Row index="04" title="Edition">
            <div className="flex flex-wrap gap-3">
              {editionOrder.map((id) => {
                const edition = editions[id];
                const active = id === editionId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setEditionId(id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-xs font-semibold transition-colors ${
                      active
                        ? "border-signal bg-ink-soft"
                        : "border-line hover:border-paper/20"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="relative block h-6 w-6 border"
                      style={{
                        backgroundColor: edition.brand,
                        borderColor: edition.onBrand,
                      }}
                    >
                      <span
                        className="absolute"
                        style={{
                          left: `${PLATE.gutter * 100}%`,
                          top: 0,
                          right: 0,
                          bottom: `${PLATE.band * 100}%`,
                          backgroundColor: INK_SOFT,
                        }}
                      />
                    </span>
                    {edition.label}
                  </button>
                );
              })}
            </div>
          </Row>

          <div className="border-t border-line pt-7">
            <button
              type="button"
              onClick={download}
              disabled={!source || saving}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3 text-xs font-bold text-ink transition-colors hover:bg-signal-dim disabled:cursor-not-allowed disabled:opacity-30 md:py-3.5 md:text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Rendering
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                  Saved to your downloads
                </>
              ) : (
                <>
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Download your plate
                </>
              )}
            </button>
            <p
              aria-live="polite"
              className="mt-3.5 text-center font-mono text-[10px] uppercase tracking-widest text-paper/30"
            >
              {source ? "PNG · 1024 × 1024" : "Add a photo to enable the download"}
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 font-mono text-[10px] uppercase tracking-widest text-paper/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Your photo never leaves this device.</p>
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="transition-colors hover:text-paper"
          >
            Back to the summit
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * A control step. Hairline-divided rows with a mono index in the margin, the
 * same register the stats rows and speaker list use.
 */
function Row({
  index,
  title,
  hint,
  children,
}: {
  index: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-line py-7 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-widest text-signal">
          {index}
        </span>
        <h2 className="font-display text-sm font-bold">{title}</h2>
        {hint ? (
          <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-paper/30">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="mt-4 sm:pl-8">{children}</div>
    </div>
  );
}
