import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import {Component,Suspense,lazy,useEffect,useState} from 'react';
import {Bell,Box,Building2,ClipboardList,Compass,LockKeyhole,LogOut,MapPin,ShieldCheck,ShoppingBag,UserRound,Users,Truck,RefreshCw,WalletCards} from 'lucide-react';
import {api} from './api';
import {Brand} from './ui';
import Auth from './Auth';
import {Addresses,Notifications,Profile} from './common';
import Consumer from './Consumer';
import Manager from './Manager';
import Rider from './Rider';
import Orders from './Orders';
const Community=lazy(()=>import('./Community'));
const Wallet=lazy(()=>import('./Services').then(m=>({default:m.Wallet})));

const Security=lazy(()=>import('./Security'));
const Admin=lazy(()=>import('./Admin'));
const AdminAccounts=lazy(()=>import('./Admin').then(m=>({default:m.AdminAccounts})));
const TradeControl=lazy(()=>import('./Admin').then(m=>({default:m.TradeControl})));
const icons={browse:Compass,orders:Box,addresses:MapPin,notifications:Bell,security:ShieldCheck,wallet:WalletCards,community:Users,profile:UserRound,organization:Building2,onboarding:Truck,jobs:ClipboardList,dispatch:ClipboardList,reviews:Users,accounts:Users,trade:LockKeyhole};
const navigation={consumer:[['browse','Discover'],['orders','My orders'],['addresses','Addresses'],['community','Community']],manager:[['organization','Organization'],['orders','Incoming orders']],rider:[['onboarding','Rider profile'],['jobs','Delivery jobs'],['community','Communities']],dispatch:[['dispatch','Dispatch queue']],admin:[['reviews','Verification'],['accounts','Administrators'],['trade','Trade controls']]};
const titleCase=s=>s[0].toUpperCase()+s.slice(1);
const apps=['consumer','manager','rider','dispatch','transport','shipment','warehouse','admin'];
export default function App({role}){return <ErrorBoundary><Workspace role={role}/></ErrorBoundary>;}
function Workspace({role}){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[page,setPage]=useState(navigation[role][0][0]);
 const refresh=async()=>{const value=await api('/auth/me');setUser(value.user);};
 useEffect(()=>{refresh().catch(e=>{if(e.status!==401)setError(e.message);}).finally(()=>setLoading(false));},[]);
 if(loading)return <main className="boot" role="status"><strong>DEN</strong><p>Connecting your workspace…</p></main>;
 if(!user)return <>{error?<p className="error session-error">{error}</p>:null}<Auth role={titleCase(role)} onLogin={refresh}/></>;
 const nav=[...navigation[role],['profile','Profile'],['wallet','Wallet'],['notifications','Notifications'],['security','Security']];
 let content;
 if(page==='community')content=<Community/>;
 else if(page==='wallet')content=<Wallet/>;
 else if(page==='security')content=<Security user={user} onRefresh={refresh}/>;
 else if(page==='profile')content=<Profile/>;
 else if(page==='notifications')content=<Notifications/>;
 else if(page==='addresses')content=<Addresses/>;
 else if(page==='browse')content=<Consumer/>;
 else if(page==='organization')content=<Manager user={user}/>;
 else if(page==='onboarding')content=<Rider/>;
 else if(page==='reviews')content=<Admin/>;
 else if(page==='accounts')content=<AdminAccounts/>;
 else if(page==='trade')content=<TradeControl user={user}/>;
 else content=<Orders role={page==='jobs'?'rider':page==='dispatch'?'dispatch':role}/>;
 return <div className={`app-shell role-${role}`}><a className="skip-link" href="#workspace-content">Skip to content</a><aside className="sidebar"><Brand/><div className="workspace-label">{titleCase(role)} workspace</div><nav aria-label={`${titleCase(role)} navigation`}>{nav.map(([key,label])=>{const Icon=icons[key];return <button key={key} className={`nav-item ${page===key?'active':''}`} aria-current={page===key?'page':undefined} onClick={()=>setPage(key)}><Icon size={21} strokeWidth={1.7}/>{label}</button>;})}</nav><div className="sidebar-bottom"><div className="trade-status"><LockKeyhole size={20}/><div>International Trade<small>Locked by default</small></div></div><div className="identity"><UserRound size={22}/><div>{user.name}<small>{user.email}</small></div></div><button className="nav-item" onClick={async()=>{try{await api('/auth/logout','POST',{});setUser(null);}catch(e){setError(e.message);}}}><LogOut size={18}/>Sign out</button></div></aside><div className="workspace"><header className="topbar"><div className="workspace-context"><span className="context-root">DEN Global</span><span className="context-divider">/</span><span className="role-title">{nav.find(([key])=>key===page)?.[1]}</span></div><details className="app-switcher"><summary>Workspaces</summary><div>{apps.map(app=><a key={app} href={`/${app}/`}>{titleCase(app)}</a>)}</div></details></header><main className="main-content" id="workspace-content">{error?<p className="error" role="alert">{error}</p>:null}<Suspense fallback={<p role="status">Loading workspace…</p>}>{content}</Suspense></main><footer className="workspace-footer">DEN Global · One network. Every journey.<span>Development preview · Live payments and international bookings disabled</span></footer></div></div>;
}
class ErrorBoundary extends Component{state={error:null};static getDerivedStateFromError(error){return{error};}render(){return this.state.error?<main className="boot"><h1>We couldn't open this workspace.</h1><p role="alert">Please reload to reconnect. Your saved server data is retained.</p><button className="primary" onClick={()=>location.reload()}><RefreshCw size={16}/>Reload workspace</button></main>:this.props.children;}}
