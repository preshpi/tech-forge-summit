'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Gift, Plus, RefreshCw, X } from 'lucide-react';
import { gameApi, type GamePrize, type GameWin } from '@/lib/game/client';
import { questionDate } from '@/lib/questions/client';

export default function GameAdmin() {
  const [prizes, setPrizes] = useState<GamePrize[]>([]);
  const [wins, setWins] = useState<GameWin[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editor, setEditor] = useState<Partial<GamePrize> | null>(null);
  const loadId = useRef(0);
  async function load(currentPage = page) {
    const id = ++loadId.current;
    setLoading(true);
    try {
      const [p, w] = await Promise.all([gameApi('admin/prizes'), gameApi(`admin/wins?offset=${currentPage * 50}`)]);
      if (id !== loadId.current) return;
      setPrizes(p); setWins(w.slice(0, 50)); setMore(w.length > 50); setError('');
    } catch (e) { if (id === loadId.current) setError((e as Error).message); }
    finally { if (id === loadId.current) setLoading(false); }
  }
  useEffect(() => {
    const initial = setTimeout(() => void load(page), 0);
    const interval = setInterval(() => void load(page), 15000);
    return () => { clearTimeout(initial); clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || !editor) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError(''); setNotice('');
    try {
      let image = form.has('remove_image') ? null : editor.image ?? null;
      const file = form.get('image');
      if (file instanceof File && file.size) {
        if (file.size > 350 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Choose a PNG, JPG or WebP image under 350 KB.');
        image = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Unable to read this image.')); reader.readAsDataURL(file); });
      }
      await gameApi(`admin/prizes${editor.id ? `/${editor.id}` : ''}`, { name: String(form.get('name')).trim(), description: String(form.get('description')).trim(), ...(editor.id && Number(form.get('quantity')) === editor.quantity ? {} : { quantity: Number(form.get('quantity')) }), active: form.has('active'), image });
      setEditor(null); setNotice('Prize saved.'); await load();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function toggle(prize: GamePrize) {
    setBusy(true); setError(''); setNotice('');
    try { await gameApi(`admin/prizes/${prize.id}`, { active: !prize.active }); await load(); setNotice(prize.active ? 'Prize paused.' : 'Prize activated.'); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="game-admin qh-panel" aria-labelledby="game-admin-title">
    <div className="game-admin-heading"><div><p className="section-label"><Gift size={16} /> Spin & win</p><h2 id="game-admin-title">A little delight, all managed here.</h2><p className="qh-caption">Upload prizes, manage remaining stock and see who won. Winners refresh every 15 seconds.</p></div><div className="qh-inline-actions"><Link className="qh-button" href="/game">Open game ↗</Link><button className="btn btn--primary qh-button--compact" disabled={busy} onClick={() => {setEditor({ quantity: 1, active: false });setError('');setNotice('');}}><Plus size={16} />Add prize</button></div></div>
    {notice && <p className="qh-notice" role="status">{notice}</p>}
    {error && <p className="qh-notice qh-notice--error" role="alert">{error}</p>}
    {editor && <form key={editor.id ?? 'new'} className="qh-form game-prize-editor" onSubmit={save}><div className="game-admin-heading"><h3>{editor.id ? 'Edit prize' : 'New prize'}</h3><button type="button" className="qh-icon-button" disabled={busy} aria-label="Close prize editor" onClick={() => setEditor(null)}><X size={18} /></button></div><div className="qh-form-row"><label>Prize name<input name="name" required maxLength={100} defaultValue={editor.name} placeholder="e.g. TechForge T-shirt" disabled={busy} /></label><label>Remaining quantity<input name="quantity" type="number" min={0} max={100000} step={1} required defaultValue={editor.quantity} disabled={busy} /></label></div><label>Description<textarea name="description" maxLength={500} defaultValue={editor.description} placeholder="What makes this prize special?" disabled={busy} /></label><label>Prize image<input type="file" name="image" accept="image/png,image/jpeg,image/webp" disabled={busy} /><span className="qh-caption">PNG, JPG or WebP, up to 350 KB.</span></label>{editor.image && <label className="qh-check"><input type="checkbox" name="remove_image" disabled={busy} />Remove existing image</label>}<label className="qh-check"><input type="checkbox" name="active" defaultChecked={editor.active} disabled={busy} />Available on the wheel</label><button className="btn btn--primary" disabled={busy}>{busy ? 'Saving…' : 'Save prize'}</button></form>}
    <div className="game-admin-prizes">{prizes.map(prize => <article key={prize.id}><div><h3>{prize.name}</h3><p className="qh-caption">{prize.quantity} remaining · {prize.active ? prize.quantity ? 'On the wheel' : 'Out of stock' : 'Paused'}</p></div><div className="qh-inline-actions"><button className="qh-button" disabled={busy} onClick={() => {setEditor(prize);setError('');}}>Edit</button><button className="qh-button" disabled={busy} onClick={() => void toggle(prize)}>{prize.active ? 'Pause' : 'Activate'}</button></div></article>)}</div>
    {!loading && !prizes.length && !error && <p className="game-admin-empty">Add your first prize to get the wheel ready. Activate prizes when you’re ready for attendees to play.</p>}
    <div className="game-admin-heading game-winners-heading"><div><h3>Winner records</h3><p className="qh-caption">One win per email. Each available prize has an equal chance of being won.</p></div><button className="qh-button" disabled={loading || busy} onClick={() => void load()}><RefreshCw size={15} />{loading ? 'Refreshing…' : 'Refresh'}</button></div>
    <div className="game-winners-scroll"><table className="game-winners"><caption className="game-sr-only">Audience winners and contact details</caption><thead><tr><th>Name</th><th>Email</th><th>Prize</th><th>Won at · WAT</th><th>Reference</th></tr></thead><tbody>{wins.map(win => <tr key={win.id}><td>{win.name}</td><td>{win.email}</td><td>{win.prize_name}</td><td>{questionDate(win.created_at, true)}</td><td><code>{win.id}</code></td></tr>)}</tbody></table></div>
    {!loading && !wins.length && !error && <p className="game-admin-empty">When someone spins and wins, their name, email and prize will appear here.</p>}
    <div className="qh-pagination"><button className="qh-button" disabled={!page || loading} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page + 1}</span><button className="qh-button" disabled={!more || loading} onClick={() => setPage(p => p + 1)}>Next</button></div>
  </section>;
}
