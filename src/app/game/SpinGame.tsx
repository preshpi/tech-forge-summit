'use client';
import { useEffect, useRef, useState } from 'react';
import { Gift, Sparkles, X } from 'lucide-react';
import { gameApi, type GamePrize, type SpinResult } from '@/lib/game/client';

const colors = ['#173ddb', '#ffce45', '#d9e6ff', '#ea7053', '#4c63e9', '#a3d9c1'];
export default function SpinGame() {
  const [prizes, setPrizes] = useState<GamePrize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheel, setWheel] = useState<{ id: string; name: string }[]>([]);
  const [result, setResult] = useState<SpinResult | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const pending = useRef<SpinResult | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef<{ id: string; signature: string } | null>(null);
  async function load() {
    setLoading(true); setError('');
    try { const data = await gameApi('prizes'); setPrizes(data); setWheel(data); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    const initial = setTimeout(() => {
      setHasRequest(Boolean(request.current));
      try { const saved = JSON.parse(sessionStorage.getItem('tf-spin-result') ?? 'null'); if (saved?.id && saved?.prize_name) setResult(saved); } catch {}
      void load();
    }, 0);
    try { request.current = JSON.parse(sessionStorage.getItem('tf-spin-request') ?? 'null'); } catch {}
    return () => { clearTimeout(initial); if (timer.current) clearTimeout(timer.current); };
  }, []);
  function reveal() {
    if (!pending.current) return;
    setResult(pending.current); pending.current = null; setSpinning(false); setBusy(false);
    if (timer.current) clearTimeout(timer.current);
  }
  async function spin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const email = String(form.get('email')).trim().toLowerCase();
    const signature = JSON.stringify([name, email]);
    if (!request.current || request.current.signature !== signature) request.current = { id: crypto.randomUUID(), signature };
    setHasRequest(true);
    try { sessionStorage.setItem('tf-spin-request', JSON.stringify(request.current)); } catch {}
    setBusy(true); setError('');
    try {
      const win: SpinResult = await gameApi('spin', { name, email, request_id: request.current.id });
      try { sessionStorage.setItem('tf-spin-result', JSON.stringify(win)); } catch {}
      const index = win.wheel.findIndex(prize => prize.id === win.prize_id);
      setWheel(win.wheel); pending.current = win; modal.current?.close();
      // Wait for the server's wheel snapshot to render before rotating to its winning segment.
      timer.current = setTimeout(() => {
        setSpinning(true);
        setRotation(2160 + 360 - (index + 0.5) * (360 / win.wheel.length));
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        timer.current = setTimeout(reveal, reduced ? 100 : 5300);
      }, 50);
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }
  return <main className="spin-page"><div className="container">
    <div className="spin-layout">
      <section className="spin-copy" aria-labelledby="spin-title">
        <span className="spin-eyebrow"><Sparkles size={17} /> A little luck. A big moment.</span>
        <h1 id="spin-title">Your next<br />great <span>win.</span></h1>
        <p>Good people. Great ideas. A little something to take home. Spin the TechForge wheel and see what’s waiting for you.</p>
        <ol className="spin-steps"><li><span>01</span>Hit the spin button</li><li><span>02</span>Tell us your name and email</li><li><span>03</span>Spin, celebrate, collect your prize</li></ol>
        <p className="spin-small">One win per email address. Every spin wins while prizes last. Your name, email and prize are saved for the event team to arrange collection.</p>
      </section>
      <section className="spin-stage" aria-label="Prize wheel">
        <span className="spin-stage__tag"><Gift size={16} /> TECHFORGE SPIN & WIN</span>
        <div className="spin-wheel-wrap"><div className="spin-pointer" aria-hidden="true" />
          <div className="spin-wheel" style={{ transform: `rotate(${rotation}deg)` }} onTransitionEnd={reveal}>
            <PrizeWheel prizes={wheel.length ? wheel : [{ id: 'empty', name: 'TechForge' }]} />
          </div><div className="spin-hub" aria-hidden="true"><Sparkles size={30} /></div>
        </div>
        <div className="spin-stage__action">
          {result ? <div className="spin-result" role="status"><span>You won!</span><h2>{result.prize_name}</h2>{result.prize_image && <PrizeImage src={result.prize_image} name={result.prize_name} />}<p>Your win is saved. Show the event team your email and this reference to collect your prize.</p><code>{result.id}</code></div> : <><button className="btn btn--primary spin-button" disabled={loading || busy || (!prizes.length && !hasRequest)} onClick={() => { setError(''); setModalOpen(true); modal.current?.showModal(); }}><Sparkles size={19} />{loading ? 'Loading prizes…' : busy ? spinning ? 'Spinning…' : 'Preparing your spin…' : !prizes.length && hasRequest ? 'Recover your spin' : 'Spin the wheel'}</button><p className="spin-small">{!loading && !prizes.length ? 'Prizes are coming soon. Check back for your chance to win.' : 'Your next good surprise starts here.'}</p></>}
          {error && !modalOpen && <div role="alert"><p>{error}</p>{!result && <button className="qh-button" disabled={loading || busy} onClick={() => void load()}>Reload prizes</button>}</div>}
        </div>
      </section>
    </div>
    {prizes.length > 0 && <section className="spin-prizes" aria-labelledby="prize-heading"><p className="section-label">Up for grabs</p><h2 id="prize-heading">Something worth a spin.</h2><div className="spin-prize-grid">{prizes.map(prize => <article key={prize.id}>{prize.image ? <PrizeImage src={prize.image} name={prize.name} /> : <span className="spin-prize-icon"><Gift size={30} /></span>}<h3>{prize.name}</h3>{prize.description && <p>{prize.description}</p>}</article>)}</div></section>}
    <dialog ref={modal} className="qh-dialog spin-dialog" aria-labelledby="spin-form-title" onClose={() => setModalOpen(false)} onCancel={e => { if (busy) e.preventDefault(); }}>
      <form className="qh-form" onSubmit={spin}><div className="qh-dialog__header"><div><p className="section-label">Your turn</p><h2 id="spin-form-title">Meet your next win.</h2></div><button className="qh-icon-button" type="button" disabled={busy} aria-label="Close" onClick={() => modal.current?.close()}><X size={20} /></button></div>
        <div className="qh-dialog__body"><p>Leave your details so the event team knows who to give your prize to.</p><label>Your name<input name="name" autoComplete="name" maxLength={100} required disabled={busy} placeholder="Your full name" /></label><label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required disabled={busy} placeholder="you@example.com" /></label><p className="spin-small">We’ll record your name, email and prize for collection. One win per email address.</p>{error && <p className="qh-notice qh-notice--error" role="alert">{error}</p>}</div>
        <div className="qh-dialog__footer"><button className="btn btn--primary" disabled={busy}>{busy ? 'Preparing your spin…' : 'Continue spin'}<Sparkles size={18} /></button></div>
      </form>
    </dialog>
  </div></main>;
}
function PrizeImage({ src, name }: { src: string; name: string }) {
  // Uploaded data images cannot use Next's remote image optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="spin-prize-image" src={src} alt={name} />;
}
function PrizeWheel({ prizes }: { prizes: { id: string; name: string }[] }) {
  const angle = 360 / prizes.length;
  const point = (degrees: number, radius: number) => [200 + radius * Math.sin(degrees * Math.PI / 180), 200 - radius * Math.cos(degrees * Math.PI / 180)];
  return <svg viewBox="0 0 400 400" role="img" aria-label={`Prize wheel: ${prizes.map(p => p.name).join(', ')}`}>
    {prizes.map((prize, index) => {
      const start = point(index * angle, 198), end = point((index + 1) * angle, 198), center = (index + 0.5) * angle;
      const text = point(center, 132);
      return <g key={prize.id}>{prizes.length === 1 ? <circle cx="200" cy="200" r="198" fill={colors[0]} /> : <path d={`M200 200 L${start.join(' ')} A198 198 0 ${angle > 180 ? 1 : 0} 1 ${end.join(' ')} Z`} fill={colors[index % colors.length]} stroke="#fff" strokeWidth="2" />}<text x={text[0]} y={text[1]} transform={`rotate(${center + 90} ${text[0]} ${text[1]})`} textAnchor="middle" dominantBaseline="middle" fill={index % colors.length === 0 || index % colors.length === 4 ? '#fff' : '#172047'} fontSize={prizes.length > 10 ? 9 : 12} fontWeight="800">{prize.name.length > 20 ? `${prize.name.slice(0, 18)}…` : prize.name}</text></g>;
    })}
  </svg>;
}
