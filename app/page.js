"use client"
import { useState, useEffect } from 'react'
export default function Home() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({ company: '', position: '', date: '', status: 'Applied', resume: null, resumeName: '', coverLetter: null, coverLetterName: '', notes: '' })
  const [view, setView] = useState(null)
  useEffect(() => { const saved = localStorage.getItem('jobs'); if (saved) setJobs(JSON.parse(saved)) }, [])
  useEffect(() => { localStorage.setItem('jobs', JSON.stringify(jobs)) }, [jobs])
  const toBase64 = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file) })
  const handleFile = async (e, field, nameField) => { const f = e.target.files[0]; if (f) { const b64 = await toBase64(f); setForm({ ...form, [field]: b64, [nameField]: f.name }) } }
  const add = () => { if (form.company && form.position) { setJobs([...jobs, { ...form, id: Date.now() }]); setForm({ company: '', position: '', date: '', status: 'Applied', resume: null, resumeName: '', coverLetter: null, coverLetterName: '', notes: '' }); document.querySelectorAll('input[type=file]').forEach(i => i.value = '') } }
  const del = (id) => setJobs(jobs.filter(j => j.id !== id))
  const download = (data, name) => { const a = document.createElement('a'); a.href = data; a.download = name; a.click() }
  const statusColor = { Applied: '#3b82f6', Interview: '#f59e0b', Offer: '#22c55e', Rejected: '#ef4444' }
  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:20}}>
      <h1 style={{marginBottom:20}}>Job Application Tracker</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:10}}>
        <input placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} style={{padding:10,border:'1px solid #ccc',borderRadius:4}}/>
        <input placeholder="Position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})} style={{padding:10,border:'1px solid #ccc',borderRadius:4}}/>
        <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{padding:10,border:'1px solid #ccc',borderRadius:4}}/>
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{padding:10,border:'1px solid #ccc',borderRadius:4}}>
          <option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option>
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
        <div><label style={{display:'block',marginBottom:4,fontSize:14,color:'#666'}}>Resume (.docx, .pdf)</label><input type="file" accept=".docx,.pdf" onChange={e=>handleFile(e,'resume','resumeName')} style={{padding:8,border:'1px solid #ccc',borderRadius:4,width:'100%',boxSizing:'border-box'}}/></div>
        <div><label style={{display:'block',marginBottom:4,fontSize:14,color:'#666'}}>Cover Letter (.docx, .pdf)</label><input type="file" accept=".docx,.pdf" onChange={e=>handleFile(e,'coverLetter','coverLetterName')} style={{padding:8,border:'1px solid #ccc',borderRadius:4,width:'100%',boxSizing:'border-box'}}/></div>
      </div>
      <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{width:'100%',height:60,padding:10,border:'1px solid #ccc',borderRadius:4,marginBottom:10,boxSizing:'border-box'}}/>
      <button onClick={add} style={{padding:'10px 20px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:4,cursor:'pointer',marginBottom:20}}>Add Application</button>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr style={{background:'#f3f4f6'}}>{['Company','Position','Date','Status','Files','Actions'].map(h=><th key={h} style={{padding:12,textAlign:'left',borderBottom:'2px solid #e5e7eb'}}>{h}</th>)}</tr></thead>
        <tbody>
          {jobs.map(j=>(
            <tr key={j.id} style={{borderBottom:'1px solid #e5e7eb'}}>
              <td style={{padding:12}}>{j.company}</td>
              <td style={{padding:12}}>{j.position}</td>
              <td style={{padding:12}}>{j.date}</td>
              <td style={{padding:12}}><span style={{padding:'4px 8px',borderRadius:4,background:statusColor[j.status],color:'#fff',fontSize:12}}>{j.status}</span></td>
              <td style={{padding:12}}>{j.resume && '📄'} {j.coverLetter && '📝'}</td>
              <td style={{padding:12}}>
                <button onClick={()=>setView(j)} style={{marginRight:8,padding:'4px 8px',background:'#6b7280',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}>View</button>
                <button onClick={()=>del(j.id)} style={{padding:'4px 8px',background:'#ef4444',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {view && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setView(null)}>
          <div style={{background:'#fff',padding:30,borderRadius:8,maxWidth:600,width:'90%'}} onClick={e=>e.stopPropagation()}>
            <h2>{view.company} - {view.position}</h2>
            <p><strong>Date:</strong> {view.date} | <strong>Status:</strong> {view.status}</p>
            {view.notes && <><h3>Notes</h3><p style={{whiteSpace:'pre-wrap'}}>{view.notes}</p></>}
            <h3>Documents</h3>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {view.resume ? <button onClick={()=>download(view.resume,view.resumeName)} style={{padding:'10px 20px',background:'#22c55e',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}>Download Resume ({view.resumeName})</button> : <span style={{color:'#999'}}>No resume</span>}
              {view.coverLetter ? <button onClick={()=>download(view.coverLetter,view.coverLetterName)} style={{padding:'10px 20px',background:'#22c55e',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}>Download Cover Letter ({view.coverLetterName})</button> : <span style={{color:'#999'}}>No cover letter</span>}
            </div>
            <button onClick={()=>setView(null)} style={{marginTop:20,padding:'10px 20px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
