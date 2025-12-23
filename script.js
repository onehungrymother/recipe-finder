// Load datas.json (array-of-arrays) and provide a simple client-side search
let headers = [];
let rows = [];
const WAYBACK_PREFIX = 'https://web.archive.org/web/20250814172404/';

function normalizeText(text) {
  try {
    text = decodeURIComponent(text);
  } catch(e) {}
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function loadData(){
  try{
    const res = await fetch('datas.json');
    if(!res.ok) throw new Error('Failed to load datas.json');
    const data = await res.json();
    headers = data[0] || [];
    rows = data.slice(1 || 1);
    document.getElementById('status').textContent = `Chargé ${rows.length} lignes`;
  }catch(e){
    document.getElementById('status').textContent = 'Erreur lors du chargement de datas.json';
    console.error(e);
  }
}

function renderResults(matches){
  const container = document.getElementById('results');
  container.innerHTML = '';
  if(matches.length === 0){
    container.textContent = 'Aucune correspondance';
    return;
  }

  const list = document.createElement('div');
  list.className = 'list';

  matches.forEach(row => {
    const original = row[0] || '';
    const mimetype = row[1] || '';
    const timestamp = row[2] || '';

    const item = document.createElement('div');
    item.className = 'result';

    const title = document.createElement('div');
    title.className = 'title';
    const a = document.createElement('a');
    a.href = WAYBACK_PREFIX + encodeURI(original);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = original;
    title.appendChild(a);
    item.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${mimetype} • ${timestamp}`;
    item.appendChild(meta);

    const btn = document.createElement('button');
    btn.textContent = 'Ouvrir la snapshot Wayback';
    btn.addEventListener('click', ()=>{
      const url = WAYBACK_PREFIX + encodeURI(original);
      window.open(url, '_blank', 'noopener');
    });
    item.appendChild(btn);

    list.appendChild(item);
  });

  container.appendChild(list);
}

function doSearch(){
  const q = document.getElementById('query').value.trim();
  const onlyOriginal = document.getElementById('matchOriginalOnly').checked;
  if(!q){
    document.getElementById('status').textContent = `Chargé ${rows.length} lignes`;
    document.getElementById('results').textContent = '';
    return;
  }

  const normalizedQ = normalizeText(q);
  const terms = normalizedQ.split(/\s+/).filter(term => term.length > 0);
  if(terms.length === 0){
    document.getElementById('status').textContent = `Chargé ${rows.length} lignes`;
    document.getElementById('results').textContent = '';
    return;
  }

  const matches = rows.filter(row => {
    if(onlyOriginal){
      return terms.every(term => normalizeText(String(row[0]||'')).includes(term));
    }
    return terms.every(term => row.some(cell => normalizeText(String(cell||'')).includes(term)));
  });

  document.getElementById('status').textContent = `Correspondances : ${matches.length}`;
  renderResults(matches.slice(0, 200));
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadData();
  const input = document.getElementById('query');
  input.addEventListener('input', () => doSearch());
  input.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape'){ input.value=''; doSearch(); }});
  document.getElementById('matchOriginalOnly').addEventListener('change', ()=> doSearch());
});
