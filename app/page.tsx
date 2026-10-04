'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Code2, FolderOpen, LogOut, Menu, Settings2, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type UserProfile = { fullName: string; email: string; company: string }
type Section = 'Overview' | 'Findings' | 'Scans' | 'CI/CD' | 'Settings'

function AuthPage({ onAuthenticated }: { onAuthenticated: (profile: UserProfile) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (!email || !password || (mode === 'signup' && (!fullName || !company))) {
      setError(mode === 'signup' ? 'Complete your personal details to continue.' : 'Enter your email and password to continue.')
      return
    }
    onAuthenticated({ fullName: mode === 'signup' ? fullName : email.split('@')[0], email, company: mode === 'signup' ? company : '' })
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#0f1012] px-5 py-10 text-slate-200">
    <section className="w-full max-w-md rounded border border-white/[0.1] bg-[#17181b] p-7 shadow-2xl shadow-black/20">
      <div className="mb-8 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded bg-sky-400 text-[#07131b]"><Code2 size={19}/></div><div><p className="text-base font-bold text-white">Sentinel<span className="text-sky-400">.</span></p><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Security workspace</p></div></div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400">{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-white">{mode === 'login' ? 'Log in to Sentinel' : 'Tell us about yourself'}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">{mode === 'login' ? 'Access your security validation workspace.' : 'Your personal details are required before you can enter the workspace.'}</p>
      <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
        {mode === 'signup' && <><label className="field">Full name<Input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your name" /></label><label className="field">Company or team<Input required value={company} onChange={e=>setCompany(e.target.value)} placeholder="Your company" /></label></>}
        <label className="field">Email address<Input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" /></label>
        <label className="field">Password<Input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" /></label>
        {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
        <Button type="submit" className="mt-2 h-11 rounded-sm bg-sky-400 font-semibold text-[#06131b] hover:bg-sky-300">{mode === 'login' ? 'Log in' : 'Create account'}</Button>
      </form>
      <button className="mt-6 w-full text-center text-xs text-slate-500 hover:text-sky-300" onClick={()=>{setMode(mode === 'login' ? 'signup' : 'login');setError('')}}>{mode === 'login' ? 'New to Sentinel? Create an account' : 'Already have an account? Log in'}</button>
    </section>
  </main>
}

function UserMenu({ profile, onProfile, onLogout }: { profile: UserProfile; onProfile: () => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const initials = profile.fullName.split(' ').map(part=>part[0]).join('').slice(0,2).toUpperCase()
  return <div className="relative">
    <button aria-expanded={open} aria-haspopup="menu" onClick={()=>setOpen(!open)} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-white/[0.06]" aria-label="Open account menu"><div className="size-7 rounded-full bg-indigo-400/20 text-center font-mono text-[10px] leading-7 text-indigo-300">{initials || 'U'}</div><ChevronDown size={13} className={cn('text-slate-500 transition-transform', open && 'rotate-180')}/></button>
    {open && <div role="menu" className="absolute right-0 top-11 z-40 w-52 rounded border border-white/10 bg-[#1b1d20] p-1 shadow-xl shadow-black/30"><div className="border-b border-white/[0.08] px-3 py-2"><p className="truncate text-xs font-medium text-white">{profile.fullName}</p><p className="truncate font-mono text-[10px] text-slate-500">{profile.email}</p></div><button role="menuitem" onClick={()=>{setOpen(false);onProfile()}} className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"><UserRound size={14}/>Personal details</button><button role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-xs text-red-300 hover:bg-red-400/10"><LogOut size={14}/>Log out</button></div>}
  </div>
}

function EmptyProject({ section }: { section: Section }) {
  const descriptions: Record<Section, string> = { Overview: 'Connect a project to begin monitoring your code security posture.', Findings: 'Findings will appear here after a connected project is scanned.', Scans: 'Run history will appear here after you connect a project.', 'CI/CD': 'Connect a project to configure security checks in your delivery pipeline.', Settings: 'Project settings become available after a project is connected.' }
  return <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-6 py-12"><div className="max-w-md text-center"><div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-300"><FolderOpen size={25}/></div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-400">{section}</p><h1 className="mt-3 text-2xl font-semibold text-white">No project connected</h1><p className="mt-3 text-sm leading-6 text-slate-400">{descriptions[section]}</p><Button variant="outline" className="mt-6 rounded-sm border-white/10 bg-transparent text-slate-200 hover:bg-white/[0.06]"><FolderOpen data-icon="inline-start"/>Connect project</Button></div></section>
}

function Notifications() {
  const [open, setOpen] = useState(false)
  return <div className="relative"><button onClick={()=>setOpen(!open)} aria-expanded={open} aria-haspopup="menu" aria-label="Open notifications" className="relative rounded p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"><Bell size={17}/><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber-300"/></button>{open && <div role="menu" className="absolute right-0 top-11 z-40 w-72 rounded border border-white/10 bg-[#1b1d20] p-1 shadow-xl shadow-black/30"><div className="border-b border-white/[0.08] px-3 py-2"><p className="text-xs font-semibold text-white">Notifications</p><p className="mt-1 font-mono text-[10px] text-slate-500">Project activity and risk alerts</p></div><div className="flex items-start gap-3 px-3 py-4"><span className="mt-0.5 size-2 rounded-full bg-amber-300"/><div><p className="text-xs font-medium text-amber-200">Project not connected</p><p className="mt-1 text-xs leading-5 text-slate-500">Connect a project to see high and medium risk errors here.</p></div></div></div>}</div>
}

function Workspace({ profile, onLogout }: { profile: UserProfile; onLogout: () => void }) {
  const [navOpen, setNavOpen] = useState(false)
  const [section, setSection] = useState<Section>('Overview')
  const [showProfile, setShowProfile] = useState(false)
  const initials = profile.fullName.split(' ').map(part=>part[0]).join('').slice(0,2).toUpperCase()
  return <div className="min-h-screen bg-[#131416] text-slate-200"><aside className={cn('fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/[0.08] bg-[#101113] transition-transform lg:translate-x-0', navOpen ? 'translate-x-0' : '-translate-x-full')}><div className="flex h-20 items-center justify-between border-b border-white/[0.08] px-6"><div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded bg-sky-400 text-[#07131b]"><Code2 size={18}/></div><div><p className="text-sm font-bold text-white">Sentinel<span className="text-sky-400">.</span></p><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Security workspace</p></div></div><button className="text-slate-500 lg:hidden" onClick={()=>setNavOpen(false)} aria-label="Close navigation"><X size={18}/></button></div><nav className="flex-1 px-3 py-5"><p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Project</p>{(['Overview','Findings','Scans','CI/CD','Settings'] as Section[]).map(item=><button key={item} onClick={()=>{setSection(item);setNavOpen(false)}} className={cn('mb-1 flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-left',section===item?'bg-sky-400/10 text-sky-300':'text-slate-400 hover:bg-white/[0.04] hover:text-white')}><span className="size-1.5 rounded-full bg-current opacity-60"/>{item}</button>)}</nav><button onClick={()=>setShowProfile(true)} className="flex items-center gap-3 border-t border-white/[0.08] p-4 text-left hover:bg-white/[0.04]"><div className="flex size-8 items-center justify-center rounded-full bg-indigo-400/20 font-mono text-xs text-indigo-300">{initials || 'U'}</div><div className="min-w-0"><p className="truncate text-xs font-medium text-white">{profile.fullName}</p><p className="truncate font-mono text-[10px] text-slate-500">{profile.email}</p></div><ChevronDown size={14} className="ml-auto text-slate-600"/></button></aside><div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/[0.08] bg-[#131416]/95 px-5 backdrop-blur lg:px-8"><button className="rounded p-2 text-slate-400 hover:bg-white/[0.06] lg:hidden" onClick={()=>setNavOpen(true)} aria-label="Open navigation"><Menu size={19}/></button><div className="hidden lg:block"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Workspace</p><p className="text-sm font-medium text-white">{section}</p></div><div className="ml-auto flex items-center gap-3"><Notifications/><UserMenu profile={profile} onProfile={()=>setShowProfile(true)} onLogout={onLogout}/></div></header><main>{showProfile ? <section className="mx-auto max-w-2xl px-6 py-12"><div className="rounded border border-white/10 bg-[#17181b] p-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-400">Account</p><h1 className="mt-2 text-2xl font-semibold text-white">Personal details</h1></div><button onClick={()=>setShowProfile(false)} aria-label="Close personal details" className="rounded p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"><X size={18}/></button></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><div><p className="text-xs text-slate-500">Full name</p><p className="mt-1 text-sm text-white">{profile.fullName}</p></div><div><p className="text-xs text-slate-500">Email address</p><p className="mt-1 text-sm text-white">{profile.email}</p></div><div><p className="text-xs text-slate-500">Company or team</p><p className="mt-1 text-sm text-white">{profile.company || 'Not provided'}</p></div></div></div></section> : <EmptyProject section={section}/>}</main></div></div>
}

export default function Page() { const [profile, setProfile] = useState<UserProfile | null>(null); return profile ? <Workspace profile={profile} onLogout={()=>setProfile(null)}/> : <AuthPage onAuthenticated={setProfile}/> }
