import { useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  Compass,
  Droplets,
  FileSpreadsheet,
  Footprints,
  Lightbulb,
  LogIn,
  LogOut,
  LockKeyhole,
  MapPin,
  Menu,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'

type Mode = 'citizen' | 'admin'
type Status = 'Reported' | 'Assigned' | 'In Progress' | 'Resolved'
type Category = 'roads' | 'streetlights' | 'water' | 'waste' | 'footpath'
type Role = 'citizen' | 'admin'

type AuthUser = {
  name: string
  email: string
  role: Role
}

type Ticket = {
  id: string
  title: string
  category: Category
  location: string
  ward: string
  status: Status
  urgency: 'High' | 'Medium' | 'Low'
  reported: string
  description: string
  assigned: string
  x: number
  y: number
}

const categoryMeta: Record<Category, { label: string; icon: typeof AlertTriangle; color: string }> = {
  roads: { label: 'Roads', icon: AlertTriangle, color: '#d97706' },
  streetlights: { label: 'Streetlights', icon: Lightbulb, color: '#0f766e' },
  water: { label: 'Water', icon: Droplets, color: '#2563eb' },
  waste: { label: 'Waste', icon: Trash2, color: '#be5b34' },
  footpath: { label: 'Footpaths', icon: Footprints, color: '#7c3aed' },
}

const initialTickets: Ticket[] = [
  { id: 'CL-8021', title: 'Broken streetlight', category: 'streetlights', location: 'Road No. 36, Jubilee Hills Checkpost', ward: 'Circle 18', status: 'Assigned', urgency: 'High', reported: '18 min ago', description: 'Post JH-42 is dark near the metro pillar, creating a blind spot for pedestrians.', assigned: 'Circle 18 Electrical Unit', x: 31, y: 36 },
  { id: 'CL-8022', title: 'Asphalt pothole', category: 'roads', location: 'Mindspace Junction, opposite Inorbit Mall', ward: 'Madhapur', status: 'In Progress', urgency: 'High', reported: '1.5 hrs ago', description: 'Deep cavity along a busy evening bus corridor.', assigned: 'Rapid Bitumen Squad 2', x: 64, y: 29 },
  { id: 'CL-8023', title: 'Water main leak', category: 'water', location: 'Near KBR Park Gate 2, Road No. 2', ward: 'Banjara Hills', status: 'Reported', urgency: 'Medium', reported: '3 hrs ago', description: 'Pressurized water is overflowing into the stormwater gutter.', assigned: 'Unassigned', x: 49, y: 68 },
  { id: 'CL-8019', title: 'Damaged footpath slabs', category: 'footpath', location: 'Sindhi Colony Walkway, PG Road', ward: 'Secunderabad', status: 'Resolved', urgency: 'Low', reported: 'Yesterday', description: 'Cracked pavers were reset flush with the tactile guidance strip.', assigned: 'North Zone Pedestrian Wing', x: 76, y: 64 },
  { id: 'CL-8014', title: 'Overflowing waste bin', category: 'waste', location: 'Paradise Circle, MG Road', ward: 'Secunderabad', status: 'Reported', urgency: 'High', reported: '5 hrs ago', description: 'Commercial waste has spilled into the active bus lane.', assigned: 'Unassigned', x: 21, y: 77 },
]

const statusOrder: Status[] = ['Reported', 'Assigned', 'In Progress', 'Resolved']

const demoAccounts: Array<AuthUser & { password: string }> = [
  { name: 'Priya Rao', email: 'priya@hyderabad.in', password: 'citizen123', role: 'citizen' },
  { name: 'Er. K. Srinivas', email: 'admin@ghmc.gov.in', password: 'ghmc123', role: 'admin' },
]

function App() {
  const [mode, setMode] = useState<Mode>('citizen')
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const stored = window.localStorage.getItem('civiclens-session')
    return stored ? JSON.parse(stored) as AuthUser : null
  })
  const [tickets, setTickets] = useState(initialTickets)
  const [selectedId, setSelectedId] = useState('CL-8021')
  const [showReport, setShowReport] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authRole, setAuthRole] = useState<Role>('citizen')

  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0]
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }
  const updateTicket = (id: string, status: Status) => {
    setTickets((items) => items.map((item) => item.id === id ? { ...item, status, reported: 'Updated just now' } : item))
    notify(`${id} moved to ${status}`)
  }
  const switchMode = (next: Mode) => {
    if (next === 'admin' && authUser?.role !== 'admin') {
      setAuthRole('admin')
      setAuthOpen(true)
      notify('Admin authentication is required')
      return
    }
    setMode(next)
    setMobileNav(false)
    notify(next === 'admin' ? 'GHMC Admin Console opened' : 'Citizen workspace opened')
  }
  const openReport = () => {
    if (!authUser) {
      setAuthRole('citizen')
      setAuthOpen(true)
      notify('Sign in to submit a report')
      return
    }
    setShowReport(true)
  }
  const handleAuth = (user: AuthUser) => {
    setAuthUser(user)
    window.localStorage.setItem('civiclens-session', JSON.stringify(user))
    setAuthOpen(false)
    setMode(user.role === 'admin' ? 'admin' : 'citizen')
    notify(`Signed in as ${user.name}`)
  }
  const signOut = () => {
    setAuthUser(null)
    setMode('citizen')
    setShowProfile(false)
    window.localStorage.removeItem('civiclens-session')
    notify('You have been signed out')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CivicLens home">
          <span className="brand-mark"><Compass size={19} /></span>
          <span><strong>CIVICLENS</strong><small>Hyderabad civic portal</small></span>
        </a>
        <nav className={`mode-nav ${mobileNav ? 'is-open' : ''}`}>
          <button className={mode === 'citizen' ? 'active' : ''} onClick={() => switchMode('citizen')}><UserRound size={15} /> Citizen view</button>
          <button className={mode === 'admin' ? 'active admin' : ''} onClick={() => switchMode('admin')}><ShieldCheck size={15} /> Admin console</button>
        </nav>
        <div className="top-actions">
          {mode === 'citizen' && <button className="button button-dark compact" onClick={openReport}><Camera size={15} /> Report issue</button>}
          <button className="profile-button" onClick={() => authUser ? setShowProfile(!showProfile) : (setAuthRole('citizen'), setAuthOpen(true))}>{authUser ? <><span className="avatar">{authUser.name.charAt(0)}</span><span className="profile-name">{authUser.name}</span><ChevronDown size={14} /></> : <><LogIn size={15} /><span className="profile-name">Sign in</span></>}</button>
          <button className="menu-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button>
          {showProfile && authUser && <div className="profile-menu"><strong>{authUser.name}</strong><span>{authUser.role === 'admin' ? 'GHMC administrator' : 'Verified resident'}</span><button onClick={() => switchMode(authUser.role === 'admin' ? 'admin' : 'citizen')}>Open {authUser.role === 'admin' ? 'admin' : 'citizen'} workspace</button><button onClick={signOut}><LogOut size={13} /> Sign out</button></div>}
        </div>
      </header>

      <div className={`status-ribbon ${mode}`}><span className="live-dot" />{mode === 'citizen' ? <><strong>CITIZEN WORKFLOW</strong> Upload a photo and follow the repair.</> : <><strong>MUNICIPAL OPERATIONS</strong> Triage reports and dispatch field squads.</>}<button onClick={() => switchMode(mode === 'citizen' ? 'admin' : 'citizen')}>Switch to {mode === 'citizen' ? 'admin' : 'citizen'} <ArrowUpRight size={13} /></button></div>

      <main id="top">
        {mode === 'citizen' ? <CitizenView tickets={tickets} selected={selected} onSelect={setSelectedId} onReport={openReport} /> : <AdminView tickets={tickets} selected={selected} onSelect={setSelectedId} onStatus={updateTicket} />}
      </main>

      <footer><span><Compass size={15} /> CIVICLENS · HYDERABAD</span><span>Built for clearer streets and faster fixes.</span><span>Public reports · Municipal response</span></footer>
      {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={(ticket) => { setTickets((items) => [ticket, ...items]); setSelectedId(ticket.id); setShowReport(false); notify(`${ticket.id} submitted for review`) }} />}
      {authOpen && <AuthModal initialRole={authRole} onClose={() => setAuthOpen(false)} onAuthenticated={handleAuth} />}
      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  )
}

function CitizenView({ tickets, selected, onSelect, onReport }: { tickets: Ticket[]; selected: Ticket; onSelect: (id: string) => void; onReport: () => void }) {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const visibleTickets = tickets.filter((ticket) => (categoryFilter === 'all' || ticket.category === categoryFilter) && `${ticket.title} ${ticket.location} ${ticket.id}`.toLowerCase().includes(search.toLowerCase()))
  return <>
    <section className="hero container"><div className="eyebrow"><span>FIELD NOTE 09</span> Small reports, visible progress.</div><h1>Make your street<br /><em>easier to live in.</em></h1><p>Photograph a problem in Hyderabad, send it to the right team, and see every handoff from report to resolution.</p><button className="button button-teal" onClick={onReport}><Plus size={17} /> Start a photo report <ArrowUpRight size={15} /></button><div className="hero-stats"><span><strong>{tickets.length}</strong> active reports</span><span><strong>18</strong> wards connected</span><span><strong>4.2 days</strong> average resolution</span></div></section>
    <section className="workspace container"><div className="report-panel panel"><div className="panel-heading"><div className="number">01</div><div><h2>Spot a problem</h2><p>One photo is enough to start.</p></div><Camera className="heading-icon" size={21} /></div><button className="upload-zone" onClick={onReport}><span className="upload-icon"><Camera size={24} /></span><strong>Upload a street photo</strong><span>JPG, PNG or a phone camera image</span><small><MapPin size={12} /> GPS location will be attached</small></button><div className="category-row"><span>Common reports</span><div>{(Object.keys(categoryMeta) as Category[]).map((category) => { const meta = categoryMeta[category]; const Icon = meta.icon; return <button key={category} onClick={onReport} title={`Report ${meta.label}`}><Icon size={15} /> {meta.label}</button> })}</div></div></div><ProgressPanel ticket={selected} /></section>
    <section className="reports container"><div className="section-head"><div><span className="kicker"><Sparkles size={13} /> LIVE BOARD</span><h2>Recent neighborhood reports</h2></div><span className="count-pill">{visibleTickets.length} visible</span></div><div className="report-tools"><label><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports or locations" /></label><div className="filter-pills"><button className={categoryFilter === 'all' ? 'active' : ''} onClick={() => setCategoryFilter('all')}>All</button>{(Object.keys(categoryMeta) as Category[]).map((category) => <button key={category} className={categoryFilter === category ? 'active' : ''} onClick={() => setCategoryFilter(category)}>{categoryMeta[category].label}</button>)}</div></div><div className="ticket-grid">{visibleTickets.length ? visibleTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} selected={ticket.id === selected.id} onClick={() => onSelect(ticket.id)} />) : <div className="empty-board"><Sparkles size={20} /><strong>No reports match that search.</strong><span>Try another neighborhood or category.</span></div>}</div></section>
  </>
}

function ProgressPanel({ ticket }: { ticket: Ticket }) {
  const current = statusOrder.indexOf(ticket.status)
  return <div className="progress-panel panel"><div className="panel-heading"><div className="number">02</div><div><h2>Follow the fix</h2><p>Live status for your selected report.</p></div><Activity className="heading-icon" size={21} /></div><div className="tracking-chip"><Sparkles size={13} /> You are tracking this report</div><div className="selected-ticket"><div className="ticket-top"><span className="ticket-id">{ticket.id}</span><span className={`urgency ${ticket.urgency.toLowerCase()}`}>{ticket.urgency}</span></div><h3>{ticket.title}</h3><p><MapPin size={14} /> {ticket.location}</p></div><div className="timeline">{statusOrder.map((status, index) => <div className={`timeline-item ${index < current ? 'done' : ''} ${index === current ? 'current' : ''}`} key={status}><span className="timeline-dot">{index < current ? <Check size={13} /> : <CircleDot size={13} />}</span><div><strong>{status}</strong><span>{status === 'Reported' ? 'Photo proof logged' : status === 'Assigned' ? ticket.assigned : status === 'In Progress' ? 'Crew is active on site' : 'Field work verified'}</span></div>{index === current && <small>now</small>}</div>)}</div><div className="dispatch-note"><span>FIELD NOTE</span><p>{ticket.description}</p></div></div>
}

function TicketCard({ ticket, selected, onClick }: { ticket: Ticket; selected: boolean; onClick: () => void }) {
  const meta = categoryMeta[ticket.category]; const Icon = meta.icon
  return <button aria-pressed={selected} className={`ticket-card ${selected ? 'selected' : ''}`} onClick={onClick}><div className="ticket-card-head"><span className="ticket-id">{ticket.id}</span><span>{selected && <span className="selected-label"><Check size={10} /> tracking</span>}<span className={`status status-${ticket.status.toLowerCase().replace(/ /g, '-')}`}>{ticket.status}</span></span></div><div className="ticket-card-body"><span className="category-icon" style={{ color: meta.color, background: `${meta.color}14` }}><Icon size={18} /></span><span><strong>{ticket.title}</strong><small><MapPin size={12} /> {ticket.location}</small></span></div><div className="mini-progress"><span style={{ width: `${(statusOrder.indexOf(ticket.status) + 1) * 25}%` }} /></div></button>
}

function AdminView({ tickets, selected, onSelect, onStatus }: { tickets: Ticket[]; selected: Ticket; onSelect: (id: string) => void; onStatus: (id: string, status: Status) => void }) {
  const [filter, setFilter] = useState<'All' | Status>('All')
  const visible = filter === 'All' ? tickets : tickets.filter((ticket) => ticket.status === filter)
  const stats = useMemo(() => ({ open: tickets.filter((ticket) => ticket.status !== 'Resolved').length, urgent: tickets.filter((ticket) => ticket.urgency === 'High').length, progress: tickets.filter((ticket) => ticket.status === 'In Progress').length }), [tickets])
  return <section className="admin-page container"><div className="admin-intro"><div><span className="eyebrow dark"><ShieldCheck size={14} /> AUTHORIZED WORKSPACE</span><h1>Morning triage, <em>made legible.</em></h1><p>Circle 18 operations desk · Thursday, 19 September 2026</p></div><button className="button button-outline" onClick={() => alert('Demo export prepared')}><FileSpreadsheet size={16} /> Export audit log</button></div><div className="metric-grid"><Metric label="Open reports" value={stats.open.toString().padStart(2, '0')} note="Across active wards" tone="teal" /><Metric label="High urgency" value={stats.urgent.toString().padStart(2, '0')} note="Need attention today" tone="orange" /><Metric label="In field" value={stats.progress.toString().padStart(2, '0')} note="Crews dispatched" tone="blue" /><Metric label="Resolved this week" value="24" note="+18% vs last week" tone="purple" /></div><div className="admin-grid"><div className="work-orders panel"><div className="section-head"><div><span className="kicker">WORK ORDER QUEUE</span><h2>Reports needing a decision</h2></div><div className="filter-tabs">{(['All', ...statusOrder] as const).map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="order-list">{visible.map((ticket) => <button className={`order-row ${selected.id === ticket.id ? 'selected' : ''}`} key={ticket.id} onClick={() => onSelect(ticket.id)}><span className="order-icon" style={{ color: categoryMeta[ticket.category].color }}><MapPin size={17} /></span><span className="order-main"><strong>{ticket.title}</strong><small>{ticket.id} · {ticket.location}</small></span><span className={`status status-${ticket.status.toLowerCase().replace(/ /g, '-')}`}>{ticket.status}</span><span className="order-time">{ticket.reported}</span></button>)}</div></div><div className="dispatch-panel panel"><div className="section-head"><div><span className="kicker">SELECTED WORK ORDER</span><h2>{selected.id}</h2></div><span className={`urgency ${selected.urgency.toLowerCase()}`}>{selected.urgency}</span></div><div className="map-preview"><span className="map-label"><MapPin size={13} /> {selected.ward}</span><div className="map-grid" /> <span className="map-pin" style={{ left: `${selected.x}%`, top: `${selected.y}%` }}><MapPin size={25} fill="currentColor" /></span></div><h3>{selected.title}</h3><p className="muted">{selected.description}</p><p className="location-line"><MapPin size={14} /> {selected.location}</p><div className="assignment"><span><span className="assignment-avatar">G</span><span><small>Assigned crew</small><strong>{selected.assigned}</strong></span></span><Clock3 size={17} /></div><div className="status-actions"><span>Move report to</span>{statusOrder.map((status) => <button key={status} className={selected.status === status ? 'active' : ''} onClick={() => onStatus(selected.id, status)}>{status === selected.status && <Check size={12} />}{status}</button>)}</div></div></div></section>
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) { return <div className={`metric ${tone}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }

function AuthModal({ initialRole, onClose, onAuthenticated }: { initialRole: Role; onClose: () => void; onAuthenticated: (user: AuthUser) => void }) {
  const [role, setRole] = useState<Role>(initialRole)
  const [registering, setRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState(initialRole === 'admin' ? 'admin@ghmc.gov.in' : 'priya@hyderabad.in')
  const [password, setPassword] = useState(initialRole === 'admin' ? 'ghmc123' : 'citizen123')
  const [error, setError] = useState('')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (registering) {
      if (!name.trim() || password.length < 8) {
        setError('Enter your name and a password with at least 8 characters.')
        return
      }
      onAuthenticated({ name: name.trim(), email: email.trim().toLowerCase(), role: 'citizen' })
      return
    }
    const account = demoAccounts.find((item) => item.email === email.trim().toLowerCase() && item.password === password && item.role === role)
    if (!account) {
      setError(role === 'admin' ? 'Admin credentials were not recognized.' : 'Email or password is incorrect.')
      return
    }
    onAuthenticated({ name: account.name, email: account.email, role: account.role })
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal auth-modal" onSubmit={submit}><button type="button" className="close-button" onClick={onClose}><X size={19} /></button><span className="eyebrow"><LockKeyhole size={13} /> SECURE ACCESS</span><h2>{registering ? 'Create a resident account' : role === 'admin' ? 'GHMC staff sign in' : 'Welcome back'}</h2><p>{registering ? 'Create an account to submit and track your civic reports.' : 'Use your CivicLens account to continue.'}</p><div className="auth-tabs"><button type="button" className={role === 'citizen' && !registering ? 'active' : ''} onClick={() => { setRole('citizen'); setRegistering(false); setError('') }}>Citizen</button><button type="button" className={role === 'admin' && !registering ? 'active admin' : ''} onClick={() => { setRole('admin'); setRegistering(false); setEmail('admin@ghmc.gov.in'); setPassword('ghmc123'); setError('') }}>GHMC admin</button><button type="button" className={registering ? 'active' : ''} onClick={() => { setRole('citizen'); setRegistering(true); setPassword(''); setError('') }}>Register</button></div>{registering && <label>Your name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Priya Rao" /></label>}<label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" /></label>{error && <div className="auth-error">{error}</div>}{!registering && <div className="demo-hint">Demo {role === 'admin' ? 'admin' : 'citizen'}: <strong>{role === 'admin' ? 'admin@ghmc.gov.in / ghmc123' : 'priya@hyderabad.in / citizen123'}</strong></div>}<button className="button button-teal submit-button" type="submit">{registering ? <><UserRound size={16} /> Create citizen account</> : <><LogIn size={16} /> Sign in as {role === 'admin' ? 'admin' : 'citizen'}</>}</button></form></div>
}

function ReportModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (ticket: Ticket) => void }) {
  const [category, setCategory] = useState<Category>('roads'); const [location, setLocation] = useState('Road No. 36, Jubilee Hills'); const [note, setNote] = useState(''); const [photoName, setPhotoName] = useState(''); const [photoPreview, setPhotoPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handlePhoto = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setPhotoName(file.name); const reader = new FileReader(); reader.onload = () => setPhotoPreview(String(reader.result)); reader.readAsDataURL(file) }
  const submit = (event: React.FormEvent) => { event.preventDefault(); const meta = categoryMeta[category]; onSubmit({ id: `CL-${Math.floor(8100 + Math.random() * 800)}`, title: meta.label === 'Roads' ? 'New road fault' : `New ${meta.label.toLowerCase()} report`, category, location, ward: 'Circle 18', status: 'Reported', urgency: 'Medium', reported: 'Just now', description: note || 'Photo report submitted by a verified resident.', assigned: 'Awaiting triage', x: 38, y: 44 }) }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={submit}><button type="button" className="close-button" onClick={onClose}><X size={19} /></button><span className="eyebrow">NEW FIELD REPORT</span><h2>What needs attention?</h2><p>Give the city team a useful starting point. A location and a short note go a long way.</p><label>Problem category<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{(Object.keys(categoryMeta) as Category[]).map((item) => <option key={item} value={item}>{categoryMeta[item].label}</option>)}</select></label><label>Street or landmark<input required value={location} onChange={(event) => setLocation(event.target.value)} /></label><label>Short note <span>(optional)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Near a crossing, school, bus stop..." /></label><input ref={fileInputRef} className="file-input" type="file" accept="image/*" onChange={handlePhoto} /><button className={`upload-placeholder ${photoPreview ? 'has-photo' : ''}`} type="button" onClick={() => fileInputRef.current?.click()}>{photoPreview ? <img src={photoPreview} alt="Selected report" /> : <Camera size={19} />}<span><strong>{photoName || 'Attach a photo'}</strong><small>{photoName ? 'Image ready to submit' : 'JPG, PNG or phone camera image'}</small></span>{photoName ? <Check size={17} /> : <Plus size={17} />}</button><button className="button button-teal submit-button" type="submit"><Send size={16} /> Submit report <ArrowUpRight size={15} /></button></form></div>
}

export default App
