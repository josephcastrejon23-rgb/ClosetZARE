import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Camera, Heart, Home, Plus, Search, Sparkles, Shirt, Trash2,
  X, ChevronRight, WandSparkles, Palette, Footprints, Gem, ShoppingBag,
  Sun, CloudSun, Snowflake, Leaf, Check, Upload, SlidersHorizontal
} from "lucide-react";
import "./styles.css";

const CLOSET_KEY = "closet-love-items-v1";
const NAME_KEY = "closet-love-name-v1";

const clothingCategories = [
  ["Polos", "👕"], ["Blusas", "👚"], ["Camisas", "👔"], ["Tops", "🩷"],
  ["Vestidos", "👗"], ["Faldas", "🩷"], ["Jeans", "👖"], ["Pantalones", "👖"],
  ["Shorts", "🩳"], ["Suéteres", "🧶"], ["Casacas", "🧥"], ["Abrigos", "🧥"],
  ["Ropa deportiva", "🏃"], ["Ropa de playa", "🏖️"]
];
const shoeCategories = [["Zapatillas","👟"],["Tacones","👠"],["Botas","🥾"],["Sandalias","🩴"],["Mocasines","👞"],["Flats","🥿"]];
const accessoryCategories = [["Carteras","👜"],["Mochilas","🎒"],["Cinturones","〰️"],["Gorras","🧢"],["Sombreros","👒"],["Bufandas","🧣"],["Lentes","🕶️"]];
const jewelryCategories = [["Collares","📿"],["Pulseras","📿"],["Anillos","💍"],["Aretes","✨"],["Relojes","⌚"]];
const makeupCategories = [["Base","🧴"],["Corrector","✨"],["Rubor","🌸"],["Bronzer","🤎"],["Iluminador","💫"],["Sombras","🎨"],["Delineador","🖊️"],["Máscara","👁️"],["Labial","💄"],["Gloss","💋"],["Perfilador","🖌️"]];

const colors = ["Negro","Blanco","Beige","Marrón","Gris","Azul","Celeste","Verde","Rosa","Rojo","Morado","Amarillo","Naranja","Dorado","Plateado","Multicolor"];
const seasons = ["Todo el año","Primavera","Verano","Otoño","Invierno"];
const occasions = ["Casual","Universidad","Trabajo","Formal","Fiesta","Cita","Playa","Deporte"];
const styles = ["Casual","Elegante","Femenino","Minimalista","Streetwear","Romántico","Deportivo","Vintage"];

const pastel = ["#f7dce5","#e9ddf7","#dcecf5","#dff1e5","#fff0d7","#f7e6d7","#e8e8f8"];

function uid(){ return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2); }

function loadItems(){
  try { return JSON.parse(localStorage.getItem(CLOSET_KEY) || "[]"); }
  catch { return []; }
}

function App(){
  const [items,setItems] = useState(loadItems);
  const [name,setName] = useState(localStorage.getItem(NAME_KEY) || "ella");
  const [tab,setTab] = useState("home");
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("Todos");
  const [showAdd,setShowAdd] = useState(false);
  const [showWelcome,setShowWelcome] = useState(!localStorage.getItem(NAME_KEY));
  const [detail,setDetail] = useState(null);

  useEffect(()=>localStorage.setItem(CLOSET_KEY, JSON.stringify(items)),[items]);
  useEffect(()=>{ localStorage.setItem(NAME_KEY,name) },[name]);

  const filtered = useMemo(()=>items.filter(x=>{
    const q = search.toLowerCase();
    return (filter==="Todos" || x.group===filter) &&
      (!q || [x.name,x.category,x.color,x.season,x.occasion,x.style].join(" ").toLowerCase().includes(q));
  }),[items,search,filter]);

  const counts = {
    ropa: items.filter(x=>x.group==="Ropa").length,
    zapatos: items.filter(x=>x.group==="Calzado").length,
    accesorios: items.filter(x=>x.group==="Accesorios").length,
    joyeria: items.filter(x=>x.group==="Joyería").length,
    makeup: items.filter(x=>x.group==="Maquillaje").length
  };

  function addItem(data){
    const item={...data,id:uid(),createdAt:Date.now(),favorite:false};
    setItems(prev=>[item,...prev]);
    setShowAdd(false);
    setTab("closet");
  }
  function remove(id){ setItems(prev=>prev.filter(x=>x.id!==id)); setDetail(null); }
  function toggleFav(id){ setItems(prev=>prev.map(x=>x.id===id?{...x,favorite:!x.favorite}:x)); }
  function clearAll(){
    if(confirm("¿Borrar todo el armario y maquillaje?")) setItems([]);
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Heart size={18} fill="currentColor"/></div>
        <div><b>Closet Love</b><span>tu estilo, a tu manera</span></div>
      </div>
      <button className="icon-btn" onClick={()=>setShowAdd(true)} aria-label="Añadir"><Plus/></button>
    </header>

    <main>
      {tab==="home" && <HomePage name={name} counts={counts} items={items} onAdd={()=>setShowAdd(true)} onTab={setTab} onDetail={setDetail}/>}
      {tab==="closet" && <ClosetPage items={filtered} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onDetail={setDetail} onFav={toggleFav} />}
      {tab==="style" && <StylePage items={items} onDetail={setDetail}/>}
      {tab==="makeup" && <MakeupPage items={items.filter(x=>x.group==="Maquillaje")} onAdd={()=>setShowAdd(true)} onDetail={setDetail}/>}
      {tab==="profile" && <ProfilePage name={name} setName={setName} items={items} clearAll={clearAll}/>}
    </main>

    <nav className="bottom-nav">
      <NavButton active={tab==="home"} icon={<Home/>} label="Inicio" onClick={()=>setTab("home")}/>
      <NavButton active={tab==="closet"} icon={<Shirt/>} label="Armario" onClick={()=>setTab("closet")}/>
      <button className="main-add" onClick={()=>setShowAdd(true)}><Plus/></button>
      <NavButton active={tab==="style"} icon={<Sparkles/>} label="Looks" onClick={()=>setTab("style")}/>
      <NavButton active={tab==="makeup"} icon={<Palette/>} label="Beauty" onClick={()=>setTab("makeup")}/>
    </nav>

    {showAdd && <AddModal onClose={()=>setShowAdd(false)} onSave={addItem}/>}
    {detail && <DetailModal item={detail} onClose={()=>setDetail(null)} onRemove={remove} onFav={toggleFav}/>}
    {showWelcome && <WelcomeModal name={name} setName={setName} onClose={()=>setShowWelcome(false)}/>}
  </div>
}

function NavButton({active,icon,label,onClick}){
  return <button className={"nav-item "+(active?"active":"")} onClick={onClick}>{icon}<span>{label}</span></button>
}

function HomePage({name,counts,items,onAdd,onTab,onDetail}){
  const favorites=items.filter(x=>x.favorite);
  const recent=items.slice(0,4);
  return <section className="page home-page">
    <div className="hero-card">
      <div>
        <span className="eyebrow">MI PEQUEÑO UNIVERSO ♡</span>
        <h1>Hola, {name}.</h1>
        <p>Tu armario, tus colores y tus looks, todo en un solo lugar.</p>
        <button className="primary" onClick={onAdd}><Camera size={18}/> Añadir una prenda</button>
      </div>
      <div className="hero-flower">✿</div>
    </div>

    <div className="section-head"><div><span className="eyebrow">TU COLECCIÓN</span><h2>Todo lo que tienes</h2></div></div>
    <div className="stats-grid">
      <Stat icon="👗" label="Ropa" value={counts.ropa}/><Stat icon="👟" label="Calzado" value={counts.zapatos}/>
      <Stat icon="👜" label="Accesorios" value={counts.accesorios}/><Stat icon="💍" label="Joyería" value={counts.joyeria}/>
      <Stat icon="💄" label="Beauty" value={counts.makeup}/>
    </div>

    <div className="recommend-card">
      <div className="recommend-icon"><WandSparkles/></div>
      <div><span className="eyebrow">IDEA DE HOY</span><h3>¿No sabes qué ponerte?</h3><p>Deja que tu armario te inspire.</p></div>
      <button className="round-btn" onClick={()=>onTab("style")}><ChevronRight/></button>
    </div>

    {favorites.length>0 && <section><div className="section-head"><div><span className="eyebrow">TUS FAVORITOS</span><h2>Lo que más amas</h2></div></div><ItemGrid items={favorites.slice(0,4)} onDetail={onDetail}/></section>}
    {recent.length>0 && <section><div className="section-head"><div><span className="eyebrow">RECIENTE</span><h2>Recién añadido</h2></div></div><ItemGrid items={recent} onDetail={onDetail}/></section>}
    {items.length===0 && <EmptyState onAdd={onAdd}/>}
  </section>
}

function Stat({icon,label,value}){ return <div className="stat-card"><span>{icon}</span><b>{value}</b><small>{label}</small></div> }

function ClosetPage({items,search,setSearch,filter,setFilter,onDetail,onFav}){
  return <section className="page">
    <div className="page-title"><div><span className="eyebrow">MI ARMARIO</span><h1>Mis cosas ♡</h1></div><span className="pill">{items.length} piezas</span></div>
    <div className="search"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Busca color, categoría, estilo..."/></div>
    <div className="chips">{["Todos","Ropa","Calzado","Accesorios","Joyería","Maquillaje"].map(x=><button key={x} className={filter===x?"chip active":"chip"} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    {items.length ? <ItemGrid items={items} onDetail={onDetail} onFav={onFav}/> : <EmptyState/>}
  </section>
}

function MakeupPage({items,onAdd,onDetail}){
  return <section className="page">
    <div className="page-title"><div><span className="eyebrow">BEAUTY</span><h1>Mi maquillaje ✨</h1></div><button className="small-btn" onClick={onAdd}><Plus size={16}/> Añadir</button></div>
    <p className="muted">Guarda tus productos, tonos y favoritos para combinarlos con tus looks.</p>
    <div className="chips">{makeupCategories.slice(0,8).map(([x])=><span className="chip" key={x}>{x}</span>)}</div>
    {items.length ? <ItemGrid items={items} onDetail={onDetail}/> : <EmptyState onAdd={onAdd}/>}
  </section>
}

function StylePage({items,onDetail}){
  const tops=items.filter(x=>["Polos","Blusas","Camisas","Tops","Suéteres"].includes(x.category));
  const bottoms=items.filter(x=>["Jeans","Pantalones","Faldas","Shorts"].includes(x.category));
  const dresses=items.filter(x=>["Vestidos"].includes(x.category));
  const shoes=items.filter(x=>x.group==="Calzado");
  const bags=items.filter(x=>["Carteras","Mochilas"].includes(x.category));
  const beauty=items.filter(x=>x.group==="Maquillaje");
  const pool = (a,b)=>[...a,...b];
  const looks = [
    {title:"Suave & casual", items:pool(tops.slice(0,1),pool(bottoms.slice(0,1),shoes.slice(0,1)))},
    {title:"Femenino", items:pool(dresses.slice(0,1),pool(shoes.slice(0,1),beauty.slice(0,1)))},
    {title:"Tu toque personal", items:pool(tops.slice(1,2),pool(bottoms.slice(1,2),bags.slice(0,1)))}
  ];
  return <section className="page">
    <div className="page-title"><div><span className="eyebrow">ESTILISTA</span><h1>¿Qué me pongo? ✨</h1></div></div>
    <div className="style-intro"><Sparkles/><div><b>Ideas usando lo que ya tienes</b><p>Estas combinaciones son sugerencias rápidas. Cuanto más completo esté tu armario, mejores serán.</p></div></div>
    {items.length===0 ? <EmptyState/> : looks.map((look,i)=><div className="look-card" key={look.title}>
      <div className="look-head"><div><span className="eyebrow">LOOK {i+1}</span><h2>{look.title}</h2></div><span className="look-score">{Math.min(98,78+i*7)}% ✨</span></div>
      <div className="look-items">{look.items.length ? look.items.map(x=><MiniItem key={x.id} item={x} onClick={()=>onDetail(x)}/>) : <p className="muted">Añade más piezas para completar este look.</p>}</div>
    </div>)}
  </section>
}

function MiniItem({item,onClick}){
 return <button className="mini-item" onClick={onClick}>{item.image?<img src={item.image} alt=""/>:<div className="photo-placeholder">{item.emoji||"♡"}</div>}<span>{item.category}</span></button>
}

function ItemGrid({items,onDetail,onFav}){
 return <div className="item-grid">{items.map(x=><button className="item-card" key={x.id} onClick={()=>onDetail(x)}>
   <div className="item-photo">{x.image?<img src={x.image} alt={x.name}/>:<span>{x.emoji||"♡"}</span>}{onFav&&<span className={"fav "+(x.favorite?"liked":"")} onClick={e=>{e.stopPropagation();onFav(x.id)}}><Heart size={16} fill={x.favorite?"currentColor":"none"}/></span>}</div>
   <div className="item-info"><b>{x.name||x.category}</b><span>{x.category} · {x.color}</span></div>
 </button>)}</div>
}

function EmptyState({onAdd}){
 return <div className="empty"><div className="empty-icon">♡</div><h3>Aún está vacío</h3><p>Añade tu primera pieza y empieza a construir tu armario digital.</p>{onAdd&&<button className="primary" onClick={onAdd}><Plus/> Añadir ahora</button>}</div>
}

function AddModal({onClose,onSave}){
 const [group,setGroup]=useState("Ropa");
 const [form,setForm]=useState({category:"Polos",name:"",color:"Blanco",season:"Todo el año",occasion:"Casual",style:"Casual",tone:"",brand:"",notes:"",image:"",emoji:"👕"});
 const cats=group==="Ropa"?clothingCategories:group==="Calzado"?shoeCategories:group==="Accesorios"?accessoryCategories:group==="Joyería"?jewelryCategories:makeupCategories;
 useEffect(()=>setForm(f=>({...f,category:cats[0][0],emoji:cats[0][1]})),[group]);
 function change(k,v){setForm(f=>({...f,[k]:v}))}
 function handleFile(e){const file=e.target.files?.[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>change("image",reader.result); reader.readAsDataURL(file)}
 return <div className="modal-backdrop"><div className="modal">
   <div className="modal-head"><div><span className="eyebrow">NUEVA PIEZA</span><h2>Añadir a mi colección</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
   <div className="group-tabs">{["Ropa","Calzado","Accesorios","Joyería","Maquillaje"].map(x=><button className={group===x?"group-tab active":"group-tab"} key={x} onClick={()=>setGroup(x)}>{x}</button>)}</div>
   <label className="upload-box">{form.image?<img src={form.image} alt="preview"/>:<><Camera/><b>Toma una foto o sube una</b><small>En celular puedes usar la cámara</small></>}<input type="file" accept="image/*" capture="environment" onChange={handleFile}/></label>
   <div className="form-grid">
    <Field label="Nombre"><input value={form.name} onChange={e=>change("name",e.target.value)} placeholder="Ej. Mi polo favorito"/></Field>
    <Field label="Categoría"><select value={form.category} onChange={e=>{const c=cats.find(a=>a[0]===e.target.value);change("category",e.target.value);change("emoji",c?.[1]||"♡")}}>{cats.map(([x])=><option key={x}>{x}</option>)}</select></Field>
    <Field label="Color"><select value={form.color} onChange={e=>change("color",e.target.value)}>{colors.map(x=><option key={x}>{x}</option>)}</select></Field>
    <Field label="Temporada"><select value={form.season} onChange={e=>change("season",e.target.value)}>{seasons.map(x=><option key={x}>{x}</option>)}</select></Field>
    {group!=="Maquillaje" && <Field label="Ocasión"><select value={form.occasion} onChange={e=>change("occasion",e.target.value)}>{occasions.map(x=><option key={x}>{x}</option>)}</select></Field>}
    <Field label={group==="Maquillaje"?"Tonalidad":"Estilo"}><select value={group==="Maquillaje"?form.tone:form.style} onChange={e=>change(group==="Maquillaje"?"tone":"style",e.target.value)}>{(group==="Maquillaje"?["Nude","Rosado","Cálido","Frío","Neutro","Rojo","Berry","Coral","Dorado","Plateado","Multicolor"]:styles).map(x=><option key={x}>{x}</option>)}</select></Field>
    {group==="Maquillaje" && <Field label="Marca"><input value={form.brand} onChange={e=>change("brand",e.target.value)} placeholder="Opcional"/></Field>}
    <Field label="Notas"><input value={form.notes} onChange={e=>change("notes",e.target.value)} placeholder="Ej. combina con..."/></Field>
   </div>
   <button className="primary wide" onClick={()=>onSave({...form,group})}><Check/> Guardar en mi colección</button>
 </div></div>
}

function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}

function DetailModal({item,onClose,onRemove,onFav}){
 return <div className="modal-backdrop"><div className="modal detail-modal">
  <button className="close-floating icon-btn" onClick={onClose}><X/></button>
  <div className="detail-photo">{item.image?<img src={item.image} alt=""/>:<span>{item.emoji||"♡"}</span>}</div>
  <div className="detail-content"><span className="eyebrow">{item.group}</span><h2>{item.name||item.category}</h2><p className="muted">{item.category} · {item.color}</p>
   <div className="detail-tags"><span>🎨 {item.color}</span><span>🌦️ {item.season}</span>{item.style&&<span>✨ {item.style}</span>}{item.occasion&&<span>♡ {item.occasion}</span>}{item.tone&&<span>💄 {item.tone}</span>}</div>
   {item.notes&&<div className="notes">“{item.notes}”</div>}
   <div className="detail-actions"><button className="secondary" onClick={()=>onFav(item.id)}><Heart size={17} fill={item.favorite?"currentColor":"none"}/> {item.favorite?"Favorito":"Me gusta"}</button><button className="danger" onClick={()=>onRemove(item.id)}><Trash2 size={17}/> Eliminar</button></div>
  </div>
 </div></div>
}

function WelcomeModal({name,setName,onClose}){
 const [value,setValue]=useState(name==="ella"?"":name);
 return <div className="modal-backdrop"><div className="modal welcome">
  <div className="welcome-heart">♡</div><span className="eyebrow">BIENVENIDA</span><h2>Tu armario, pero más bonito.</h2><p>Vamos a guardar tus prendas, accesorios y maquillaje para que sea mucho más fácil crear looks.</p>
  <Field label="¿Cómo quieres que te llame?"><input autoFocus value={value} onChange={e=>setValue(e.target.value)} placeholder="Tu nombre"/></Field>
  <button className="primary wide" onClick={()=>{setName(value.trim()||"ella");onClose()}}>Empezar <ChevronRight/></button>
 </div></div>
}

function ProfilePage({name,setName,items,clearAll}){
 const [edit,setEdit]=useState(name);
 return <section className="page"><div className="page-title"><div><span className="eyebrow">MI ESPACIO</span><h1>Perfil ♡</h1></div></div>
 <div className="profile-card"><div className="avatar">{name[0]?.toUpperCase()||"♡"}</div><h2>{name}</h2><p>{items.length} piezas guardadas</p></div>
 <div className="settings-card"><label className="field"><span>Tu nombre</span><input value={edit} onChange={e=>setEdit(e.target.value)} onBlur={()=>setName(edit)}/></label><p className="muted">Tus datos se guardan en este dispositivo. Esta versión no sube tus fotos a ningún servidor.</p><button className="danger wide" onClick={clearAll}><Trash2/> Borrar toda mi colección</button></div>
 </section>
}

createRoot(document.getElementById("root")).render(<App/>);
