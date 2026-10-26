(() => {
  'use strict';

  const DAY = 86400000, HOUR = 3600000, MIN = 60000;

  const fmtDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const fmtDM = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
  const fmtDMY = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtToday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtInt = new Intl.NumberFormat('fr-FR');
  const fmtOne = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

  const CHEVRON = '<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  const BACK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  const CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const FLAG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 21V4M6 4h11l-2 4 2 4H6"/></svg>';
  const PLUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  // ---------- Benefits per type of addiction ----------
  // Steps are [amount, unit, title, text]; units: min, h, d (days), w (weeks), m (months), y (years).

  const TYPES = {
    tabac: {
      label: 'Tabac',
      match: /cigaret|tabac|clope|fum|cigare|nicotin|vape|vapot|chicha|roule/,
      help: ['Tabac Info Service', '39 89'],
      steps: [
        [20, 'min', 'Le cœur se calme', 'La tension artérielle et le pouls redescendent vers leur niveau normal.'],
        [8, 'h', 'Plus d’oxygène', 'Le monoxyde de carbone dans le sang a diminué de moitié : vos cellules sont de nouveau bien oxygénées.'],
        [24, 'h', 'Le corps fait le ménage', 'Le corps ne contient plus de nicotine. Les poumons commencent à évacuer le mucus et les résidus de fumée, et le risque d’infarctus commence déjà à baisser.'],
        [48, 'h', 'Le goût et l’odorat reviennent', 'Les terminaisons nerveuses se réparent : les saveurs et les odeurs sont plus nettes.'],
        [72, 'h', 'On respire mieux', 'Les bronches se relâchent, la respiration est plus facile et l’énergie remonte. Le manque est souvent au plus fort autour de ce cap, puis il recule.'],
        [2, 'w', 'Le souffle revient', 'Entre 2 semaines et 3 mois, la circulation s’améliore : on marche et on monte les escaliers plus facilement.'],
        [3, 'm', 'Moins de toux, moins de fatigue', 'La fonction respiratoire s’est nettement améliorée ; la toux et la fatigue diminuent.'],
        [9, 'm', 'Des poumons qui se nettoient', 'Les cils des bronches ont repoussé : les poumons se défendent mieux contre les infections et l’essoufflement recule.'],
        [1, 'y', 'Risque d’infarctus divisé par deux', 'Le risque d’infarctus est environ deux fois plus faible que lorsque vous fumiez.'],
        [5, 'y', 'Risque d’AVC normalisé', 'Le risque d’accident vasculaire cérébral rejoint celui d’une personne qui n’a jamais fumé.'],
        [10, 'y', 'Cancer du poumon : risque divisé par deux', 'Le risque de mourir d’un cancer du poumon est environ deux fois plus faible que celui d’un fumeur.'],
        [15, 'y', 'Comme un non-fumeur', 'Le risque de maladie cardiaque rejoint celui d’une personne qui n’a jamais fumé.'],
      ],
    },
    alcool: {
      label: 'Alcool',
      match: /alcool|biere|\bvins?\b|whisk|vodka|rhum|boire|apero|pastis|cocktail|picol/,
      help: ['Alcool Info Service', '0 980 980 930'],
      caution: 'Si vous buviez beaucoup tous les jours, un arrêt brutal peut être dangereux : parlez-en à un médecin.',
      steps: [
        [24, 'h', 'L’alcool a quitté le sang', 'Le corps a éliminé l’alcool ; la glycémie et l’hydratation commencent à se rééquilibrer.'],
        [3, 'd', 'Le cap des 72 heures', 'Si des signes de manque apparaissent (sueurs, tremblements, anxiété), ils sont souvent les plus forts pendant les trois premiers jours, puis diminuent.'],
        [1, 'w', 'Un sommeil plus réparateur', 'Le sommeil profond retrouve sa place : on se réveille plus reposé et l’esprit plus clair.'],
        [2, 'w', 'Estomac et peau', 'La paroi de l’estomac se répare, les brûlures et reflux diminuent ; la peau est mieux hydratée.'],
        [1, 'm', 'Le foie récupère', 'Chez les buveurs réguliers, un mois sans alcool suffit souvent à réduire la graisse du foie, la tension artérielle et la glycémie.'],
        [3, 'm', 'Énergie et humeur', 'Humeur plus stable, meilleure concentration et plus d’énergie ; le foie continue de se régénérer.'],
        [6, 'm', 'Cœur et défenses', 'La tension artérielle s’est améliorée et l’organisme se défend mieux contre les infections.'],
        [1, 'y', 'Des risques qui reculent', 'Les risques de maladies du foie, de maladies cardiovasculaires et de plusieurs cancers continuent de baisser avec le temps.'],
      ],
    },
    cannabis: {
      label: 'Cannabis',
      match: /cannabis|weed|joint|beuh|shit|herbe|petard|fumette|bedo|thc|marijuana|hasch|\bhash/,
      help: ['Drogues Info Service', '0 800 23 13 13'],
      steps: [
        [24, 'h', 'Le corps se réajuste', 'Irritabilité, sommeil agité ou perte d’appétit peuvent apparaître : ce sont des signes de sevrage, et ils sont temporaires.'],
        [3, 'd', 'Le pic du manque', 'Les symptômes de sevrage sont souvent les plus forts entre le 2e et le 6e jour, puis ils diminuent.'],
        [2, 'w', 'Le sevrage s’éloigne', 'La plupart des symptômes ont disparu. Le sommeil se normalise, même si les rêves peuvent rester très intenses un moment.'],
        [1, 'm', 'Le cerveau se recalibre', 'Les récepteurs cannabinoïdes du cerveau retrouvent un niveau normal ; mémoire et concentration s’améliorent.'],
        [3, 'm', 'Souffle et motivation', 'Si vous le fumiez, la toux et la respiration s’améliorent ; la motivation et la clarté d’esprit sont plus stables.'],
        [1, 'y', 'Un nouvel équilibre', 'Les envies sont rares et plus faciles à gérer ; les progrès sur la mémoire et l’humeur se consolident.'],
      ],
    },
    sucre: {
      label: 'Sucre',
      match: /sucre|soda|coca(?!i)|bonbon|chocolat|gateau|dessert|patisserie|confiserie|nutella|biscuit/,
      steps: [
        [24, 'h', 'Moins de pics de glycémie', 'La glycémie fluctue moins : moins de coups de fatigue après les repas.'],
        [3, 'd', 'Les envies culminent', 'Les fringales de sucre sont souvent fortes les premiers jours ; elles diminuent ensuite.'],
        [1, 'w', 'Une énergie plus stable', 'Les envies baissent et l’énergie est plus régulière au fil de la journée.'],
        [2, 'w', 'Le goût se recalibre', 'Les papilles s’habituent : les fruits et les aliments peu sucrés paraissent plus sucrés qu’avant.'],
        [1, 'm', 'Le corps s’adapte', 'L’appétit est mieux régulé et le corps utilise mieux l’insuline ; la peau est souvent plus nette.'],
        [3, 'm', 'Des effets visibles', 'Moins de caries, et souvent un poids et un tour de taille en baisse.'],
        [1, 'y', 'Des risques qui reculent', 'Le risque de diabète de type 2 et de maladies cardiovasculaires diminue.'],
      ],
    },
    jeux: {
      label: 'Jeux d’argent',
      match: /pari|casino|poker|loto|gratt|argent|betting|turf|bookmaker|machine a sous|blackjack|roulette/,
      help: ['Joueurs Info Service', '09 74 75 13 13'],
      steps: [
        [24, 'h', 'Une journée sans miser', 'Chaque euro non misé reste à vous. Notez ce que vous auriez joué : la somme grimpe vite.'],
        [1, 'w', 'Repérer les déclencheurs', 'Les envies arrivent souvent avec l’ennui, le stress ou les matchs : les repérer aide à les éviter.'],
        [1, 'm', 'Des finances plus claires', 'Un mois sans mises : un bon moment pour faire le point sur le budget, les dettes et l’épargne.'],
        [3, 'm', 'La récompense se rééquilibre', 'Le circuit de la récompense se réajuste : les envies deviennent moins fréquentes et moins fortes.'],
        [6, 'm', 'La confiance revient', 'Les relations avec les proches et la gestion de l’argent se reconstruisent.'],
        [1, 'y', 'Une année libre', 'Une année entière de choix différents : les envies sont devenues rares.'],
      ],
    },
    ecrans: {
      label: 'Réseaux sociaux',
      match: /reseau|instagram|\binsta|tiktok|facebook|snap|twitter|ecran|telephone|portable|scroll|youtube|netflix|serie|jeux? video|gaming/,
      steps: [
        [24, 'h', 'Le réflexe de vérifier', 'L’envie de saisir le téléphone revient souvent. C’est un automatisme : il s’affaiblit chaque fois que vous n’y cédez pas.'],
        [3, 'd', 'Du temps retrouvé', 'Vous remarquez le temps libéré. L’ennui revient, et avec lui l’attention à ce qui vous entoure.'],
        [1, 'w', 'Un meilleur sommeil', 'Moins d’écrans le soir : l’endormissement est plus rapide et le sommeil plus réparateur.'],
        [2, 'w', 'La concentration revient', 'L’attention tient plus longtemps sur une même tâche : lire, travailler, discuter.'],
        [3, 'w', 'Une humeur plus stable', 'Une étude de l’université de Pennsylvanie a observé qu’après 3 semaines d’usage réduit, la solitude et les symptômes dépressifs diminuaient.'],
        [66, 'd', 'Une habitude installée', 'Il faut en moyenne 66 jours pour qu’un nouveau comportement devienne automatique (étude de l’University College London).'],
      ],
    },
    cafeine: {
      label: 'Caféine',
      match: /cafe|energy|red ?bull|monster|expresso|espresso/,
      steps: [
        [12, 'h', 'Début du sevrage', 'Maux de tête et fatigue peuvent apparaître entre 12 et 24 heures après la dernière tasse.'],
        [2, 'd', 'Le pic', 'Les symptômes sont souvent les plus forts entre 20 et 51 heures. Buvez de l’eau, ça passe.'],
        [9, 'd', 'Sevrage terminé', 'Pour la plupart des gens, les symptômes disparaissent en 2 à 9 jours.'],
        [2, 'w', 'Un sommeil plus profond', 'L’endormissement est plus facile et le sommeil profond plus long.'],
        [1, 'm', 'Une énergie naturelle', 'Plus de pics ni de coups de barre : votre tolérance à la caféine est remise à zéro.'],
      ],
    },
    autre: {
      label: 'Autre',
      match: null,
      steps: [
        [24, 'h', 'Le premier jour', 'Souvent le plus difficile. Il est derrière vous.'],
        [3, 'd', 'Le pic des envies', 'Pour beaucoup de dépendances, le manque est le plus fort pendant les 72 premières heures, puis il recule.'],
        [1, 'w', 'Une semaine', 'Les envies sont moins fréquentes et vous connaissez mieux ce qui les déclenche.'],
        [1, 'm', 'Un mois', 'Un nouveau rythme s’installe dans vos journées.'],
        [66, 'd', 'Une habitude installée', 'Il faut en moyenne 66 jours pour qu’un nouveau comportement devienne automatique (étude de l’University College London).'],
        [6, 'm', 'Six mois', 'Les envies sont devenues rares et plus faciles à gérer.'],
        [1, 'y', 'Une année', 'Une année entière : un vrai changement de vie.'],
      ],
    },
  };
  const TYPE_ORDER = ['tabac', 'alcool', 'cannabis', 'sucre', 'ecrans', 'cafeine', 'jeux', 'autre'];
  const MATCH_ORDER = ['jeux', 'cannabis', 'tabac', 'alcool', 'sucre', 'ecrans', 'cafeine'];

  const normalize = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const guessType = name => {
    const n = normalize(name);
    return MATCH_ORDER.find(k => TYPES[k].match.test(n)) || 'autre';
  };
  const typeKey = item => (TYPES[item.type] ? item.type : guessType(item.name));

  // ---------- Date arithmetic (calendar-aware, local time) ----------

  const pad = n => String(n).padStart(2, '0');
  const plural = (n, one, many) => `${fmtInt.format(n)} ${n < 2 ? one : many}`;
  const isoDay = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const addDays = (d, n) => { const r = new Date(d.getTime()); r.setDate(r.getDate() + n); return r; };
  const addMonths = (d, n) => {
    const r = new Date(d.getTime()), day = r.getDate();
    r.setDate(1);
    r.setMonth(r.getMonth() + n);
    r.setDate(Math.min(day, new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()));
    return r;
  };
  const addDur = (d, n, u) =>
    u === 'min' ? new Date(d.getTime() + n * MIN)
    : u === 'h' ? new Date(d.getTime() + n * HOUR)
    : u === 'd' ? addDays(d, n)
    : u === 'w' ? addDays(d, 7 * n)
    : u === 'm' ? addMonths(d, n)
    : addMonths(d, 12 * n);
  const durLabel = (n, u) =>
    u === 'min' ? `${n} min`
    : u === 'h' ? `${n} h`
    : u === 'd' ? plural(n, 'jour', 'jours')
    : u === 'w' ? plural(n, 'semaine', 'semaines')
    : u === 'm' ? `${n} mois`
    : plural(n, 'an', 'ans');

  function wholeDays(start, end) {
    if (end <= start) return 0;
    let n = Math.floor((end - start) / DAY);
    while (n > 0 && addDays(start, n) > end) n--;
    while (addDays(start, n + 1) <= end) n++;
    return n;
  }

  function wholeMonths(start, now) {
    if (now <= start) return 0;
    let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
    while (months > 0 && addMonths(start, months) > now) months--;
    return months;
  }

  function until(now, target) {
    const ms = target - now;
    if (ms >= 2 * DAY) return 'dans ' + plural(wholeDays(now, target), 'jour', 'jours');
    if (ms >= HOUR) return 'dans ' + plural(Math.floor(ms / HOUR), 'heure', 'heures');
    return 'dans ' + plural(Math.max(1, Math.ceil(ms / MIN)), 'minute', 'minutes');
  }

  const durationLabel = ms =>
    ms >= DAY ? plural(Math.floor(ms / DAY), 'jour', 'jours')
    : ms >= HOUR ? plural(Math.floor(ms / HOUR), 'heure', 'heures')
    : plural(Math.floor(ms / MIN), 'minute', 'minutes');

  const shortDate = (d, now) => (d.getFullYear() === now.getFullYear() ? fmtDM : fmtDMY).format(d);

  function stepsFor(item, start) {
    const benefits = TYPES[typeKey(item)].steps.map(([n, u, title, text]) => ({ n, u, title, text, goal: false }));
    const goals = (Array.isArray(item.goals) ? item.goals : [])
      .filter(g => g && g.n > 0 && g.u)
      .map(g => ({ n: g.n, u: g.u, title: g.text, text: '', goal: true, id: g.id }));
    return benefits.concat(goals)
      .map(s => ({ ...s, date: addDur(start, s.n, s.u) }))
      .sort((a, b) => a.date - b.date || a.goal - b.goal);
  }

  function compute(item, now) {
    const start = new Date(item.since);
    const elapsed = Math.max(0, now - start);
    const days = wholeDays(start, now);

    // Big number in days (or hours, or minutes during the first day), then the remainder down to the second.
    let num, unit, restMs;
    if (days >= 1) { num = days; unit = days < 2 ? 'jour' : 'jours'; restMs = Math.max(0, now - addDays(start, days)); }
    else if (elapsed >= HOUR) { num = Math.floor(elapsed / HOUR); unit = num < 2 ? 'heure' : 'heures'; restMs = elapsed - num * HOUR; }
    else { num = Math.floor(elapsed / MIN); unit = num < 2 ? 'minute' : 'minutes'; restMs = elapsed - num * MIN; }
    const rs = Math.floor(restMs / 1000);
    const rh = Math.floor(rs / 3600), rm = Math.floor((rs % 3600) / 60), rsec = rs % 60;
    const rest = days >= 1 ? `${rh} h ${pad(rm)} min ${pad(rsec)} s`
      : elapsed >= HOUR ? `${rm} min ${pad(rsec)} s`
      : `${rsec} s`;

    const months = wholeMonths(start, now);
    const monthDays = wholeDays(addMonths(start, months), now);
    const parts = [];
    if (months >= 12) parts.push(plural(Math.floor(months / 12), 'an', 'ans'));
    if (months % 12) parts.push(`${months % 12} mois`);
    if (parts.length && monthDays) parts.push(plural(monthDays, 'jour', 'jours'));

    const steps = stepsFor(item, start);
    const nextIdx = steps.findIndex(s => s.date > now);
    const doneCount = nextIdx === -1 ? steps.length : nextIdx;
    let pct = 1, nextWhen = '';
    if (nextIdx !== -1) {
      const from = nextIdx > 0 ? steps[nextIdx - 1].date : start;
      const to = steps[nextIdx].date;
      pct = Math.min(1, Math.max(0, (now - from) / (to - from || 1)));
      nextWhen = until(now, to);
    }

    return {
      start, elapsed, steps, nextIdx, doneCount, pct,
      next: nextIdx === -1 ? null : steps[nextIdx],
      sig: `${nextIdx}/${steps.length}`,
      text: {
        num: fmtInt.format(num),
        unit,
        rest,
        parts: parts.length ? 'soit ' + parts.join(' et ') : '',
        weeks: fmtOne.format(elapsed / (7 * DAY)),
        hours: fmtInt.format(Math.floor(elapsed / HOUR)),
        minutes: fmtInt.format(Math.floor(elapsed / MIN)),
        nextWhen,
      },
    };
  }

  // ---------- State and storage (Supabase) ----------

  const cfg = window.LIBRE_DEPUIS_CONFIG || {};
  const configured = Boolean(cfg.supabaseUrl && cfg.supabaseKey);
  const sb = configured && window.supabase && window.supabase.createClient
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'libre-depuis-auth' },
      })
    : null;

  // phase: loading → setup (no config) | unavailable (library failed to load) | auth (signed out) | app
  const state = {
    phase: 'loading', user: null, authMode: 'signin',
    items: [], loaded: false, syncing: false,
    view: 'list', currentId: null, confirm: null, goalConfirm: null, sheet: null,
  };
  const EXAMPLE = { id: '__example', name: 'Cigarette', type: 'tabac', since: new Date(Date.now() - (47 * DAY + 5 * HOUR + 12 * MIN)).toISOString() };

  const readJSON = key => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (_) { return null; } };
  const writeJSON = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const removeKey = key => { try { localStorage.removeItem(key); } catch (_) {} };
  const cacheKey = () => 'libre-depuis:cache:' + (state.user ? state.user.id : '');
  const strip = ({ id, ...rest }) => rest;
  const newId = () => { try { return crypto.randomUUID(); } catch (_) { return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); } };

  const findItem = id => (id === EXAMPLE.id ? EXAMPLE : state.items.find(i => i.id === id));
  const sortedItems = () => [...state.items].sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));

  const fromRow = r => ({
    id: r.id,
    name: r.name,
    type: r.type,
    since: r.since,
    goals: Array.isArray(r.goals) ? r.goals : [],
    bestMs: Number(r.best_ms) || 0,
    resets: Number(r.resets) || 0,
    createdAt: r.created_at,
  });
  const toRow = d => ({
    name: d.name,
    type: d.type,
    since: d.since,
    goals: Array.isArray(d.goals) ? d.goals : [],
    best_ms: Math.round(Number(d.bestMs) || 0),
    resets: Number(d.resets) || 0,
  });

  function errorText(err, loading) {
    if (!navigator.onLine) return 'Pas de connexion internet. Réessayez une fois connecté.';
    if (err && (err.status === 401 || err.code === 'PGRST301' || /jwt/i.test(err.message || ''))) return 'Votre session a expiré. Reconnectez-vous.';
    return loading ? 'Impossible de charger vos compteurs. Réessayez dans un instant.' : 'L’enregistrement a échoué. Réessayez dans un instant.';
  }

  function afterWrite() {
    writeJSON(cacheKey(), state.items);
    render();
  }

  async function createItem(d) {
    const { data, error } = await sb.from('addictions').insert({ ...toRow(d), user_id: state.user.id }).select().single();
    if (error) throw error;
    state.items.push(fromRow(data));
    afterWrite();
  }

  async function saveItem(id, d) {
    const { data, error } = await sb.from('addictions').update(toRow(d)).eq('id', id).select().single();
    if (error) throw error;
    const i = state.items.findIndex(x => x.id === id);
    if (i >= 0) state.items[i] = fromRow(data);
    afterWrite();
  }

  async function deleteItem(id) {
    const { error } = await sb.from('addictions').delete().eq('id', id);
    if (error) throw error;
    state.items = state.items.filter(x => x.id !== id);
    afterWrite();
  }

  // Pulls the latest counters, so changes made on another device show up when the app comes back to the front.
  let lastRefresh = 0;
  async function refresh(force) {
    if (!sb || !state.user) return;
    if (!force && Date.now() - lastRefresh < 5000) return;
    lastRefresh = Date.now();
    const uid = state.user.id;
    state.syncing = true;
    const { data, error } = await sb.from('addictions').select('*').order('created_at', { ascending: true });
    state.syncing = false;
    if (!state.user || state.user.id !== uid) return;
    if (error) {
      render();
      toast(errorText(error, true));
      return;
    }
    state.items = data.map(fromRow);
    state.loaded = true;
    afterWrite();
  }

  function setUser(user) {
    state.user = user;
    state.view = 'list';
    state.currentId = null;
    state.confirm = null;
    state.goalConfirm = null;
    state.loaded = false;
    if (user) {
      const cached = readJSON(cacheKey());
      state.items = Array.isArray(cached) ? cached : [];
      state.phase = 'app';
      render();
      refresh(true);
    } else {
      state.items = [];
      state.phase = 'auth';
      sheet.hidden = true;
      goalSheet.hidden = true;
      render();
    }
  }

  async function init() {
    if (!configured) { state.phase = 'setup'; render(); return; }
    if (!sb) { state.phase = 'unavailable'; render(); return; }
    let session = null;
    try { ({ data: { session } } = await sb.auth.getSession()); } catch (_) {}
    setUser(session ? session.user : null);
    sb.auth.onAuthStateChange((_event, next) => {
      const user = next ? next.user : null;
      // Defer: the auth callback must not wait on other Supabase calls.
      if ((user ? user.id : null) !== (state.user ? state.user.id : null)) setTimeout(() => setUser(user), 0);
    });
  }

  async function signOut() {
    const key = cacheKey();
    try { await sb.auth.signOut(); } catch (_) {}
    removeKey(key);
    setUser(null);
  }

  function authErrorText(err) {
    if (!navigator.onLine) return 'Pas de connexion internet. Réessayez une fois connecté.';
    const code = (err && err.code) || '';
    const msg = ((err && err.message) || '').toLowerCase();
    if (code === 'invalid_credentials' || msg.includes('invalid login')) return 'E-mail ou mot de passe incorrect.';
    if (code === 'user_already_exists' || msg.includes('already registered')) return 'Un compte existe déjà avec cet e-mail. Connectez-vous.';
    if (code === 'email_not_confirmed' || msg.includes('not confirmed')) return 'Cette adresse n’a pas encore été confirmée.';
    if (code === 'weak_password' || msg.includes('password should')) return 'Mot de passe trop faible : au moins 6 caractères.';
    if (code === 'over_request_rate_limit' || err.status === 429) return 'Trop de tentatives. Patientez quelques minutes.';
    if (code === 'signup_disabled') return 'Les inscriptions sont fermées pour le moment.';
    if (code === 'email_address_invalid' || msg.includes('invalid format')) return 'Cette adresse e-mail n’est pas acceptée.';
    return 'La connexion a échoué. Réessayez dans un instant.';
  }

  // ---------- Rendering ----------

  const view = document.getElementById('view');
  const fab = document.getElementById('fab');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const barHTML = (v, goal) =>
    `<span class="bar${goal ? ' bar--goal' : ''}" aria-hidden="true"><span class="bar-fill" data-bar style="width:${(v.pct * 100).toFixed(2)}%"></span></span>`;

  function nextHTML(v) {
    if (!v.next) {
      return '<span class="next"><span class="next-row"><span>Toutes les étapes sont franchies</span></span></span>';
    }
    return `<span class="next">
        <span class="next-row">
          <span>${v.next.goal ? 'Objectif' : 'Prochaine étape'} : <b>${esc(v.next.title)}</b></span>
          <span class="next-when" data-k="nextWhen">${v.text.nextWhen}</span>
        </span>
        ${barHTML(v, v.next.goal)}
      </span>`;
  }

  function cardHTML(item, now, example) {
    const v = compute(item, now), t = v.text;
    const tag = example ? 'div' : 'button';
    const attrs = example
      ? 'class="counter counter--example" aria-label="Exemple de compteur"'
      : `type="button" class="counter" data-action="open" data-id="${esc(item.id)}"`;
    return `<${tag} ${attrs} data-live="${esc(item.id)}" data-sig="${v.sig}">
        <span class="counter-head"><span class="counter-name">${esc(item.name)}</span>${example ? '<span class="tag">Exemple</span>' : CHEVRON}</span>
        <span class="counter-big">
          <span class="num" data-k="num">${t.num}</span><span class="unit" data-k="unit">${t.unit}</span>
          <span class="rest" data-k="rest">${t.rest}</span>
        </span>
        <span class="counter-since">depuis le ${fmtDate.format(v.start)} à ${fmtTime.format(v.start)}</span>
        ${nextHTML(v)}
      </${tag}>`;
  }

  function brandHeader(now, chip) {
    return `<header class="top">
        <div>
          <p class="today">${fmtToday.format(now)}</p>
          <h1 class="brand">Libre depuis</h1>
        </div>
        ${chip || ''}
      </header>`;
  }

  function listHTML(now) {
    const items = sortedItems();
    const sync = !navigator.onLine ? ['sync sync--local', 'Hors ligne']
      : !state.loaded ? ['sync', 'Synchronisation…']
      : ['sync sync--cloud', 'Synchronisé'];
    let body;
    if (items.length) {
      body = `<ul class="list">${items.map(i => `<li>${cardHTML(i, now, false)}</li>`).join('')}</ul>`;
    } else if (!state.loaded) {
      body = '<p class="note">Chargement de vos compteurs…</p>';
    } else {
      body = `<section class="empty">
          <div>
            <h2>Vos compteurs apparaîtront ici</h2>
            <p>Touchez « Ajouter », donnez un nom à l’addiction et la date à laquelle vous avez arrêté. Le compteur avance tout seul, à la seconde près, et vous montre les bienfaits qui arrivent.</p>
          </div>
          ${cardHTML(EXAMPLE, now, true)}
        </section>`;
    }
    const email = state.user && state.user.email ? esc(state.user.email) : 'votre compte';
    return `${brandHeader(now, `<span class="${sync[0]}">${sync[1]}</span>`)}
      ${body}
      <p class="note">Connecté avec <b>${email}</b>. Vos compteurs sont privés et synchronisés sur tous vos appareils. <button type="button" class="link-btn" data-action="signout">Se déconnecter</button></p>`;
  }

  function authHTML(now) {
    return `${brandHeader(now)}
      <section class="auth" aria-label="Connexion">
        <p class="auth-lead">Comptez le temps depuis l’arrêt d’une addiction et suivez les bienfaits qui arrivent, étape par étape. Vos compteurs sont privés et vous suivent sur tous vos appareils.</p>
        <div class="seg" role="group" aria-label="Connexion ou création de compte">
          <button type="button" data-action="auth-mode" data-mode="signin">Se connecter</button>
          <button type="button" data-action="auth-mode" data-mode="signup">Créer un compte</button>
        </div>
        <form id="auth-form" class="auth-form" novalidate>
          <div class="field">
            <label for="a-email">E-mail</label>
            <input id="a-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false">
          </div>
          <div class="field">
            <label for="a-pass">Mot de passe</label>
            <input id="a-pass" name="password" type="password" autocomplete="current-password">
            <button type="button" class="link-btn" data-action="toggle-pass">Afficher le mot de passe</button>
          </div>
          <p class="hint" id="a-hint" hidden>Au moins 6 caractères. Gardez-le bien : il sert à retrouver vos compteurs sur un autre appareil.</p>
          <p class="form-error" id="a-error" role="alert" hidden></p>
          <p class="form-info" id="a-info" role="status" hidden></p>
          <button type="submit" class="btn btn--primary btn--block" id="a-submit">Se connecter</button>
        </form>
      </section>
      <section class="preview" aria-label="Aperçu">
        <h2 class="section-title">Aperçu</h2>
        ${cardHTML(EXAMPLE, now, true)}
      </section>`;
  }

  function messageHTML(now) {
    const text = {
      loading: ['', 'Chargement…'],
      setup: ['L’appli n’est pas encore reliée à sa base de données', 'Renseignez l’adresse et la clé publique Supabase dans le fichier config.js (voir le README).'],
      unavailable: ['Impossible de démarrer l’appli', 'Vérifiez votre connexion internet, puis rouvrez l’appli.'],
    }[state.phase];
    return `${brandHeader(now)}
      ${text[0] ? `<section class="empty"><div><h2>${text[0]}</h2><p>${text[1]}</p></div></section>` : `<p class="note">${text[1]}</p>`}`;
  }

  // Updates the sign-in form in place, so switching modes keeps what was typed.
  function syncAuthMode() {
    const signup = state.authMode === 'signup';
    view.querySelectorAll('[data-action="auth-mode"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.authMode)));
    const pass = view.querySelector('#a-pass');
    if (!pass) return;
    pass.autocomplete = signup ? 'new-password' : 'current-password';
    view.querySelector('#a-hint').hidden = !signup;
    view.querySelector('#a-submit').textContent = signup ? 'Créer mon compte' : 'Se connecter';
    view.querySelector('#a-error').hidden = true;
    view.querySelector('#a-info').hidden = true;
  }

  function actionsHTML(item, v) {
    if (state.confirm === 'delete') {
      return `<div class="confirm" role="group" aria-label="Confirmer la suppression">
          <p>Supprimer « ${esc(item.name)} » ? Le compteur et ses objectifs seront effacés définitivement.</p>
          <div class="actions">
            <button type="button" class="btn btn--danger-solid" data-action="delete-yes">Supprimer</button>
            <button type="button" class="btn" data-action="confirm-no">Annuler</button>
          </div>
        </div>`;
    }
    if (state.confirm === 'reset') {
      return `<div class="confirm" role="group" aria-label="Confirmer le nouveau départ">
          <p>Repartir de zéro ? Le compteur repartira de maintenant. Votre période actuelle (${durationLabel(v.elapsed)}) sera gardée comme record si c’est la plus longue.</p>
          <div class="actions">
            <button type="button" class="btn btn--primary" data-action="reset-yes">Repartir maintenant</button>
            <button type="button" class="btn" data-action="confirm-no">Annuler</button>
          </div>
        </div>`;
    }
    return `<div class="actions">
        <button type="button" class="btn" data-action="edit">Modifier</button>
        <button type="button" class="btn" data-action="reset">Repartir de zéro</button>
        <button type="button" class="btn btn--danger" data-action="delete">Supprimer</button>
      </div>`;
  }

  function stepHTML(s, i, v, now) {
    const st = v.nextIdx === -1 || i < v.nextIdx ? 'done' : i === v.nextIdx ? 'next' : 'todo';
    const withTime = s.u === 'min' || s.u === 'h';
    let when;
    if (st === 'done') when = `atteint le ${shortDate(s.date, now)}${withTime ? ' à ' + fmtTime.format(s.date) : ''}`;
    else if (st === 'next') when = `<span data-k="nextWhen">${v.text.nextWhen}</span>`;
    else when = `le ${shortDate(s.date, now)}${withTime ? ' à ' + fmtTime.format(s.date) : ''}`;
    const dot = st === 'done' ? (s.goal ? FLAG : CHECK) : s.goal ? FLAG : '';
    let goalCtl = '';
    if (s.goal) {
      goalCtl = state.goalConfirm === s.id
        ? `<span class="goal-confirm"><button type="button" class="link-btn link-btn--danger" data-action="goal-remove-yes" data-goal="${esc(s.id)}">Retirer cet objectif</button><button type="button" class="link-btn" data-action="goal-remove-no">Garder</button></span>`
        : `<button type="button" class="link-btn" data-action="goal-remove" data-goal="${esc(s.id)}">Retirer</button>`;
    }
    return `<li class="tl-item tl--${st}${s.goal ? ' tl--goal' : ''}">
        <span class="tl-dot" aria-hidden="true">${dot}</span>
        <div class="tl-body">
          <p class="tl-when"><b>${s.goal ? 'Objectif · ' : ''}${durLabel(s.n, s.u)}</b> · ${when}</p>
          <h3 class="tl-title">${esc(s.title)}</h3>
          ${s.text ? `<p class="tl-text">${esc(s.text)}</p>` : ''}
          ${st === 'next' ? barHTML(v, s.goal) : ''}
          ${goalCtl}
        </div>
      </li>`;
  }

  function timelineHTML(item, v, now) {
    const type = TYPES[typeKey(item)];
    const nowMarker = `<li class="tl-now"><span class="tl-dot" aria-hidden="true"></span><p><b>Aujourd’hui</b> · <span data-k="num">${v.text.num}</span> <span data-k="unit">${v.text.unit}</span></p></li>`;
    const rows = [];
    v.steps.forEach((s, i) => {
      if (i === v.doneCount) rows.push(nowMarker);
      rows.push(stepHTML(s, i, v, now));
    });
    if (v.doneCount === v.steps.length) rows.push(nowMarker);
    const help = type.help
      ? `<p class="help">Besoin d’en parler ? ${type.help[0]} : <span class="phone">${type.help[1]}</span></p>`
      : '';
    return `<section aria-labelledby="tl-title">
        <div class="tl-head">
          <h2 class="section-title" id="tl-title">Votre évolution · ${type.label}</h2>
          <span class="tl-count">${v.doneCount} sur ${v.steps.length} franchies</span>
        </div>
        <ol class="tl">${rows.join('')}</ol>
        <div class="tl-foot">
          <button type="button" class="btn btn--goal" data-action="goal-add">${PLUS} Ajouter un objectif personnel</button>
          <p class="source">Repères généraux tirés de sources de santé publique et d’études scientifiques. Chacun avance à son rythme ; ces informations ne remplacent pas l’avis d’un médecin.</p>
          ${help}
        </div>
      </section>`;
  }

  function detailHTML(item, now) {
    const v = compute(item, now), t = v.text;
    const type = TYPES[typeKey(item)];

    const next = !v.next
      ? '<section class="next-card"><p class="next-title">Toutes les étapes sont franchies.</p></section>'
      : `<section class="next-card${v.next.goal ? ' next-card--goal' : ''}">
          <h2 class="section-title">${v.next.goal ? 'Votre prochain objectif' : 'Prochaine étape'} · <span data-k="nextWhen">${t.nextWhen}</span></h2>
          <p class="next-title">${esc(v.next.title)}</p>
          ${v.next.text ? `<p class="next-text">${esc(v.next.text)}</p>` : ''}
          <p class="next-meta">Au bout de ${durLabel(v.next.n, v.next.u)}, le ${fmtDate.format(v.next.date)} à ${fmtTime.format(v.next.date)}</p>
          ${barHTML(v, v.next.goal)}
        </section>`;

    const best = Number(item.bestMs) || 0;
    const record = !best ? ''
      : best > v.elapsed
        ? `<p class="record">Votre plus longue période : <b>${durationLabel(best)}</b>.</p>`
        : '<p class="record">Vous êtes en train de battre votre record.</p>';

    return `<button type="button" class="back" data-action="back">${BACK} Mes compteurs</button>
      <div class="detail" data-live="${esc(item.id)}" data-sig="${v.sig}">
        <header>
          <p class="eyebrow"><b>${type.label}</b> · arrêté le ${fmtDate.format(v.start)} à ${fmtTime.format(v.start)}</p>
          <h1 class="detail-name">${esc(item.name)}</h1>
          ${type.caution ? `<p class="caution">${type.caution}</p>` : ''}
        </header>
        <section class="hero" aria-label="Temps écoulé">
          <p class="hero-big"><span class="num" data-k="num">${t.num}</span><span class="unit" data-k="unit">${t.unit}</span></p>
          <p class="hero-rest">et <span data-k="rest">${t.rest}</span></p>
          ${t.parts ? `<p class="hero-parts" data-k="parts">${t.parts}</p>` : ''}
        </section>
        <dl class="totals">
          <div><dt>semaines</dt><dd data-k="weeks">${t.weeks}</dd></div>
          <div><dt>heures</dt><dd data-k="hours">${t.hours}</dd></div>
          <div><dt>minutes</dt><dd data-k="minutes">${t.minutes}</dd></div>
        </dl>
        ${next}
        ${timelineHTML(item, v, now)}
        ${record}
        ${actionsHTML(item, v)}
      </div>`;
  }

  function render() {
    const now = new Date();
    if (state.phase !== 'app') {
      view.innerHTML = state.phase === 'auth' ? authHTML(now) : messageHTML(now);
      fab.hidden = true;
      if (state.phase === 'auth') syncAuthMode();
      return;
    }
    let item = null;
    if (state.view === 'detail') {
      item = findItem(state.currentId);
      if (!item) { state.view = 'list'; state.confirm = null; state.goalConfirm = null; }
    }
    view.innerHTML = state.view === 'detail' ? detailHTML(item, now) : listHTML(now);
    fab.hidden = state.view !== 'list';
  }

  function tick() {
    const now = new Date();
    let stale = false;
    view.querySelectorAll('[data-live]').forEach(el => {
      const item = findItem(el.dataset.live);
      if (!item) return;
      const v = compute(item, now);
      if (el.dataset.sig !== v.sig) { stale = true; return; }
      el.querySelectorAll('[data-k]').forEach(n => {
        const val = v.text[n.dataset.k];
        if (val != null && n.textContent !== val) n.textContent = val;
      });
      el.querySelectorAll('[data-bar]').forEach(b => { b.style.width = (v.pct * 100).toFixed(2) + '%'; });
    });
    // Outside the app (sign-in screen), a full render would wipe what is being typed.
    if (stale && state.phase === 'app') render();
  }

  // ---------- Toast ----------

  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3200);
  }

  // ---------- Sheets ----------

  let lastFocus = null;
  function openScrim(el, focusEl) {
    lastFocus = document.activeElement;
    el.hidden = false;
    setTimeout(() => focusEl.focus(), 60);
  }
  function closeScrim(el) {
    el.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  // Add / edit an addiction
  const sheet = document.getElementById('sheet');
  const form = document.getElementById('sheet-form');
  const sheetTitle = document.getElementById('sheet-title');
  const fName = document.getElementById('f-name');
  const fTypes = document.getElementById('f-types');
  const fDate = document.getElementById('f-date');
  const fTime = document.getElementById('f-time');
  const fError = document.getElementById('f-error');
  const fSubmit = document.getElementById('f-submit');
  let typeTouched = false;

  fTypes.innerHTML = TYPE_ORDER.map(k =>
    `<label class="chip"><input type="radio" name="type" id="f-type-${k}" value="${k}"><span>${TYPES[k].label}</span></label>`
  ).join('');
  const setType = k => { const r = document.getElementById('f-type-' + k); if (r) r.checked = true; };
  const getType = () => (fTypes.querySelector('input:checked') || {}).value || 'autre';
  fTypes.addEventListener('change', () => { typeTouched = true; });

  // One-tap names for the most common addictions
  const SUGGESTIONS = [
    ['Réseaux sociaux', 'ecrans'], ['Sucre', 'sucre'], ['Cigarette', 'tabac'], ['Alcool', 'alcool'],
    ['Cannabis', 'cannabis'], ['Café', 'cafeine'], ['Jeux d’argent', 'jeux'],
  ];
  const fSuggest = document.getElementById('f-suggest');
  fSuggest.innerHTML = SUGGESTIONS.map(([name, type]) =>
    `<button type="button" class="suggest-btn" data-action="suggest" data-name="${esc(name)}" data-type="${type}">${esc(name)}</button>`
  ).join('');
  fName.addEventListener('input', () => { if (!typeTouched) setType(guessType(fName.value)); });

  function openSheet(item) {
    const now = new Date();
    state.sheet = item ? item.id : 'new';
    sheetTitle.textContent = item ? 'Modifier le compteur' : 'Nouvelle addiction';
    fDate.max = isoDay(now);
    if (item) {
      const s = new Date(item.since);
      fName.value = item.name;
      fDate.value = isoDay(s);
      fTime.value = `${pad(s.getHours())}:${pad(s.getMinutes())}`;
      setType(typeKey(item));
      typeTouched = true;
      fSuggest.hidden = true;
    } else {
      fSuggest.hidden = false;
      fName.value = '';
      fDate.value = isoDay(now);
      fTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setType('autre');
      typeTouched = false;
    }
    fError.hidden = true;
    openScrim(sheet, fName);
  }

  function closeSheet() {
    state.sheet = null;
    closeScrim(sheet);
  }

  function showError(el, msg, field) {
    el.textContent = msg;
    el.hidden = false;
    if (field) field.focus();
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = fName.value.trim();
    const [y, mo, d] = (fDate.value || '').split('-').map(Number);
    const [hh, mm] = (fTime.value || '00:00').split(':').map(Number);
    if (!name) return showError(fError, 'Donnez un nom à cette addiction.', fName);
    if (!y || !mo || !d) return showError(fError, 'Choisissez la date à laquelle vous avez arrêté.', fDate);
    const since = new Date(y, mo - 1, d, hh || 0, mm || 0, 0, 0);
    if (since.getTime() > Date.now() + MIN) {
      return showError(fError, 'Ce moment est dans le futur. Choisissez maintenant ou un moment passé.', fTime.value ? fTime : fDate);
    }

    const editing = state.sheet !== 'new' ? state.sheet : null;
    const type = getType();
    fSubmit.disabled = true;
    try {
      if (editing) {
        const cur = findItem(editing);
        await saveItem(editing, { ...strip(cur || {}), name, type, since: since.toISOString() });
      } else {
        await createItem({ name, type, since: since.toISOString(), createdAt: new Date().toISOString(), goals: [] });
      }
      closeSheet();
      toast(editing ? 'Modifications enregistrées' : 'Compteur ajouté');
    } catch (err) {
      showError(fError, errorText(err));
    } finally {
      fSubmit.disabled = false;
    }
  });

  // Add a personal goal
  const goalSheet = document.getElementById('goal-sheet');
  const goalForm = document.getElementById('goal-form');
  const gSub = document.getElementById('goal-sub');
  const gN = document.getElementById('g-n');
  const gU = document.getElementById('g-u');
  const gText = document.getElementById('g-text');
  const gError = document.getElementById('g-error');
  const gSubmit = document.getElementById('g-submit');

  function openGoalSheet() {
    const item = findItem(state.currentId);
    if (!item) return;
    const s = new Date(item.since);
    gSub.textContent = `Compté depuis votre arrêt, le ${fmtDate.format(s)} à ${fmtTime.format(s)}.`;
    gN.value = '30';
    gU.value = 'd';
    gText.value = '';
    gError.hidden = true;
    openScrim(goalSheet, gText);
  }

  goalForm.addEventListener('submit', async e => {
    e.preventDefault();
    const item = findItem(state.currentId);
    if (!item) return closeScrim(goalSheet);
    const n = Math.round(Number(gN.value));
    const u = gU.value;
    const text = gText.value.trim();
    if (!(n >= 1 && n <= 999)) return showError(gError, 'Indiquez une durée entre 1 et 999.', gN);
    if (!text) return showError(gError, 'Décrivez votre objectif en quelques mots.', gText);
    const goals = (Array.isArray(item.goals) ? item.goals : []).concat({ id: newId(), n, u, text });
    gSubmit.disabled = true;
    try {
      await saveItem(item.id, { ...strip(item), goals });
      closeScrim(goalSheet);
      toast('Objectif ajouté');
    } catch (err) {
      showError(gError, errorText(err));
    } finally {
      gSubmit.disabled = false;
    }
  });

  [sheet, goalSheet].forEach(el => el.addEventListener('click', e => { if (e.target === el) closeScrim(el); }));

  // ---------- Actions ----------

  async function removeCurrent() {
    try {
      await deleteItem(state.currentId);
      state.view = 'list';
      state.confirm = null;
      render();
      toast('Compteur supprimé');
    } catch (err) { toast(errorText(err)); }
  }

  async function resetCurrent() {
    const item = findItem(state.currentId);
    if (!item) return;
    const now = new Date();
    const elapsed = Math.max(0, now - new Date(item.since));
    const data = {
      ...strip(item),
      since: now.toISOString(),
      bestMs: Math.max(Number(item.bestMs) || 0, elapsed),
      resets: (Number(item.resets) || 0) + 1,
    };
    try {
      await saveItem(item.id, data);
      state.confirm = null;
      render();
      toast('Nouveau départ enregistré');
    } catch (err) { toast(errorText(err)); }
  }

  async function removeGoal(goalId) {
    const item = findItem(state.currentId);
    if (!item) return;
    const goals = (Array.isArray(item.goals) ? item.goals : []).filter(g => g.id !== goalId);
    try {
      await saveItem(item.id, { ...strip(item), goals });
      state.goalConfirm = null;
      render();
      toast('Objectif retiré');
    } catch (err) { toast(errorText(err)); }
  }

  function focusIn(selector) {
    const el = view.querySelector(selector);
    if (el) el.focus({ preventScroll: true });
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const a = el.dataset.action;
    if (a === 'open') {
      state.view = 'detail';
      state.currentId = el.dataset.id;
      state.confirm = null;
      state.goalConfirm = null;
      render();
      window.scrollTo(0, 0);
      focusIn('.back');
    } else if (a === 'back') {
      const id = state.currentId;
      state.view = 'list';
      state.confirm = null;
      state.goalConfirm = null;
      render();
      if (window.CSS && CSS.escape) focusIn(`[data-id="${CSS.escape(id)}"]`);
    } else if (a === 'add') {
      openSheet(null);
    } else if (a === 'edit') {
      openSheet(findItem(state.currentId));
    } else if (a === 'delete' || a === 'reset') {
      state.confirm = a;
      render();
      focusIn('.confirm .btn');
    } else if (a === 'confirm-no') {
      state.confirm = null;
      render();
    } else if (a === 'delete-yes') {
      removeCurrent();
    } else if (a === 'reset-yes') {
      resetCurrent();
    } else if (a === 'sheet-cancel') {
      closeSheet();
    } else if (a === 'suggest') {
      fName.value = el.dataset.name;
      setType(el.dataset.type);
      typeTouched = true;
      fError.hidden = true;
    } else if (a === 'goal-add') {
      openGoalSheet();
    } else if (a === 'goal-cancel') {
      closeScrim(goalSheet);
    } else if (a === 'goal-remove') {
      state.goalConfirm = el.dataset.goal;
      render();
      focusIn('.goal-confirm .link-btn');
    } else if (a === 'goal-remove-no') {
      state.goalConfirm = null;
      render();
    } else if (a === 'goal-remove-yes') {
      removeGoal(el.dataset.goal);
    } else if (a === 'auth-mode') {
      state.authMode = el.dataset.mode;
      syncAuthMode();
    } else if (a === 'toggle-pass') {
      const pass = view.querySelector('#a-pass');
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      el.textContent = show ? 'Masquer le mot de passe' : 'Afficher le mot de passe';
    } else if (a === 'signout') {
      signOut();
    }
  });

  // ---------- Sign-in ----------

  document.addEventListener('submit', async e => {
    if (e.target.id !== 'auth-form') return;
    e.preventDefault();
    const emailEl = view.querySelector('#a-email');
    const passEl = view.querySelector('#a-pass');
    const err = view.querySelector('#a-error');
    const info = view.querySelector('#a-info');
    const btn = view.querySelector('#a-submit');
    const email = emailEl.value.trim();
    const password = passEl.value;
    info.hidden = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError(err, 'Entrez une adresse e-mail valide.', emailEl);
    if (password.length < 6) return showError(err, 'Le mot de passe doit faire au moins 6 caractères.', passEl);
    err.hidden = true;
    btn.disabled = true;
    try {
      if (state.authMode === 'signup') {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          info.textContent = 'Compte créé. Confirmez votre adresse depuis l’e-mail reçu, puis connectez-vous.';
          info.hidden = false;
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (ex) {
      showError(err, authErrorText(ex));
    } finally {
      if (document.contains(btn)) btn.disabled = false;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!sheet.hidden) closeSheet();
    else if (!goalSheet.hidden) closeScrim(goalSheet);
    else if (state.confirm || state.goalConfirm) { state.confirm = null; state.goalConfirm = null; render(); }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    tick();
    refresh();
  });
  window.addEventListener('online', () => { if (state.phase === 'app') { render(); refresh(true); } });
  window.addEventListener('offline', () => { if (state.phase === 'app') render(); });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }

  render();
  setInterval(tick, 1000);
  init();
})();
