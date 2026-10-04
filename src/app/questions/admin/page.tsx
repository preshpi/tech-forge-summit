'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronRight, ClipboardList, Eye, EyeOff, LockKeyhole, LogOut, MessageCircle, Pencil, Plus, Settings2, X } from 'lucide-react';
import { questionApi, questionDate, type QuestionEvent, type QuestionSession, type AudienceQuestion } from '@/lib/questions/client';
type Editor = { type: 'events'; record: Partial<QuestionEvent> } | { type: 'sessions'; record: Partial<QuestionSession> };
export default function Admin() {
 const [signedIn,setSignedIn] = useState(false);
 const [checking,setChecking] = useState(true);
 const [events,setEvents] = useState<QuestionEvent[]>([]);
 const [sessions,setSessions] = useState<QuestionSession[]>([]);
 const [questions,setQuestions] = useState<AudienceQuestion[]>([]);
 const [eventId,setEventId] = useState('');
 const [sessionId,setSessionId] = useState('');
 const [tab,setTab] = useState<'sessions' | 'moderation'>('sessions');
 const [page,setPage] = useState(0);
 const [more,setMore] = useState(false);
 const [questionLoading,setQuestionLoading] = useState(false);
 const [notice,setNotice] = useState<{ message: string; error?: boolean } | null>(null);
 const [busy,setBusy] = useState(false);
 const [editor,setEditor] = useState<Editor | null>(null);
 const modal = useRef<HTMLDialogElement>(null);
 const activeEvent = events.find(e => e.id === eventId) ?? events.find(e => e.published) ?? events[0];
 const filteredSessions = sessions.filter(s => s.event_id === activeEvent?.id);
 const activeSession = filteredSessions.find(s => s.id === sessionId) ?? filteredSessions[0];
 async function load() {
  const [e,s] = await Promise.all([questionApi('admin/events'),questionApi('admin/sessions')]);
  setEvents(e); setSessions(s); setSignedIn(true);
 }
 useEffect(() => { const timer = setTimeout(() => { load().catch(() => {}).finally(() => setChecking(false)); }, 0); return () => clearTimeout(timer); }, []);
 useEffect(() => {
  if (!activeSession || !signedIn || tab !== 'moderation') return;
  let cancelled = false;
  const timer = setTimeout(() => {
   setQuestionLoading(true);
   questionApi(`admin/questions?session_id=${activeSession.id}&offset=${page*20}`).then(q => { if (!cancelled) { setQuestions(q.slice(0,20));setMore(q.length>20); } }).catch(e => { if (!cancelled) setNotice({message:e.message,error:true}); }).finally(() => { if (!cancelled) setQuestionLoading(false); });
  },0);
  return () => { cancelled = true; clearTimeout(timer); };
 }, [activeSession, page, signedIn, tab]);
 useEffect(() => { if (editor && !modal.current?.open) modal.current?.showModal(); }, [editor]);
 async function run(action: () => Promise<void>, message: string) {
  setBusy(true); setNotice(null);
  try { await action(); setNotice({message}); } catch(e) { setNotice({message:(e as Error).message,error:true}); } finally { setBusy(false); }
 }
 function chooseEvent(id: string) { setEventId(id);setSessionId('');setPage(0);setQuestions([]); }
 async function save(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); if (!editor) return;
  const fd = new FormData(e.currentTarget); const data: Record<string,unknown> = Object.fromEntries(fd);
  data.published = fd.has('published');
  if (editor.type === 'sessions') data.intake_open = fd.has('intake_open');
  for (const field of ['edition','position']) if (field in data) data[field] = Number(data[field]);
  for (const field of ['speaker','starts_at','event_date']) if (data[field] === '') data[field] = null;
  if (data.starts_at) data.starts_at = new Date(`${data.starts_at}+01:00`).toISOString();
  if (editor.type === 'sessions' && data.published && !data.starts_at) { setNotice({message:'Add a confirmed session date before publishing.',error:true}); return; }
  if (editor.type === 'sessions' && data.intake_open && !data.published) { setNotice({message:'Publish this session before opening questions.',error:true}); return; }
  const parent = events.find(event => event.id === data.event_id);
  const message = editor.type === 'sessions' && data.published && parent && !parent.published ? `Session saved. Publish ${parent.title} to make it visible to attendees.` : `${editor.type === 'sessions' ? 'Session' : 'Event'} saved.`;
  await run(async () => { await questionApi(`admin/${editor.type}${editor.record.id ? `/${editor.record.id}` : ''}`,data); await load(); modal.current?.close(); },message);
 }
 async function toggleIntake(session: QuestionSession) {
  if (!session.published || !activeEvent?.published) { setNotice({message:'Publish both the event and this session before opening questions.',error:true}); return; }
  await run(async () => { await questionApi(`admin/sessions/${session.id}`,{intake_open:!session.intake_open});await load(); },session.intake_open ? 'Question intake closed. Existing questions remain available.' : 'Question intake opened. Attendees can now submit.');
 }
 return <main className="qh qh-admin"><div className="container">
  <nav className="qh-breadcrumb" aria-label="Breadcrumb"><Link href="/questions"><ArrowLeft size={15}/>Audience questions</Link><ChevronRight size={14}/><span>Admin workspace</span></nav>
  <header className="qh-admin-header"><div><p className="section-label">TechForge · Behind the conversation</p><h1>Question workspace<span>.</span></h1><p className="qh-lede">The right sessions. The right settings. Everything in one place.</p></div>{signedIn && <button className="qh-button" disabled={busy} onClick={() => void run(async () => { await questionApi('logout',{});setSignedIn(false);setQuestions([]); },'You’ve signed out.')}><LogOut size={16}/>Sign out</button>}</header>
  {notice && <div className={`qh-notice ${notice.error ? 'qh-notice--error' : ''}`} role={notice.error ? 'alert' : 'status'}><span>{notice.error ? 'Check this' : <Check size={18}/>}</span><p>{notice.message}</p><button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={18}/></button></div>}
  {checking ? <div className="qh-skeleton-grid" role="status" aria-label="Checking admin access"><div/><div/></div> : !signedIn ? <div className="qh-login-layout"><div className="qh-login-copy"><span className="qh-icon-tile"><LockKeyhole size={28}/></span><h2>A little care.<br/>A better conversation.</h2><p>Manage the sessions, welcome audience questions, and keep the conversation on track.</p><span className="qh-chip qh-chip--blue">Authorised admins only</span></div><form className="qh-panel qh-form qh-login-form" onSubmit={e => { e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));void run(async () => {await questionApi('login',data);await load();},'Welcome back. Your workspace is ready.'); }}><h2>Welcome back</h2><p className="qh-caption">Sign in to your TechForge admin account.</p><label>Email address<input name="email" type="email" autoComplete="username" placeholder="you@example.com" required/></label><label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Your password" required/></label><button disabled={busy} className="btn btn--primary qh-submit">{busy ? 'Signing in…' : 'Sign in'}<ArrowUpRight size={17}/></button><p className="qh-form-note"><LockKeyhole size={14}/>Your session is private and protected.</p></form></div> : <>
   <div className="qh-admin-stats"><div><span className="qh-icon-tile"><CalendarDays size={20}/></span><p><strong>{events.length}</strong><span>Events</span></p></div><div><span className="qh-icon-tile qh-icon-tile--yellow"><ClipboardList size={20}/></span><p><strong>{sessions.length}</strong><span>Sessions</span></p></div><div><span className="qh-icon-tile"><MessageCircle size={20}/></span><p><strong>{sessions.filter(s => s.intake_open && s.published && events.some(e=>e.id===s.event_id && e.published)).length}</strong><span>Accepting questions</span></p></div></div>
   <div className="qh-admin-layout"><aside className="qh-event-sidebar" aria-label="Manage events"><div className="qh-sidebar-heading"><h2>Your events</h2><button className="qh-icon-button" aria-label="Create event" onClick={() => setEditor({type:'events',record:{edition:2026,kind:'pre'}})}><Plus size={18}/></button></div>{events.map(event => <button className="qh-sidebar-event" key={event.id} aria-pressed={activeEvent?.id===event.id} onClick={() => chooseEvent(event.id)}><span className="qh-sidebar-event__title">{event.title}<ChevronRight size={16}/></span><span className="qh-caption">{event.edition} · {event.published ? 'Published' : 'Draft'} · {sessions.filter(s=>s.event_id===event.id).length} sessions</span></button>)}<p className="qh-sidebar-note">Drafts stay private until you publish them.</p></aside>
    <section className="qh-admin-main" aria-label="Event workspace">
     {activeEvent ? <><div className="qh-admin-event-head"><div><span className={`qh-chip ${activeEvent.published ? 'qh-chip--open' : 'qh-chip--muted'}`}>{activeEvent.published ? 'Published event' : 'Draft event'}</span><h2>{activeEvent.title}</h2><p className="qh-caption">{activeEvent.edition}{activeEvent.event_date ? ` · ${activeEvent.event_date}` : ''}</p></div><div className="qh-inline-actions"><Link className="qh-icon-button" aria-label="View event page" href={`/questions/${activeEvent.slug}`}><ArrowUpRight size={18}/></Link><button className="qh-button" onClick={() => setEditor({type:'events',record:activeEvent})}><Settings2 size={16}/>Event settings</button></div></div>
      {!activeEvent.published && <div className="qh-admin-draft-note"><EyeOff size={20}/><div><strong>This event is private.</strong><p>Publish the event to make its published sessions accessible to attendees.</p></div><button className="qh-button" disabled={busy} onClick={() => void run(async () => {await questionApi(`admin/events/${activeEvent.id}`,{published:true});await load();},'Event published. Its published sessions are now accessible.')}>Publish event<ArrowUpRight size={15}/></button></div>}
      <div className="qh-admin-toolbar"><div className="qh-segment" aria-label="Workspace view"><button aria-pressed={tab==='sessions'} onClick={() => setTab('sessions')}><CalendarDays size={16}/>Sessions</button><button aria-pressed={tab==='moderation'} onClick={() => setTab('moderation')}><MessageCircle size={16}/>Moderation</button></div>{tab==='sessions' && <button className="btn btn--primary qh-button--compact" onClick={() => setEditor({type:'sessions',record:{event_id:activeEvent.id,position:filteredSessions.length+1}})}><Plus size={16}/>Add session</button>}</div>
      {tab==='sessions' ? <div className="qh-admin-session-list">{filteredSessions.length ? filteredSessions.map((session,index) => <article className="qh-admin-session" key={session.id}><div className="qh-admin-session__top"><span className="qh-session-number">{String(index+1).padStart(2,'0')}</span><div><h3>{session.title}</h3><p className="qh-caption">{session.starts_at ? `${questionDate(session.starts_at)} WAT` : 'Date not set'}{session.speaker ? ` · ${session.speaker}` : ''}</p></div><span className={`qh-chip ${session.published ? session.intake_open ? 'qh-chip--open' : 'qh-chip--blue' : 'qh-chip--muted'}`}>{session.published ? session.intake_open ? 'Questions open' : 'Intake closed' : 'Draft'}</span></div><div className="qh-admin-session__bottom"><Link className="qh-text-button" href={`/questions/${activeEvent.slug}/${session.slug}`}>Session page<ArrowUpRight size={15}/></Link><div className="qh-inline-actions"><button className="qh-button" disabled={busy || !session.published || !activeEvent.published} onClick={() => void toggleIntake(session)}>{session.intake_open ? 'Close intake' : 'Open intake'}</button><button className="qh-button" onClick={() => setEditor({type:'sessions',record:session})}><Pencil size={15}/>Edit</button></div></div></article>) : <AdminEmpty title="Make room for a conversation." text="Add your first session. It will stay private until you publish it."/>}</div> : <>
       <label className="qh-moderation-select">Session to moderate<select value={activeSession?.id ?? ''} onChange={e => {setSessionId(e.target.value);setPage(0);setQuestions([]);}}><option value="" disabled>Choose a session</option>{filteredSessions.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></label>
       {questionLoading ? <div className="qh-skeleton-grid" role="status" aria-label="Loading questions"><div/><div/></div> : questions.length ? questions.map(q => <article className={`qh-question-card ${!q.visible ? 'qh-question-card--hidden' : ''}`} key={q.id}><div className="qh-question-card__head"><span className="qh-avatar">{q.name.slice(0,1).toUpperCase()}</span><div><strong>{q.name}</strong><time dateTime={q.created_at}>{questionDate(q.created_at,true)} WAT</time></div><span className={`qh-chip ${q.visible ? 'qh-chip--open' : 'qh-chip--muted'}`}>{q.visible ? 'Visible' : 'Hidden'}</span></div><p className="qh-question-body">{q.body}</p>{q.speaker_point && <blockquote className="qh-reference"><span>Referring to</span>{q.speaker_point}</blockquote>}<button disabled={busy} className="qh-button" onClick={() => void run(async () => {await questionApi(`admin/questions/${q.id}`,{visible:!q.visible});setQuestions(items=>items.map(x=>x.id===q.id?{...x,visible:!q.visible}:x));},q.visible ? 'Question hidden from the public feed.' : 'Question restored to the public feed.')}>{q.visible ? <EyeOff size={15}/> : <Eye size={15}/>} {q.visible ? 'Hide question' : 'Restore question'}</button></article>) : <AdminEmpty title="All caught up." text={activeSession ? 'Questions for this session will appear here, including those you’ve hidden.' : 'Add a session to start receiving questions.'}/>}
       {activeSession && <div className="qh-pagination"><button className="qh-button" disabled={!page || questionLoading} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page+1}</span><button className="qh-button" disabled={!more || questionLoading} onClick={()=>setPage(p=>p+1)}>Next</button></div>}
      </>}
     </> : <AdminEmpty title="Start with an event." text="Use the plus button beside Your events to create one."/>}
    </section>
   </div>
  </>}
  <dialog ref={modal} className="qh-dialog" aria-labelledby="editor-title" onClose={() => setEditor(null)} onCancel={e=>{if(busy)e.preventDefault();}}>{editor && <form className="qh-form" onSubmit={save} key={`${editor.type}-${editor.record.id ?? 'new'}`}><div className="qh-dialog__header"><div><p className="section-label">{editor.record.id ? 'Make it yours' : 'Start a conversation'}</p><h2 id="editor-title">{editor.record.id ? 'Edit' : 'New'} {editor.type==='events' ? 'event' : 'session'}</h2></div><button type="button" disabled={busy} className="qh-icon-button" aria-label="Close editor" onClick={()=>modal.current?.close()}><X size={20}/></button></div><div className="qh-dialog__body"><EditorFields editor={editor} events={events}/>{notice?.error && <p className="qh-notice qh-notice--error" role="alert">{notice.message}</p>}</div><div className="qh-dialog__footer"><button type="button" disabled={busy} className="qh-button" onClick={()=>modal.current?.close()}>Cancel</button><button disabled={busy} className="btn btn--primary">{busy ? 'Saving…' : 'Save changes'}<Check size={17}/></button></div></form>}</dialog>
 </div></main>;
}
function EditorFields({editor,events}: {editor:Editor;events:QuestionEvent[]}) {
 const record=editor.record;
 const [title,setTitle]=useState(record.title ?? '');
 const [slug,setSlug]=useState(record.slug ?? '');
 const isSession=editor.type==='sessions';
 const session=isSession ? editor.record as Partial<QuestionSession> : null;
 const event=!isSession ? editor.record as Partial<QuestionEvent> : null;
 return <><label>{isSession ? 'Session title' : 'Event name'}<input name="title" value={title} onChange={e=>{setTitle(e.target.value);if(!record.id)setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));}} required maxLength={160} placeholder={isSession ? 'What will this conversation be about?' : 'Name your event'}/></label>
 {isSession ? <><label>Event<select name="event_id" defaultValue={session?.event_id} required>{events.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}</select></label><div className="qh-form-row"><label>Date and time · WAT<input name="starts_at" type="datetime-local" defaultValue={session?.starts_at ? new Date(new Date(session.starts_at).getTime()+3600000).toISOString().slice(0,16) : ''}/></label><label>Display order<input name="position" type="number" defaultValue={session?.position ?? 0} required/></label></div><label>Speaker<span className="qh-field-optional">Optional</span><input name="speaker" maxLength={160} defaultValue={session?.speaker ?? ''} placeholder="Speaker’s name"/></label></> : <><div className="qh-form-row"><label>Event type<select name="kind" defaultValue={event?.kind ?? 'pre'}><option value="pre">Pre-TechForge · different dates</option><option value="main">Main Event · one day</option></select></label><label>Edition<input name="edition" type="number" min={2026} max={2100} defaultValue={event?.edition ?? 2026} required/></label></div><label>Main Event date<input name="event_date" type="date" defaultValue={event?.event_date ?? ''}/><span className="qh-field-help">All published Main Event sessions must use this date.</span></label></>}
 <details className="qh-optional" open={!record.id}><summary><Settings2 size={16}/>Page link settings</summary><div><label>URL slug<input name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={e=>setSlug(e.target.value)} required/></label><p className="qh-caption">Keep this stable after sharing the page link.</p></div></details>
 <div className="qh-setting-row"><div><strong>Publish {isSession ? 'session' : 'event'}</strong><p>{isSession ? 'Requires a confirmed date and a published event.' : 'Make this event discoverable to attendees.'}</p></div><label className="qh-switch"><input name="published" type="checkbox" defaultChecked={record.published} aria-label={`Publish ${isSession ? 'session' : 'event'}`}/><span/></label></div>
 {isSession && <div className="qh-setting-row"><div><strong>Accept questions</strong><p>Attendees can submit when both event and session are published.</p></div><label className="qh-switch"><input name="intake_open" type="checkbox" defaultChecked={session?.intake_open} aria-label="Accept questions"/><span/></label></div>}
 </>;
}
function AdminEmpty({title,text}: {title:string;text:string}) { return <div className="qh-empty"><span className="qh-empty__icon"><MessageCircle size={28}/></span><h3>{title}</h3><p>{text}</p></div>; }
