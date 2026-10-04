'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Code2, LogOut, Menu, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type UserProfile = { fullName: string; email: string; company: string }

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

function Workspace({ profile, onLogout }: { profile: UserProfile; onLogout: () => void }) {
  const [navOpen, setNavOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const initials = profile.fullName.split(' ').map(part=>part[0]).join('').slice(0,2).toUpperCase()
  return <div className="min-h-screen bg-[#131416] text-slate-200"><aside className={cn('fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/[0.08] bg-[#101113] transition-transform lg:translate-x-0', navOpen ? 'translate-x-0' : '-translate-x-full')}><div className="flex h-20 items-center justify-between border-b border-white/[0.08] px-6"><div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded bg-sky-400 text-[#07131b]"><Code2 size={18}/></div><div><p className="text-sm font-bold text-white">Sentinel<span className="text-sky-400">.</span></p><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Security workspace</p></div></div><button className="text-slate-500 lg:hidden" onClick={()=>setNavOpen(false)} aria-label="Close navigation"><X size={18}/></button></div><nav className="flex-1 px-3 py-5"><p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Project</p>{['Overview','Findings','Scans','CI/CD','Settings'].map((item,index)=><button key={item} className={cn('mb-1 flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm',index===0?'bg-sky-400/10 text-sky-300':'text-slate-400 hover:bg-white/[0.04] hover:text-white')}><span className="size-1.5 rounded-full bg-current opacity-60"/>{item}</button>)}</nav><button onClick={()=>setShowProfile(true)} className="flex items-center gap-3 border-t border-white/[0.08] p-4 text-left hover:bg-white/[0.04]"><div className="flex size-8 items-center justify-center rounded-full bg-indigo-400/20 font-mono text-xs text-indigo-300">{initials || 'U'}</div><div className="min-w-0"><p className="truncate text-xs font-medium text-white">{profile.fullName}</p><p className="truncate font-mono text-[10px] text-slate-500">{profile.email}</p></div><ChevronDown size={14} className="ml-auto text-slate-600"/></button></aside><div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/[0.08] bg-[#131416]/90 px-5 backdrop-blur lg:px-10"><button onClick={()=>setNavOpen(true)} className="text-slate-400 lg:hidden" aria-label="Open navigation"><Menu size={20}/></button><div className="hidden items-center gap-2 font-mono text-xs text-slate-500 sm:flex">{profile.company || 'Personal workspace'} <span className="text-slate-700">/</span> <span className="text-slate-300">Overview</span></div><div className="ml-auto flex items-center gap-4"><button className="relative text-slate-500 hover:text-white" aria-label="Notifications"><Bell size={18}/><span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-sky-400"/></button><div className="hidden h-5 w-px bg-white/10 sm:block"/><UserMenu profile={profile} onProfile={()=>setShowProfile(true)} onLogout={onLogout}/></div></header><main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10">{showProfile ? <section className="max-w-2xl"><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400">Account</p><h1 className="text-3xl font-semibold text-white">Personal details</h1><p className="mt-2 text-sm text-slate-400">Your account information will remain here until authentication is connected.</p><div className="mt-8 flex flex-col gap-4 rounded border border-white/[0.08] bg-[#17181b] p-6"><label className="field">Full name<Input value={profile.fullName} readOnly/></label><label className="field">Email address<Input value={profile.email} readOnly/></label><label className="field">Company or team<Input value={profile.company} readOnly placeholder="Not provided"/></label></div></section> : <><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400">Project overview</p><h1 className="text-3xl font-semibold tracking-tight text-white">Security gate</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Connect a repository or run your first scan to see security validation results.</p><section className="mt-8 flex min-h-72 flex-col items-center justify-center rounded border border-dashed border-white/[0.12] bg-[#17181b] p-8 text-center"><div className="mb-4 flex size-12 items-center justify-center rounded-full bg-sky-400/10 text-sky-300"><Code2 size={22}/></div><h2 className="text-base font-semibold text-white">No security data yet</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Your findings, scans, and gate decisions will appear here after you connect your own project and run a scan.</p><Button className="mt-6 rounded-sm bg-sky-400 font-semibold text-[#06131b] hover:bg-sky-300">Connect project</Button></section></>}</main></div></div>
}

export default function Page() { const [profile, setProfile] = useState<UserProfile | null>(null); return profile ? <Workspace profile={profile} onLogout={()=>setProfile(null)}/> : <AuthPage onAuthenticated={setProfile}/> }
