"use client";

import { useEffect, useMemo, useState } from "react";

const GUESTS = [
  ["Marina Prado Lopes", "vou", "mulher", "36", 1, "(41) 99812-4477", "02 set"],
  ["Rafael Teixeira", "vou", "homem", "—", 0, "(41) 99640-1120", "02 set"],
  ["Cláudia Nogueira Serra", "vou", "mulher", "38", 1, "(41) 99377-8802", "01 set"],
  ["Helena Moretti", "vou", "mulher", "35", 0, "(41) 99215-6631", "01 set"],
  ["Vinícius Camargo", "nao", "homem", "—", 0, "(41) 99188-2043", "31 ago"],
  ["Sônia Almeida Rocha", "vou", "mulher", "37", 1, "(41) 99904-3315", "30 ago"],
  ["Paulo Almeida Rocha", "vou", "homem", "—", 0, "(41) 99904-3316", "30 ago"],
  ["Juliana Barreto Pinho", "vou", "mulher", "36", 1, "(41) 99566-7789", "29 ago"],
  ["Letícia Vasques", "vou", "mulher", "34", 0, "(41) 99733-2298", "28 ago"],
  ["Eduardo Sampaio", "nao", "homem", "—", 0, "(41) 99012-7741", "27 ago"],
  ["Fernanda Cordeiro", "vou", "mulher", "38", 1, "(41) 99671-0084", "26 ago"],
  ["Otávio Bandeira", "vou", "homem", "—", 1, "(41) 99458-6612", "26 ago"],
  ["Renata Salles Mafra", "vou", "mulher", "37", 0, "(41) 99277-4408", "24 ago"],
];

const inviteUrl = "formaturabeatriz.com.br/convite";

function Header({ view, setView }) {
  return <header className="topbar">
    <button className="brand" onClick={() => setView("guest")}><i />Formatura 2026</button>
    <nav aria-label="Navegação principal">
      <button className={view === "guest" ? "active" : ""} onClick={() => setView("guest")}>Convidado</button>
      <button className={view === "host" ? "active" : ""} onClick={() => setView("host")}>Painel do formando</button>
    </nav>
  </header>;
}

function Field({ label, hint, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} />{hint && <small>{hint}</small>}</label>;
}

function GuestView({ onRespond }) {
  const [form, setForm] = useState({ nome: "", fone: "", sexo: null, sandalia: null, acomp: 0, acompanhanteNome: "", acompanhanteSexo: null, acompanhanteSandalia: null });
  const [answer, setAnswer] = useState(null);
  const [saving, setSaving] = useState(false), [saveError, setSaveError] = useState("");
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const companionReady = form.acomp === 0 || (form.acompanhanteNome.trim().length > 1 && form.acompanhanteSexo && (form.acompanhanteSexo === "homem" || form.acompanhanteSandalia));
  const ready = form.nome.trim().length > 1 && form.sexo && (form.sexo === "homem" || form.sandalia) && companionReady;
  const submitAnswer = async (status) => {
    if (!ready) return;
    setSaving(true); setSaveError("");
    try { await onRespond({ ...form, nome: form.nome.trim(), fone: form.fone.trim(), status }); setAnswer(status); }
    catch (error) { setSaveError(error.message || "Não foi possível salvar. Tente novamente."); }
    finally { setSaving(false); }
  };
  const hint = !form.nome.trim() ? "Escreva seu nome para liberar as respostas." : !form.sexo ? "Escolha uma das duas opções acima." : form.sexo === "mulher" && !form.sandalia ? "Falta escolher o número da sua sandália." : form.acomp === 1 && !form.acompanhanteNome.trim() ? "Informe o nome do acompanhante." : form.acomp === 1 && !form.acompanhanteSexo ? "Informe se o acompanhante é homem ou mulher." : form.acompanhanteSexo === "mulher" && !form.acompanhanteSandalia ? "Falta escolher o número da sandália da acompanhante." : "Você poderá corrigir sua resposta até 1 de outubro.";

  if (answer) return <main className="narrow confirmation">
    <div className="accent-line" />
    <h1>{answer === "vou" ? "Presença confirmada." : "Resposta registrada."}</h1>
    <p>{answer === "vou" ? "Obrigado por confirmar. Sua presença está reservada para a celebração no Santa Cecília Maison, em Campina Grande." : "Agradeço por avisar. Sentirei sua falta na cerimônia, e ficará o convite para celebrarmos em outra ocasião."}</p>
    <dl className="summary">
      <div><dt>Nome</dt><dd>{form.nome}</dd></div>
      <div><dt>Resposta</dt><dd>{answer === "vou" ? "Vou à formatura" : "Não poderei ir"}</dd></div>
      <div><dt>Acompanhante</dt><dd>{answer === "vou" && form.acomp ? `${form.acompanhanteNome} (${form.acompanhanteSexo})` : answer === "vou" ? "Sozinho(a)" : "—"}</dd></div>
      <div><dt>Lembrança</dt><dd>{answer === "vou" ? [form.sexo === "mulher" ? `Sua sandália nº ${form.sandalia}` : null, form.acompanhanteSexo === "mulher" ? `Acompanhante nº ${form.acompanhanteSandalia}` : null].filter(Boolean).join(" · ") || "—" : "—"}</dd></div>
    </dl>
    <button className="button secondary" onClick={() => setAnswer(null)}>Corrigir minha resposta</button>
  </main>;

  return <main className="narrow invite">
    <section className="hero">
      <p className="eyebrow red">Convite de formatura</p>
      <img className="invite-logo" src="/guilherme-henrique-logo.png" alt="Guilherme Henrique — Direito" />
      <p className="course">Bacharelado em Direito — Turma 2026.2</p>
      <div className="event-grid">
        <div><span>Data</span><strong>12 de dezembro</strong><p>12/12/2026</p></div>
        <div><span>Local</span><strong>Santa Cecília Maison</strong><p>Campina Grande</p></div>
      </div>
    </section>
    <section className="message"><p>Você foi muito importante para que eu conseguisse chegar até aqui, e realizar o meu sonho, por isso, quero que se faça presente para celebrarmos juntos essa conquista!</p><p>Peço a gentileza de confirmar até 1 de outubro — cada convidada recebe um par de sandálias como lembrança, por isso o número é necessário.</p></section>
    <section className="form-section">
      <p className="eyebrow">Confirmação de presença</p>
      <div className="fields">
        <Field label="Nome completo" value={form.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Como deseja constar na lista" />
        <Field label="WhatsApp" type="tel" value={form.fone} onChange={(e) => update("fone", e.target.value)} placeholder="(41) 90000-0000" hint="Usado apenas para avisos sobre a cerimônia." />
      </div>
      <div className="choice-block"><label>Você é</label><div className="segmented">
        <button className={form.sexo === "mulher" ? "selected" : ""} onClick={() => update("sexo", "mulher")}>Sou mulher</button>
        <button className={form.sexo === "homem" ? "selected" : ""} onClick={() => setForm({ ...form, sexo: "homem", sandalia: null })}>Sou homem</button>
      </div></div>
      {form.sexo === "mulher" && <div className="shoe-block"><label>Número da sandália</label><small>A lembrança de cada convidada é um par de sandálias.</small><div className="chips">{[33,34,35,36,37,38,39,40].map((size) => <button key={size} className={form.sandalia === size ? "selected" : ""} onClick={() => update("sandalia", size)}>{size}</button>)}</div></div>}
      <div className="choice-block"><label>Acompanhante</label><small>Cada convite permite um acompanhante.</small><div className="chips wide">
        <button className={form.acomp === 0 ? "selected" : ""} onClick={() => setForm({...form, acomp:0, acompanhanteNome:"", acompanhanteSexo:null, acompanhanteSandalia:null})}>Vou sozinho(a)</button>
        <button className={form.acomp === 1 ? "selected" : ""} onClick={() => update("acomp", 1)}>Levarei um acompanhante</button>
      </div></div>
      {form.acomp === 1 && <div className="companion-block"><p className="eyebrow red">Dados do acompanhante</p><Field label="Nome completo do acompanhante" value={form.acompanhanteNome} onChange={(e)=>update("acompanhanteNome",e.target.value)} placeholder="Nome para a lista"/><div className="choice-block"><label>O acompanhante é</label><div className="segmented"><button className={form.acompanhanteSexo === "mulher" ? "selected" : ""} onClick={()=>update("acompanhanteSexo","mulher")}>Mulher</button><button className={form.acompanhanteSexo === "homem" ? "selected" : ""} onClick={()=>setForm({...form,acompanhanteSexo:"homem",acompanhanteSandalia:null})}>Homem</button></div></div>{form.acompanhanteSexo === "mulher" && <div className="shoe-block"><label>Número da sandália da acompanhante</label><small>Escolha o tamanho da lembrança dela.</small><div className="chips">{[33,34,35,36,37,38,39,40].map((size)=><button key={size} className={form.acompanhanteSandalia === size ? "selected" : ""} onClick={()=>update("acompanhanteSandalia",size)}>{size}</button>)}</div></div>}</div>}
      <div className="actions">
        <button disabled={!ready || saving} className="button primary" onClick={() => submitAnswer("vou")}>{saving ? "Salvando…" : "Confirmo minha presença"} <b>→</b></button>
        <button disabled={!ready || saving} className="button secondary" onClick={() => submitAnswer("nao")}>Infelizmente não poderei ir</button>
        <small className={saveError ? "error" : ""}>{saveError || hint}</small>
      </div>
    </section>
  </main>;
}

function Login({ unlock, back }) {
  const [password, setPassword] = useState(""); const [error, setError] = useState(false);
  const submit = () => password.trim().toLowerCase() === "formatura2026" ? unlock() : setError(true);
  return <main className="narrow login"><div className="accent-line"/><p className="eyebrow">Área restrita</p><h1>Painel do formando</h1><p>Os dados dos convidados são visíveis apenas para a formanda. Informe a senha de acesso para continuar.</p>
    <Field label="Senha de acesso" type="password" value={password} onChange={(e) => {setPassword(e.target.value); setError(false)}} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" />
    <small className={error ? "error" : "muted"}>{error ? "Senha incorreta. Tente novamente." : "Protótipo: a senha é formatura2026."}</small>
    <div className="actions"><button className="button primary" onClick={submit}>Entrar no painel <b>→</b></button><button className="button secondary" onClick={back}>Voltar ao convite</button></div>
  </main>;
}

function Stat({ label, value, note, accent, children }) { return <div className="stat"><span>{label}</span><strong className={accent ? "red" : ""}>{value}</strong>{children}{note && <small>{note}</small>}</div> }

function Dashboard({ logout, responses }) {
  const [total, setTotal] = useState(18), [filter, setFilter] = useState("Todos"), [search, setSearch] = useState(""), [showLink, setShowLink] = useState(false), [copied, setCopied] = useState(false), [exported, setExported] = useState(false);
  const [editingTotal, setEditingTotal] = useState(false), [totalDraft, setTotalDraft] = useState("18"), [totalError, setTotalError] = useState("");
  const defaultWhatsAppMessage = `Você foi muito importante para que eu chegasse até aqui! Quero celebrar essa conquista com você. Confirme sua presença na minha formatura: ${inviteUrl}`;
  const [whatsAppMessage, setWhatsAppMessage] = useState(defaultWhatsAppMessage), [messageDraft, setMessageDraft] = useState(defaultWhatsAppMessage), [editingMessage, setEditingMessage] = useState(false), [messageError, setMessageError] = useState("");
  const allGuests = useMemo(() => [...GUESTS, ...responses.map((response) => [response.nome, response.status, response.sexo, response.status === "vou" && response.sexo === "mulher" ? String(response.sandalia) : "—", response.status === "vou" ? response.acomp : 0, response.fone || "—", "Agora", response.status === "vou" && response.acompanhanteSexo === "mulher" ? String(response.acompanhanteSandalia) : "—", response.acompanhanteNome, response.acompanhanteSexo])], [responses]);
  const effectiveTotal = Math.max(total, allGuests.length);
  const attending = allGuests.filter((g) => g[1] === "vou"), companions = attending.reduce((n,g) => n + g[4], 0), declined = allGuests.filter(g => g[1] === "nao").length, pending = Math.max(0,effectiveTotal-allGuests.length);
  const women = attending.filter(g => g[2] === "mulher").length, men = attending.length-women;
  const sizes = attending.reduce((out,g) => { [g[3],g[7]].forEach((size)=>{if(size && size !== "—") out[size]=(out[size]||0)+1}); return out; },{}); const max = Math.max(...Object.values(sizes));
  const shoeCount = Object.values(sizes).reduce((sum, count) => sum + count, 0);
  const rows = useMemo(() => {
    const base = allGuests.map(g => ({name:g[0], status:g[1], shoe:[g[3] !== "—" ? g[3] : null,g[7] && g[7] !== "—" ? `Acomp. ${g[7]}` : null].filter(Boolean).join(" · ") || "—", companion:g[1] === "vou" && g[4] ? g[8] ? `${g[8]} (${g[9]})` : `+${g[4]}` : "—", phone:g[5], date:g[6]}));
    const empty = Array.from({length:pending},()=>({name:"Convite em aberto",status:"pendente",shoe:"—",companion:"—",phone:"—",date:"—"}));
    return [...base,...empty].filter(r => filter === "Todos" || r.status === ({"Vou":"vou","Não vou":"nao","Aguardando":"pendente"})[filter]).filter(r => !search || (r.status !== "pendente" && `${r.name} ${r.phone}`.toLowerCase().includes(search.toLowerCase())));
  },[filter,search,pending,allGuests]);
  const pct = Math.round(allGuests.length/effectiveTotal*100);
  const doCopy = async () => { try { await navigator.clipboard.writeText(inviteUrl); } catch {} setCopied(true); setTimeout(()=>setCopied(false),1800) };
  const doExport = () => { const csv = ["Convidado,Resposta,Acompanhante,Sandália,WhatsApp,Respondeu",...rows.filter(r=>r.status!=="pendente").map(r=>[r.name,r.status,r.companion,r.shoe,r.phone,r.date].join(","))].join("\n"); const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="convidados.csv"; a.click(); setExported(true); setTimeout(()=>setExported(false),1800); };
  const openTotalEditor = () => { setTotalDraft(String(effectiveTotal)); setTotalError(""); setEditingTotal(true); };
  const saveTotal = async () => { const next = Number(totalDraft); if (!Number.isInteger(next) || next < allGuests.length || next > 400) { setTotalError(`Informe um número inteiro entre ${allGuests.length} e 400.`); return; } try { const request = await fetch("/api/settings", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({totalConvites:next}) }); if (!request.ok) throw new Error(); setTotal(next); setEditingTotal(false); } catch { setTotalError("Não foi possível salvar. Verifique a conexão com o banco."); } };
  const openMessageEditor = () => { setMessageDraft(whatsAppMessage); setMessageError(""); setEditingMessage(true); };
  const saveMessage = async () => { const next = messageDraft.trim(); if (!next) { setMessageError("Digite uma mensagem antes de salvar."); return; } try { const request = await fetch("/api/settings", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({mensagemWhatsApp:next}) }); if (!request.ok) throw new Error(); setWhatsAppMessage(next); setEditingMessage(false); } catch { setMessageError("Não foi possível salvar. Verifique a conexão com o banco."); } };
  useEffect(() => { const close = (event) => { if (event.key === "Escape") { setEditingTotal(false); setEditingMessage(false); } }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  useEffect(() => { let active=true; fetch("/api/settings").then((response)=>response.json()).then((data)=>{if(!active)return;if(Number.isInteger(data.totalConvites))setTotal(data.totalConvites);if(data.mensagemWhatsApp)setWhatsAppMessage(data.mensagemWhatsApp)}).catch(()=>{});return()=>{active=false}},[]);
  return <main className="dashboard"><section className="dash-head"><div><p className="eyebrow red">Painel do formando</p><h1>Quem já respondeu</h1></div><div className="dash-tools"><div className="counter-wrap"><span>Convites a enviar</span><button className="edit-total" onClick={openTotalEditor}><b>{effectiveTotal}</b><span>Editar número de convidados</span></button></div><p>{allGuests.length} de {effectiveTotal} convites respondidos · prazo 1 out</p><button className="small primary" onClick={()=>setShowLink(!showLink)}>Link do convite</button><button className="small outline" onClick={doExport}>{exported ? "Lista exportada ✓":"Exportar lista"}</button><button className="small outline muted" onClick={logout}>Sair</button></div></section>
    {showLink && <section className="link-panel"><p className="eyebrow">Link do convite</p><p>Envie este endereço aos convidados. Cada pessoa que abrir o link preenche uma das {effectiveTotal} vagas da lista.</p><div><code>{inviteUrl}</code><button className="small primary" onClick={doCopy}>{copied ? "Link copiado ✓":"Copiar link"}</button><button className="small outline" onClick={openMessageEditor}>Editar mensagem</button><a className="small outline whatsapp-button" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(whatsAppMessage)}`}>Enviar pelo WhatsApp</a></div></section>}
    <section className="stats"><Stat label="Presenças confirmadas" value={attending.length+companions} note={`${attending.length} convites + ${companions} acompanhantes`} accent/><Stat label="Não vão" value={declined}/><Stat label="Convites em aberto" value={pending} note={`${pct}% da lista preenchida`}><div className="progress"><i style={{width:`${pct}%`}}/></div></Stat><Stat label="Sandálias a encomendar" value={shoeCount}/></section>
    <section className="charts"><div><p className="eyebrow">Tamanhos pedidos</p>{Object.entries(sizes).sort().map(([size,n])=><div className="bar" key={size}><b>{size}</b><i><em style={{width:`${n/max*100}%`}}/></i><strong>{n}</strong></div>)}</div><div><p className="eyebrow">Composição dos confirmados</p><div className="composition"><p><b>Mulheres</b><b>{women}</b></p><i><em className="redbar" style={{width:`${women/attending.length*100}%`}}/></i><p><b>Homens</b><b>{men}</b></p><i><em style={{width:`${men/attending.length*100}%`}}/></i></div><p className="chart-note">Taxa de resposta de {pct}%. Quem ainda não respondeu recebe um lembrete três dias antes do prazo.</p></div></section>
    <section className="guest-list"><div className="list-head"><p className="eyebrow">Lista de convidados</p><div><div className="search"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar nome ou telefone"/>{search&&<button onClick={()=>setSearch("")}>Limpar</button>}</div><div className="filters">{["Todos","Vou","Não vou","Aguardando"].map(x=><button className={filter===x?"selected":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div></div>
      <div className="table-wrap"><table><thead><tr><th>Convidado</th><th>Resposta</th><th>Acomp.</th><th>Sandália</th><th>WhatsApp</th><th>Respondeu</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td>{r.name}</td><td><span className={`tag ${r.status}`}>{r.status==="vou"?"Vou":r.status==="nao"?"Não vou":"Aguardando"}</span></td><td>{r.companion}</td><td>{r.shoe}</td><td>{r.phone}</td><td>{r.date}</td></tr>)}</tbody></table>{!rows.length&&<p className="empty">Nenhum convidado encontrado para esta busca.</p>}</div>
    </section>
    {editingTotal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditingTotal(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="total-title"><button className="modal-close" aria-label="Fechar" onClick={()=>setEditingTotal(false)}>×</button><p className="eyebrow red">Lista de convidados</p><h2 id="total-title">Editar número de convidados</h2><p>Defina quantas pessoas receberão o convite. As respostas já registradas serão preservadas.</p><label className="field"><span>Número de convidados</span><input autoFocus type="number" inputMode="numeric" min={allGuests.length} max="400" value={totalDraft} onChange={(event)=>{setTotalDraft(event.target.value);setTotalError("")}} onKeyDown={(event)=>event.key === "Enter" && saveTotal()} /></label><small className={totalError ? "error modal-message" : "muted modal-message"}>{totalError || `Mínimo de ${allGuests.length}, pois já existem respostas registradas.`}</small><div className="modal-actions"><button className="button secondary" onClick={()=>setEditingTotal(false)}>Cancelar</button><button className="button primary" onClick={saveTotal}>Salvar alteração <b>→</b></button></div></section></div>}
    {editingMessage && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditingMessage(false)}><section className="modal message-modal" role="dialog" aria-modal="true" aria-labelledby="message-title"><button className="modal-close" aria-label="Fechar" onClick={()=>setEditingMessage(false)}>×</button><p className="eyebrow whatsapp-green">WhatsApp</p><h2 id="message-title">Editar mensagem</h2><p>Personalize o texto que acompanhará o link quando o convite for compartilhado.</p><label className="field"><span>Mensagem de envio</span><textarea autoFocus maxLength="1000" value={messageDraft} onChange={(event)=>{setMessageDraft(event.target.value);setMessageError("")}} /></label><div className="message-meta"><small className={messageError ? "error" : "muted"}>{messageError || "O link do convite pode ser incluído em qualquer parte do texto."}</small><small>{messageDraft.length}/1000</small></div><div className="modal-actions"><button className="button secondary" onClick={()=>setEditingMessage(false)}>Cancelar</button><button className="button primary whatsapp-save" onClick={saveMessage}>Salvar mensagem <b>→</b></button></div></section></div>}
  </main>;
}

export default function Home() {
  const [view,setView]=useState("guest"), [unlocked,setUnlocked]=useState(false);
  const [responses, setResponses] = useState([]);
  useEffect(() => { let active=true;fetch("/api/responses").then((response)=>response.ok?response.json():[]).then((data)=>{if(active&&Array.isArray(data))setResponses(data)}).catch(()=>{});return()=>{active=false}},[]);
  const registerResponse = async (response) => {
    const request = await fetch("/api/responses", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(response) });
    const saved = await request.json();
    if (!request.ok) throw new Error(saved.error || "Não foi possível salvar sua resposta.");
    setResponses((current) => {
      const identity = saved.identity || `${saved.nome}|${saved.fone}`.toLocaleLowerCase("pt-BR");
      const found = current.findIndex((item) => (item.identity || `${item.nome}|${item.fone}`.toLocaleLowerCase("pt-BR")) === identity);
      if (found === -1) return [saved, ...current];
      return current.map((item, index) => index === found ? saved : item);
    });
  };
  return <><Header view={view} setView={setView}/>{view === "guest" ? <GuestView onRespond={registerResponse}/> : unlocked ? <Dashboard responses={responses} logout={()=>{setUnlocked(false);setView("guest")}}/> : <Login unlock={()=>setUnlocked(true)} back={()=>setView("guest")}/>}</>;
}
