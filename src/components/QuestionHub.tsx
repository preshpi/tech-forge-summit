'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronLeft, ChevronRight, Copy, LockKeyhole, MessageCircle, Plus, RefreshCw, Send, Trash2, UserRound, X } from 'lucide-react';
import { questionApi, questionDate, type QuestionEvent, type QuestionSession, type AudienceQuestion } from '@/lib/questions/client';
import { newDeletionToken, readQuestionOwnership, writeQuestionOwnership, type QuestionOwnership } from '@/lib/questions/ownership';
export { questionApi } from '@/lib/questions/client';
export default function QuestionHub({ eventSlug, sessionSlug }: { eventSlug?: string; sessionSlug?: string }) {
 const router = useRouter();
 const [events, setEvents] = useState<QuestionEvent[]>([]);
 const [sessions, setSessions] = useState<QuestionSession[]>([]);
 const [questions, setQuestions] = useState<AudienceQuestion[]>([]);
 const [loading, setLoading] = useState(true);
 const [feedLoading, setFeedLoading] = useState(false);
 const [error, setError] = useState('');
 const [notice, setNotice] = useState<{ message: string; error?: boolean } | null>(null);
 const [busy, setBusy] = useState(false);
 const [page, setPage] = useState(0);
 const [more, setMore] = useState(false);
 const [view, setView] = useState<'everyone' | 'mine'>('everyone');
 const [bodyLength, setBodyLength] = useState(0);
 const [copied, setCopied] = useState(false);
 const [deleting, setDeleting] = useState<string | null>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 const retry = useRef<{ signature: string; id: string; token: string } | null>(null);
 const request = useRef(0);
 const [owned, setOwned] = useState<QuestionOwnership>({});
 const pagePath = `${eventSlug}/${sessionSlug}`;
 const currentEvent = events.find(e => e.slug === eventSlug);
 const current = sessions.find(s => s.slug === sessionSlug && s.event_id === currentEvent?.id);
 const ownQuestions = Object.entries(owned).filter(([, owner]) => owner.path === pagePath || owner.sessionId === current?.id);
 useEffect(() => { const timer = setTimeout(() => setOwned(readQuestionOwnership()), 0); return () => clearTimeout(timer); }, []);
 const load = useCallback(async (requestedPage = page, quiet = false) => {
  const id = ++request.current;
  try {
   const [e, available]: [QuestionEvent[], QuestionSession[]] = await Promise.all([
    questionApi('events'), eventSlug ? questionApi('sessions') : Promise.resolve([]),
   ]);
   const event = e.find(item => item.slug === eventSlug);
   const s = available.filter(item => item.event_id === event?.id);
   const selected = s.find(item => item.slug === sessionSlug);
   if (id !== request.current) return;
   setEvents(e); setSessions(s); setLoading(false); setError(''); if (!quiet) setFeedLoading(Boolean(selected));
   const q: AudienceQuestion[] = selected ? await questionApi(`questions?session_id=${selected.id}&offset=${requestedPage * 20}`) : [];
   if (id !== request.current) return;
   setEvents(e); setSessions(s); setQuestions(q.slice(0,20)); setMore(q.length > 20); setError('');
  } catch (err) { if (id === request.current) setError((err as Error).message); }
  finally { if (id === request.current) { setLoading(false); setFeedLoading(false); } }
 }, [eventSlug, sessionSlug, page]);
 useEffect(() => { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
 useEffect(() => {
  if (!current?.intake_open) return;
  const timer = setInterval(() => { if (document.visibilityState === 'visible') void load(undefined, true); }, 15000);
  return () => clearInterval(timer);
 }, [current?.intake_open, load]);
 useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 3000); return () => clearTimeout(timer); }, [copied]);
 async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); if (!current) return;
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const signature = JSON.stringify(data);
  if (retry.current?.signature !== signature) retry.current = { signature, id: crypto.randomUUID(), token: newDeletionToken() };
  setBusy(true); setNotice(null);
  try {
   const result = await questionApi('submit', { ...data, session_id: current.id, request_id: retry.current!.id, deletion_token: retry.current!.token });
   if (result.deletion_enabled) {
    const ownership = { ...readQuestionOwnership(), ...owned, [result.id]: { token: retry.current!.token, sessionId: current.id, path: pagePath, submittedAt: new Date().toISOString() } };
    setOwned(ownership);
    const stored = writeQuestionOwnership(ownership);
    setNotice({ message: stored ? 'Question submitted! Find it under My questions. You can ask another.' : 'Question submitted! Keep this page open to retain access to deletion.' });
   } else setNotice({ message: 'Your question has been submitted. You can ask another.' });
   form.reset(); setBodyLength(0); retry.current = null; setPage(0); await load(0);
  } catch (err) { setNotice({ message: (err as Error).message, error: true }); await load(); }
  finally { setBusy(false); }
 }
 async function deleteQuestion() {
  const id = deleting; if (!id || !owned[id]) return;
  setBusy(true);
  try {
   await questionApi('delete', { question_id: id, deletion_token: owned[id].token });
   const ownership = { ...readQuestionOwnership(), ...owned };
   delete ownership[id]; writeQuestionOwnership(ownership); setOwned(ownership);
   setQuestions(items => items.filter(question => question.id !== id));
   dialog.current?.close(); setNotice({ message: 'Your question has been deleted.' }); await load();
  } catch (err) { setNotice({ message: (err as Error).message, error: true }); dialog.current?.close(); }
  finally { setBusy(false); }
 }
 function confirmDeletion(id: string) { setDeleting(id); }
 useEffect(() => { if (deleting) dialog.current?.showModal(); }, [deleting]);
 async function copyLink() {
  try { await navigator.clipboard.writeText(window.location.href); setCopied(true); }
  catch { setNotice({ message: 'Copy the address from your browser to share this session.', error: true }); }
 }
 return <main className="qh qh-public">
  <div className="container">
   <nav className="qh-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={14}/><Link href="/questions" aria-current={!eventSlug ? 'page' : undefined}>Audience questions</Link>{eventSlug && <><ChevronRight size={14}/><Link href={`/questions/${eventSlug}`}>{currentEvent?.title ?? 'Sessions'}</Link></>}{sessionSlug && <><ChevronRight size={14}/><span>Session</span></>}</nav>
   <header className={`qh-hero ${sessionSlug ? 'qh-hero--session' : ''}`}>
    <div className="qh-hero__copy"><p className="section-label">{currentEvent ? `${currentEvent.title} · ${currentEvent.edition}` : 'TechForge · Audience questions'}</p>
     <h1>{sessionSlug ? current?.title ?? 'Session questions' : eventSlug ? <>Find your <span>conversation.</span></> : <>Good questions.<br/><span>Great conversations.</span></>}</h1>
     <p className="qh-lede">{sessionSlug ? 'An idea sparked something? Ask the speaker, or explore what others are curious about.' : eventSlug ? 'Pick a session to ask a question and join the conversation.' : 'Your curiosity belongs here. Choose an event, find your session, and ask away.'}</p>
     {current && <div className="qh-session-meta"><SessionBadge session={current}/>{current.starts_at && <span><CalendarDays size={16}/>{questionDate(current.starts_at)} WAT</span>}{current.speaker && <span><UserRound size={16}/>{current.speaker}</span>}</div>}
    </div>
    {!sessionSlug ? <div className="qh-hero-art" aria-hidden="true"><div className="qh-art-bubble qh-art-bubble--blue"><MessageCircle/><span>What if?</span></div><div className="qh-art-bubble qh-art-bubble--yellow">Let’s talk<span>↗</span></div><span className="qh-art-star">✳</span><p className="script">Ask. Connect. Grow.</p></div> : <button className="qh-button qh-button--white" onClick={() => void copyLink()}>{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? 'Link copied' : 'Share session'}</button>}
   </header>
   {notice && <div className={`qh-notice ${notice.error ? 'qh-notice--error' : ''}`} role={notice.error ? 'alert' : 'status'}><span>{notice.error ? 'Please try again' : <Check size={18}/>}</span><p>{notice.message}</p><button onClick={() => setNotice(null)} aria-label="Dismiss notification"><X size={18}/></button></div>}
   {error && <div className="qh-notice qh-notice--error" role="alert"><p>{error}</p><button className="qh-text-button" onClick={() => void load()}>Try again</button></div>}
   {loading ? <div className="qh-skeleton-grid" role="status" aria-label="Loading sessions"><div/><div/><div/></div> : <>
    {!sessionSlug && <>
     {events.length > 0 && <nav className="qh-event-nav" aria-label="Choose an event"><Link href="/questions" aria-current={!eventSlug ? 'page' : undefined}>All events</Link>{events.map(e => <Link href={`/questions/${e.slug}`} key={e.id} aria-current={e.slug === eventSlug ? 'page' : undefined}>{e.title}<span>{e.edition}</span></Link>)}</nav>}
     <div className="qh-section-heading"><div><p className="section-label">{eventSlug ? 'Choose your session' : 'Choose your event'}</p><h2>{eventSlug ? 'A seat in the conversation.' : 'Where are you joining us?'}</h2></div><span className="qh-caption">No account needed</span></div>
     {!error && !eventSlug && <div className="qh-event-grid">{events.map((e,index) => <Link className={`qh-event-card ${index % 2 ? 'qh-event-card--yellow' : ''}`} href={`/questions/${e.slug}`} key={e.id}><div className="qh-event-card__top"><span className="qh-icon-tile"><MessageCircle size={24}/></span><span className="qh-chip">{e.edition} edition</span></div><h3>{e.title}</h3><p>{e.kind === 'main' ? 'Bring your questions into the room. Explore the conversations at the main event.' : 'The conversations start here. Explore the sessions leading up to TechForge.'}</p><span className="qh-card-link">Explore sessions <ArrowUpRight size={20}/></span></Link>)}{!events.length && <EmptyState title="The conversations are coming." text="Events will appear here as soon as they’re announced."/>}</div>}
     {!error && eventSlug && <div className="qh-session-list">{sessions.map((s,index) => <Link className="qh-session-card" href={`/questions/${eventSlug}/${s.slug}`} key={s.id}><span className="qh-session-number">{String(index+1).padStart(2,'0')}</span><div className="qh-session-card__body"><SessionBadge session={s}/><h3>{s.title}</h3><p>{s.speaker ?? 'A TechForge conversation'}<span>·</span>{s.starts_at ? `${questionDate(s.starts_at)} WAT` : 'Date to be announced'}</p></div><span className="qh-session-card__action">{s.intake_open ? 'Join session' : 'Read questions'}<ArrowUpRight size={20}/></span></Link>)}{!sessions.length && <EmptyState title="Sessions will be announced soon." text="Check back for the next conversation."/>}</div>}
     <div className="qh-bottom-note"><MessageCircle size={20}/><p>One session. Your questions. A conversation worth having.</p><Link href="/pre-tech-forge">Explore Pre-TechForge <ArrowUpRight size={15}/></Link></div>
    </>}
    {sessionSlug && <>
     <div className="qh-workspace-nav"><Link className="qh-text-button" href={`/questions/${eventSlug}`}><ArrowLeft size={16}/>All sessions</Link>{sessions.length > 1 && <label className="qh-session-switcher"><span>Switch session</span><select value={current?.slug ?? ''} onChange={e => { router.push(`/questions/${eventSlug}/${e.target.value}`); }}><option value="" disabled>Choose a session</option>{sessions.map(s => <option value={s.slug} key={s.id}>{s.title}</option>)}</select></label>}{(current || ownQuestions.length > 0) && <a className="qh-text-button" href="#question-feed">Read questions <ChevronRight size={16}/></a>}</div>
     {!error && !current && <EmptyState title="This session isn’t available yet." text="It may not have been announced. Explore the available sessions instead." action={<Link className="btn btn--primary" href={`/questions/${eventSlug}`}>View sessions <ArrowUpRight size={16}/></Link>}/>}
     {(current || ownQuestions.length > 0) && <div className="qh-workspace">
      {current && <aside className="qh-compose" id="ask-question" aria-label="Ask a question"><div className="qh-compose__heading"><span className="qh-icon-tile"><MessageCircle size={22}/></span><div><h2>{current.intake_open ? 'Ask the speaker' : 'Intake is closed'}</h2><p>{current.intake_open ? 'A little curiosity goes a long way.' : 'The conversation stays here.'}</p></div></div>
       {current.intake_open ? <form className="qh-form" onSubmit={submit}><label htmlFor="question-body">Your question</label><textarea id="question-body" name="body" minLength={10} maxLength={2000} required rows={5} placeholder="What would you like to know?" aria-describedby="question-length" onChange={e => setBodyLength(e.target.value.length)}/><div id="question-length" className="qh-field-help"><span>At least 10 characters</span><span>{bodyLength.toLocaleString()} / 2,000</span></div><details className="qh-optional"><summary><Plus size={16}/>Add a name or reference<span>Optional</span></summary><div><label>Your name<input name="name" maxLength={80} autoComplete="name" placeholder="Leave blank to stay Anonymous"/></label><label>Speaker’s point<input name="speaker_point" maxLength={300} placeholder="Which idea are you referring to?"/></label></div></details><button disabled={busy} aria-busy={busy} className="btn btn--primary qh-submit">{busy ? 'Please wait…' : 'Send question'}<Send size={17}/></button><p className="qh-form-note"><LockKeyhole size={14}/>No sign-up. Your name is optional.</p><p className="qh-privacy-note">Questions are public. You can delete your own from this browser.</p></form> : <div className="qh-closed"><LockKeyhole size={26}/><p>New questions are no longer being accepted. You can still read the conversation and manage your own questions.</p></div>}
      </aside>}
      <section className="qh-feed" id="question-feed" aria-labelledby="feed-title"><div className="qh-feed__heading"><h2 id="feed-title">The conversation</h2>{current?.intake_open && <span className="qh-live"><i/>Auto-updating</span>}</div><div className="qh-feed-tools"><div className="qh-segment" aria-label="Filter questions"><button aria-pressed={view === 'everyone'} onClick={() => setView('everyone')}>Everyone</button><button aria-pressed={view === 'mine'} onClick={() => setView('mine')}>My questions <span>{ownQuestions.length}</span></button></div><button className="qh-icon-button" aria-label="Refresh questions" onClick={() => void load()}><RefreshCw size={17}/></button></div>
       {feedLoading && !questions.length && view === 'everyone' ? <div className="qh-skeleton-grid" role="status" aria-label="Loading questions"><div/><div/></div> : view === 'everyone' ? <>{questions.length ? questions.map(q => <QuestionCard question={q} own={Boolean(owned[q.id])} busy={busy} onDelete={() => confirmDeletion(q.id)} key={q.id}/>) : <EmptyState title={current?.intake_open ? "Be the first to ask." : "No questions yet."} text={current?.intake_open ? 'Something on your mind? Start the conversation with your question.' : 'There are no public questions here yet.'}/>}<div className="qh-pagination"><button className="qh-button" disabled={page === 0} onClick={() => setPage(p => p-1)}><ChevronLeft size={16}/>Previous</button><span>Page {page+1}</span><button className="qh-button" disabled={!more} onClick={() => setPage(p => p+1)}>Next<ChevronRight size={16}/></button></div></> : <>{ownQuestions.length ? ownQuestions.map(([id,owner]) => { const q = questions.find(item => item.id === id); return q ? <QuestionCard question={q} own busy={busy} onDelete={() => confirmDeletion(id)} key={id}/> : <article className="qh-question-card" key={id}><div className="qh-question-card__head"><span className="qh-chip qh-chip--blue">Your question</span><span className="qh-caption">{questionDate(owner.submittedAt,true)} WAT</span></div><p className="qh-question-body">Your submitted question</p><p className="qh-caption">It may be on another page or hidden from the public feed.</p><button className="qh-delete" disabled={busy} onClick={() => confirmDeletion(id)}><Trash2 size={15}/>Delete question</button></article>; }) : <EmptyState title="Your voice belongs here." text="Questions you submit from this browser will appear here." action={current?.intake_open ? <a className="qh-text-button" href="#ask-question">Ask your first question <ArrowUpRight size={16}/></a> : undefined}/>}<p className="qh-own-note"><LockKeyhole size={15}/>Deletion access stays in this browser. Keep its storage to manage your questions later.</p></>}
      </section>
     </div>}
    </>}
   </>}
  </div>
  <dialog ref={dialog} className="qh-dialog qh-dialog--small" aria-labelledby="delete-title" onClose={() => setDeleting(null)} onCancel={e => { if (busy) e.preventDefault(); }}><div className="qh-dialog__body"><span className="qh-icon-tile qh-icon-tile--pink"><Trash2 size={24}/></span><h2 id="delete-title">Delete your question?</h2><p>Its text and name will be permanently removed. This cannot be undone.</p><div className="qh-dialog__actions"><button className="qh-button" disabled={busy} onClick={() => dialog.current?.close()}>Keep question</button><button className="qh-button qh-button--danger" disabled={busy} onClick={() => void deleteQuestion()}>{busy ? 'Deleting…' : 'Delete question'}</button></div></div></dialog>
 </main>;
}
function SessionBadge({ session }: { session: QuestionSession }) { return <span className={`qh-chip ${session.intake_open ? 'qh-chip--open' : 'qh-chip--muted'}`}>{session.intake_open && <i/>}{session.intake_open ? 'Questions open' : 'Read-only session'}</span>; }
function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) { return <div className="qh-empty"><span className="qh-empty__icon"><MessageCircle size={28}/></span><h3>{title}</h3><p>{text}</p>{action}</div>; }
function QuestionCard({ question: q, own, busy, onDelete }: { question: AudienceQuestion; own: boolean; busy: boolean; onDelete: () => void }) { return <article className={`qh-question-card ${own ? 'qh-question-card--own' : ''}`}><div className="qh-question-card__head"><span className="qh-avatar" aria-hidden="true">{q.name.slice(0,1).toUpperCase()}</span><div><strong>{q.name}</strong><time dateTime={q.created_at}>{questionDate(q.created_at,true)} WAT</time></div>{own && <span className="qh-chip qh-chip--blue">You</span>}</div><p className="qh-question-body">{q.body}</p>{q.speaker_point && <blockquote className="qh-reference"><span>Referring to</span>{q.speaker_point}</blockquote>}{own && <button className="qh-delete" disabled={busy} onClick={onDelete}><Trash2 size={15}/>Delete question</button>}</article>; }
