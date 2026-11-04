import island from './commerce-island.png';
import {useEffect,useState} from 'react';
import {Brand,Field,Form} from './ui';
import {api} from './api';
import {ArrowUpRight,PackageCheck} from 'lucide-react';
export default function Auth({onLogin,role}) {
 const [emailMode,setEmailMode]=useState(false),[emailReady,setEmailReady]=useState(false),[email,setEmail]=useState('');useEffect(()=>{api('/auth/options').then(v=>setEmailReady(v.emailCodes)).catch(()=>{});},[]);
 const [register,setRegister]=useState(false),[notice,setNotice]=useState('');
 return <main className="auth-layout"><section className="auth-story"><Brand/><div><img className="auth-art" src={island} alt="" width="1536" height="1024"/><h1>One network.<br/>Every journey.</h1><p>Shop, manage your business and deliver.<br/>One shared DEN account.</p></div><footer>DEN Global Network <ArrowUpRight size={18}/></footer></section><section className="auth-form"><div className="auth-inner"><p className="muted">DEN Global</p><h2>{register?'Join the network.':'Welcome back.'}</h2><p className="muted">{register?'Create your account and start in Consumer.':'Sign in to continue your DEN journey.'}</p>{notice?<p role="status" className="notice">{notice}</p>:null}{!register&&emailReady?<button className="text-button" onClick={()=>setEmailMode(!emailMode)}>{emailMode?'Use password instead':'Sign in with an email code'}</button>:null}<Form key={String(register)+String(emailMode)} submit={register?'Create account':'Sign in'} onSubmit={async data=>{
 if(register){await api('/auth/register','POST',data);await api('/auth/login','POST',{email:data.email,password:data.password});await onLogin();}
 else{await api('/auth/login','POST',data);await onLogin();}
 }}>
 {register?<><Field label="Full name" name="name" required autoComplete="name" maxLength={100}/><Field label="Phone number" name="phone" type="tel" required autoComplete="tel" maxLength={40}/><Field label="Delivery address"><textarea name="address" autoComplete="street-address" required maxLength={1000}/></Field><Field label="Country"><select name="country" required><option value="NG">Nigeria</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="MA">Morocco</option></select></Field></>:null}
 <Field label="Email address" type="email" name="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/>
 {!emailMode||register?<Field label="Password" name="password" type="password" required minLength={register?12:1} maxLength={128} autoComplete={register?'new-password':'current-password'}/>:<><p className="small muted">For accounts with two-step authentication enabled. Keep your authenticator code ready.</p><button type="button" className="secondary" onClick={async()=>{try{const v=await api('/auth/email-code','POST',{email});setNotice(v.message);}catch(e){setNotice(e.message);}}}>Send sign-in email</button><Field label="Email sign-in code" name="emailCode" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code"/></>}
 {!register?<Field label="Authenticator code (if enabled)" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6}/>:null}
 {register?<p className="small muted">Use at least 12 characters. Registration does not approve your business or activate live shipments.</p>:null}
 </Form><p className="auth-switch">{register?'Already part of DEN?':'New to the network?'} <button className="text-button" onClick={()=>{setRegister(!register);setNotice('');}}>{register?'Sign in':'Create an account'}</button></p><p className="small muted">International Trade is locked by default. No payment collection is enabled.</p></div></section></main>;
}
