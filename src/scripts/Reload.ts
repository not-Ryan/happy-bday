const last = Date.now();
const interval = 1000;

async function update() {
  const file = await fetch(`/updated.txt`, { cache: 'no-cache' }).then(v => v.text());
  const updated = Number(file);
  const reload = last < updated;
  await new Promise(res => setTimeout(res, 500))
  if (reload) location.reload(true);
  else setTimeout(update, interval);
}


update();