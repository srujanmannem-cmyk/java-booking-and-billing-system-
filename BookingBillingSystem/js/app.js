/* ============================================================
   Aurélia — application controller
   Router · views · drawers · modals · billing interactions
   ============================================================ */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ── Icons ─────────────────────────────────────────────── */
  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2.2"/><path d="M3 9.5h18M8 3v3.5M16 3v3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M16.4 5.4a3 3 0 0 1 0 5.6M17.6 14.8c2.2.5 3.6 2.2 3.6 4.6"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9.5 8h5M9.5 12h5"/>',
    wallet: '<rect x="2.8" y="6" width="18.4" height="13" rx="2.4"/><path d="M2.8 10h18.4"/><circle cx="17" cy="14.4" r="1.2"/>',
    chart: '<path d="M4 20V11M10 20V4.5M16 20v-6.5M22 20H2"/>',
    book: '<path d="M4 4.5A1.8 1.8 0 0 1 5.8 3H19v18H5.8A1.8 1.8 0 0 1 4 19.2V4.5Z"/><path d="M4 17h15"/><path d="M8 7.5h7"/>',
    sliders: '<path d="M4 8h6M14 8h6M4 16h10M18 16h2"/><circle cx="12" cy="8" r="2"/><circle cx="16" cy="16" r="2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    print: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="7.5" rx="2"/><path d="M7 14h10v6.5H7z"/>',
    bed: '<path d="M3 18v-9M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-8v3"/><circle cx="7" cy="10.5" r="1.8"/>',
    crown: '<path d="m3 7 4 4 5-6 5 6 4-4-2 11H5L3 7Z"/><path d="M5.5 18h13"/>',
    sparkle: '<path d="M12 3.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5C9.7 9.3 11.3 7.7 12 3.5Z"/><path d="M18 16.5c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8"/>',
    board: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21l2-4M16 21l-2-4M7.5 8.5h6M7.5 12h9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>',
    leaf: '<path d="M20 4C10 4 4 8.5 4 15.5c0 2.5 1.5 4.5 4 4.5 7 0 12-6 12-16Z"/><path d="M4.5 20C7 14.5 11 11 16 9"/>',
    cup: '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M16 9.5h2.2a2.3 2.3 0 0 1 0 4.6H16"/><path d="M6 4.5h8"/>',
    car: '<path d="M3 15.5V12l2-5h14l2 5v3.5"/><path d="M3 15.5h18"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M20 6.5 9.2 17.3 4 12.1"/>',
    up: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',
    down: '<path d="M12 5v14M5.5 12.5 12 19l6.5-6.5"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    edit: '<path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="m4 7 8 6 8-6"/>',
    phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.4"/><path d="M2.5 9.5h19"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2.2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    bank: '<path d="m3 9.5 9-5.5 9 5.5"/><path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20.5h18"/>',
    download: '<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5"/><path d="M4 18.5h16"/>',
    filter: '<path d="M3 5.5h18l-7 8V20l-4-2.5v-4L3 5.5Z"/>',
    right: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
    left: '<path d="m15 5.5-6.5 6.5L15 18.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>',
    alert: '<path d="M12 3.5 22 20H2L12 3.5Z"/><path d="M12 9.5v4.5M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.5 6.5"/><path d="M20 4.5V11h-6.2"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c0-3.9 3.3-6.5 7.5-6.5s7.5 2.6 7.5 6.5"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 5.5h-9a2 2 0 0 0-2 2v9"/>',
  };

  const icon = (name, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((el) => {
      if (el.dataset.hydrated === '1') return;
      el.innerHTML = icon(el.dataset.icon);
      el.dataset.hydrated = '1';
    });
  }

  /* ── Formatting ────────────────────────────────────────── */
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function parseISO(iso) { return new Date(iso + 'T00:00:00'); }
  function fmtDate(iso, style = 'medium') {
    if (!iso) return '—';
    const d = parseISO(iso);
    if (Number.isNaN(d.getTime())) return iso;
    if (style === 'short') return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
    if (style === 'long') return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
  function fmtMonth(key) {
    if (!key) return '';
    const [y, m] = key.split('-');
    return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
  }
  const initials = (name) => String(name || '')
    .split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const AV_TONES = ['', 'avatar--brass', 'avatar--ocean', 'avatar--plum'];
  const toneFor = (str) => AV_TONES[Math.abs(String(str).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AV_TONES.length];

  const statusPill = (status) => {
    const map = { confirmed: 'Confirmed', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled' };
    return `<span class="pill pill--${status}">${map[status] || status}</span>`;
  };
  const payPill = (status) => {
    const map = { paid: 'Paid', partial: 'Part paid', pending: 'Unpaid' };
    return `<span class="pill pill--${status === 'pending' ? 'cancelled' : status}">${map[status] || status}</span>`;
  };

  /* ── App state ─────────────────────────────────────────── */
  const ui = {
    route: 'dashboard',
    filterStatus: 'all',
    filterQ: '',
    invoiceMonth: '',
    currentInvoice: null,
    searchOpen: false,
    searchCursor: 0,
  };

  const toast = (msg, tone = 'ok') => {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = `toast toast--${tone}`;
    el.innerHTML = `<span class="toast__icon">${icon(tone === 'bad' ? 'alert' : 'check')}</span><span>${esc(msg)}</span>`;
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 280);
    }, 3400);
  };

  /* ── Shared fragments ──────────────────────────────────── */
  function customerCell(id, sub) {
    const c = Store.customerById(id);
    const name = c ? c.name : 'Unknown guest';
    const meta = sub !== undefined ? sub : c ? c.phone : '';
    const tone = toneFor(name);
    return `<div class="who">
      <div class="avatar ${tone}">${esc(initials(name))}</div>
      <div><div class="who__name">${esc(name)}</div><div class="who__meta">${esc(meta)}</div></div>
    </div>`;
  }

  function emptyState(iconName, title, copy, action) {
    return `<div class="empty">
      <div class="empty__icon">${icon(iconName)}</div>
      <h4>${esc(title)}</h4>
      <p>${esc(copy)}</p>
      ${action || ''}
    </div>`;
  }

  const pageHead = (title, sub, actions = '') => `
    <div class="pagehead">
      <div>
        <div class="eyebrow">${esc(Store.settings().business)}</div>
        <h1 class="display pagehead__title" style="margin-top:9px">${esc(title)}</h1>
        <p class="pagehead__sub">${esc(sub)}</p>
      </div>
      <div class="pagehead__actions">${actions}</div>
    </div>`;

  /* ── Charts ────────────────────────────────────────────── */
  const CHART_COLORS = ['#a9822f', '#4b6b52', '#2f5d70', '#6b3f5e', '#a4503a', '#8a8a5e'];

  function donutSVG(data, size = 138, thickness = 15) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const r = (size - thickness) / 2;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const segs = data.map((d) => {
      const len = (d.value / total) * c;
      const seg = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${thickness}" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
      offset += len;
      return seg;
    }).join('');
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img">${segs}</svg>`;
  }

  function sparkline(values, w = 190, h = 54) {
    if (!values.length) return '';
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const span = max - min || 1;
    const step = values.length > 1 ? w / (values.length - 1) : w;
    const pts = values.map((v, i) => [i * step, h - ((v - min) / span) * (h - 8) - 4]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${w},${h} L0,${h} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="sparkg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#c9a45a" stop-opacity=".34"/>
        <stop offset="100%" stop-color="#c9a45a" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${area}" fill="url(#sparkg)"/>
      <path d="${line}" fill="none" stroke="#c9a45a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  /* ── Data helpers ──────────────────────────────────────── */
  function billsList() {
    return Store.bookings().map((b) => ({
      booking: b,
      bill: Store.billFor(b),
      customer: Store.customerById(b.customerId),
      service: Store.serviceById(b.serviceId),
    }));
  }

  function lastMonthKeys(n) {
    const out = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return out;
  }

  /* ============================================================
     VIEW · Dashboard
     ============================================================ */
  function viewDashboard() {
    const a = Store.analytics();
    const months = lastMonthKeys(6).map((k) => {
      const found = a.months.find((m) => m.key === k);
      return { key: k, revenue: found ? found.revenue : 0, count: found ? found.count : 0 };
    });
    const maxRev = Math.max(...months.map((m) => m.revenue), 1);

    const upcoming = billsList()
      .filter((r) => r.booking.status !== 'cancelled' && r.booking.date >= Store.todayISO())
      .sort((x, y) => (x.booking.date + x.booking.slot).localeCompare(y.booking.date + y.booking.slot))
      .slice(0, 5);

    const recent = billsList()
      .sort((x, y) => (y.booking.createdAt || '').localeCompare(x.booking.createdAt || ''))
      .slice(0, 6);

    const tomorrow = Store.addDays(Store.todayISO(), 1);
    const availServices = Store.services().slice(0, 5);

    const growth = months.length >= 2 && months[months.length - 2].revenue > 0
      ? ((months[months.length - 1].revenue - months[months.length - 2].revenue) / months[months.length - 2].revenue) * 100
      : 0;

    return `<div class="shell">
      ${pageHead('Revenue console', 'Live position across reservations, billing and settlement.', `
        <button class="btn btn--ghost" data-action="export"><span data-icon="download"></span> Export</button>
        <button class="btn btn--primary" data-action="new-booking"><span data-icon="plus"></span> New booking</button>
      `)}

      <div class="kpi-grid">
        <div class="kpi kpi--hero reveal">
          <div class="kpi__label">Total billed</div>
          <div class="kpi__value">${Billing.money(a.revenue)}</div>
          <div class="kpi__foot">
            <span class="delta ${growth >= 0 ? 'delta--up' : 'delta--down'}">${icon(growth >= 0 ? 'up' : 'down')} ${Math.abs(growth).toFixed(1)}%</span>
            month on month · ${a.totalBookings} bookings
          </div>
          <div class="kpi__spark">${sparkline(months.map((m) => m.revenue))}</div>
        </div>
        <div class="kpi reveal reveal-2">
          <div class="kpi__label">Collected</div>
          <div class="kpi__value">${Billing.compactMoney(a.collected)}</div>
          <div class="kpi__foot"><span class="delta delta--up">${icon('check')} ${Math.round((a.collected / (a.revenue || 1)) * 100)}%</span> of billed value</div>
        </div>
        <div class="kpi reveal reveal-3">
          <div class="kpi__label">Outstanding</div>
          <div class="kpi__value" style="color:var(--brass-deep)">${Billing.compactMoney(a.outstanding)}</div>
          <div class="kpi__foot">${a.pendingCount} bookings awaiting settlement</div>
        </div>
        <div class="kpi reveal reveal-4">
          <div class="kpi__label">GST liability</div>
          <div class="kpi__value">${Billing.compactMoney(a.gst)}</div>
          <div class="kpi__foot">CGST + SGST @ ${Math.round(Store.settings().gstRate * 100)}%</div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="stack">
          <div class="card reveal">
            <div class="card__head">
              <div>
                <div class="card__title">Billed value by month</div>
                <div class="card__sub">Last six months, inclusive of tax</div>
              </div>
              <span class="tag tag--gold">${Billing.compactMoney(months.reduce((s, m) => s + m.revenue, 0))} total</span>
            </div>
            <div class="card__body">
              <div class="bars">
                ${months.map((m) => `
                  <div class="bar-col">
                    <span class="bar-value">${m.revenue ? Billing.compactMoney(m.revenue) : '—'}</span>
                    <div class="bar-wrap"><div class="bar" style="height:${Math.max((m.revenue / maxRev) * 100, m.revenue ? 4 : 1.5)}%;${m.revenue ? '' : 'opacity:.25'}"></div></div>
                    <span class="bar-label">${fmtMonth(m.key)}</span>
                  </div>`).join('')}
              </div>
            </div>
          </div>

          <div class="card reveal reveal-2">
            <div class="card__head">
              <div>
                <div class="card__title">Recent bookings</div>
                <div class="card__sub">Latest reservations created</div>
              </div>
              <button class="btn btn--quiet btn--sm" data-link="bookings">View all ${icon('right')}</button>
            </div>
            <div class="tbl-wrap">
              <table class="tbl">
                <thead><tr><th>Guest</th><th>Service</th><th>Schedule</th><th>Status</th><th class="t-right">Bill</th></tr></thead>
                <tbody>
                  ${recent.map((r) => `
                    <tr data-open-booking="${r.booking.id}">
                      <td>${customerCell(r.booking.customerId)}</td>
                      <td><span class="t-strong">${esc(r.service ? r.service.name : '—')}</span><div class="tiny faint">${esc(r.service ? r.service.category : '')}</div></td>
                      <td><div class="sm">${fmtDate(r.booking.date, 'short')}</div><div class="tiny faint">${esc(slotLabel(r.booking.slot))}</div></td>
                      <td>${statusPill(r.booking.status)}</td>
                      <td class="t-right t-mono">${r.bill ? Billing.money(r.bill.total) : '—'}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="stack">
          <div class="card reveal reveal-2">
            <div class="card__head">
              <div class="card__title">Service mix</div>
              <span class="tiny faint">by revenue</span>
            </div>
            <div class="card__body">
              <div class="donut-wrap">
                <div class="donut">
                  ${donutSVG(a.byService.slice(0, 5).map((s, i) => ({ value: s.revenue, color: CHART_COLORS[i % CHART_COLORS.length] })))}
                  <div class="donut__center"><strong>${a.byService.length}</strong><span>services</span></div>
                </div>
                <div class="donut-legend">
                  ${a.byService.slice(0, 4).map((s, i) => `
                    <div class="donut-row">
                      <span class="legend-swatch" style="background:${CHART_COLORS[i % CHART_COLORS.length]}"></span>
                      <span class="nm trunc">${esc(s.service.name)}</span>
                      <span class="vl">${Billing.compactMoney(s.revenue)}</span>
                    </div>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="card reveal reveal-3">
            <div class="card__head">
              <div class="card__title">Upcoming</div>
              <span class="tag">${a.upcomingCount} scheduled</span>
            </div>
            <div class="card__body" style="padding-top:6px;padding-bottom:8px">
              <div class="timeline">
                ${upcoming.length ? upcoming.map((r) => {
                  const c = Store.customerById(r.booking.customerId);
                  const d = parseISO(r.booking.date);
                  return `<div class="tl-item" data-open-booking="${r.booking.id}">
                    <div class="tl-date"><div class="d num">${d.getDate()}</div><div class="m">${MONTHS[d.getMonth()]}</div></div>
                    <div class="tl-main">
                      <div class="tl-title trunc">${esc(r.service ? r.service.name : 'Booking')}</div>
                      <div class="tl-meta"><span>${esc(c ? c.name : '')}</span><span class="tl-dot"></span><span>${esc(slotLabel(r.booking.slot))}</span></div>
                    </div>
                    <div class="tl-amt">${r.bill ? Billing.compactMoney(r.bill.total) : ''}</div>
                  </div>`;
                }).join('') : emptyState('calendar', 'Nothing scheduled', 'Upcoming reservations will appear here.')}
              </div>
            </div>
          </div>

          <div class="card reveal reveal-4">
            <div class="card__head">
              <div class="card__title">Slot availability</div>
              <span class="tiny faint">${fmtDate(tomorrow, 'short')}</span>
            </div>
            <div class="card__body">
              <div style="display:flex;flex-direction:column;gap:9px">
                ${availServices.map((s) => `
                  <div class="between">
                    <span class="sm trunc" style="max-width:112px;color:var(--ink-soft)">${esc(s.name)}</span>
                    <div class="row" style="gap:5px">
                      ${Store.slots().map((sl) => {
                        const taken = Store.isSlotTaken(s.id, tomorrow, sl.id);
                        return `<span title="${esc(sl.label)} · ${taken ? 'Booked' : 'Free'}" style="width:13px;height:13px;border-radius:4px;border:1px solid ${taken ? 'var(--line-strong)' : 'color-mix(in srgb, var(--sage) 32%, transparent)'};background:${taken ? 'var(--line-strong)' : 'var(--sage-wash)'};cursor:help"></span>`;
                      }).join('')}
                    </div>
                  </div>`).join('')}
              </div>
              <div class="row mt-2" style="gap:14px">
                <span class="legend-item"><span class="legend-swatch" style="background:var(--sage-wash);border:1px solid color-mix(in srgb,var(--sage) 32%,transparent)"></span>Free</span>
                <span class="legend-item"><span class="legend-swatch" style="background:var(--line-strong)"></span>Booked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  const slotLabel = (id) => {
    const s = Store.slotById(id);
    return s ? `${s.label} · ${s.time}` : id;
  };

  /* ============================================================
     VIEW · Bookings
     ============================================================ */
  function viewBookings() {
    let rows = billsList();
    if (ui.filterStatus !== 'all') {
      if (ui.filterStatus === 'unpaid') rows = rows.filter((r) => r.bill && r.bill.paymentStatus !== 'paid');
      else rows = rows.filter((r) => r.booking.status === ui.filterStatus);
    }
    if (ui.filterQ) {
      const q = ui.filterQ.toLowerCase();
      rows = rows.filter((r) => {
        const c = r.customer;
        return (r.booking.id + ' ' + (c ? c.name + ' ' + c.phone + ' ' + c.email : '') + ' ' + (r.service ? r.service.name : ''))
          .toLowerCase().includes(q);
      });
    }
    rows.sort((x, y) => (y.booking.date + y.booking.slot).localeCompare(x.booking.date + x.booking.slot));

    const counts = { all: Store.bookings().length };
    Store.bookings().forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });

    const tabs = [
      ['all', 'All'],
      ['confirmed', 'Confirmed'],
      ['pending', 'Pending'],
      ['completed', 'Completed'],
      ['cancelled', 'Cancelled'],
      ['unpaid', 'Unsettled'],
    ];

    return `<div class="shell">
      ${pageHead('Bookings', 'Every reservation with its schedule, status and settlement position.', `
        <button class="btn btn--ghost" data-action="export"><span data-icon="download"></span> Export</button>
        <button class="btn btn--primary" data-action="new-booking"><span data-icon="plus"></span> New booking</button>
      `)}

      <div class="toolbar">
        <div class="segmented">
          ${tabs.map(([k, label]) => `<button data-filter-status="${k}" class="${ui.filterStatus === k ? 'is-on' : ''}">${label}${counts[k] !== undefined ? ` <span class="tiny faint">${k === 'unpaid' ? Store.bookings().filter((b) => { const bl = Store.billFor(b); return bl && bl.paymentStatus !== 'paid'; }).length : counts[k]}</span>` : ''}</button>`).join('')}
        </div>
        <div class="spacer"></div>
        <label class="search-inline">${icon('search')}
          <input id="bookingSearch" type="search" placeholder="Search guest, ID, service…" value="${esc(ui.filterQ)}" />
        </label>
      </div>

      <div class="panel">
        ${rows.length ? `<div class="tbl-wrap">
          <table class="tbl">
            <thead><tr>
              <th>Booking</th><th>Guest</th><th>Service</th><th>Schedule</th>
              <th>Status</th><th class="t-right">Total</th><th class="t-right">Balance</th><th></th>
            </tr></thead>
            <tbody>
              ${rows.map((r) => `
                <tr data-open-booking="${r.booking.id}">
                  <td class="t-id">${esc(r.booking.id)}</td>
                  <td>${customerCell(r.booking.customerId, r.customer ? (r.customer.tier + ' · ' + r.customer.phone) : '')}</td>
                  <td><div class="t-strong">${esc(r.service ? r.service.name : '—')}</div><div class="tiny faint">${esc(r.service ? `${r.booking.qty} ${r.service.unit}${r.booking.qty > 1 ? 's' : ''} · ${r.booking.guests} guests` : '')}</div></td>
                  <td><div class="sm">${fmtDate(r.booking.date, 'short')}</div><div class="tiny faint">${esc(slotName(r.booking.slot))}</div></td>
                  <td>${statusPill(r.booking.status)}</td>
                  <td class="t-right t-mono">${r.bill ? Billing.money(r.bill.total) : '—'}</td>
                  <td class="t-right t-mono" style="${r.bill && r.bill.balance > 0 ? 'color:var(--brass-deep);font-weight:500' : 'color:var(--ink-faint)'}">${r.bill ? Billing.money(r.bill.balance) : '—'}</td>
                  <td class="t-right"><span class="iconbtn" style="pointer-events:none">${icon('right')}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>` : emptyState('calendar', 'No bookings match', 'Try a different filter or create a new reservation.', `<button class="btn btn--primary btn--sm" data-action="new-booking">${icon('plus')} New booking</button>`)}
      </div>
    </div>`;
  }

  const slotName = (id) => {
    const s = Store.slotById(id);
    return s ? s.label : id;
  };

  /* ============================================================
     VIEW · New booking
     ============================================================ */
  function viewNew() {
    const customers = Store.customers();
    const services = Store.services();
    const defaultDate = Store.addDays(Store.todayISO(), 1);

    return `<div class="shell">
      ${pageHead('New booking', 'Capture the guest, choose the service and slot — the bill calculates itself.', `
        <button class="btn btn--ghost" data-link="bookings">${icon('left')} All bookings</button>
      `)}

      <div class="composer">
        <div class="stack">
          <div class="card">
            <div class="card__head">
              <div><div class="card__title">01 · Guest</div><div class="card__sub">Select an existing customer or register a new one</div></div>
            </div>
            <div class="card__body">
              <div class="form-grid">
                <div class="field span-2" id="fCustomer">
                  <label class="field__label" for="nbCustomer">Customer <span class="req">*</span></label>
                  <select class="select" id="nbCustomer">
                    <option value="">Select a customer…</option>
                    ${customers.map((c) => `<option value="${c.id}">${esc(c.name)} — ${esc(c.phone)}</option>`).join('')}
                    <option value="__new">＋ Register new customer</option>
                  </select>
                  <span class="field__err">Choose a customer or register a new one</span>
                </div>
              </div>

              <div id="newCustomerBox" hidden style="margin-top:16px">
                <div class="divider"></div>
                <div class="form-grid">
                  <div class="field" id="fCName">
                    <label class="field__label">Full name <span class="req">*</span></label>
                    <input class="input" id="ncName" placeholder="e.g. Ananya Menon" autocomplete="off" />
                    <span class="field__err">Name is required</span>
                  </div>
                  <div class="field" id="fCPhone">
                    <label class="field__label">Phone <span class="req">*</span></label>
                    <input class="input" id="ncPhone" placeholder="+91 98470 00000" autocomplete="off" />
                    <span class="field__err">Enter a valid phone number</span>
                  </div>
                  <div class="field">
                    <label class="field__label">Email</label>
                    <input class="input" id="ncEmail" type="email" placeholder="guest@example.com" autocomplete="off" />
                  </div>
                  <div class="field">
                    <label class="field__label">City</label>
                    <input class="input" id="ncCity" placeholder="Kochi" autocomplete="off" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div><div class="card__title">02 · Service &amp; schedule</div><div class="card__sub">Availability is verified before confirmation</div></div>
              <div class="field" style="min-width:164px">
                <input class="input" type="date" id="nbDate" value="${defaultDate}" min="${Store.todayISO()}" />
              </div>
            </div>
            <div class="card__body">
              <div class="field" id="fService" style="margin-bottom:16px">
                <label class="field__label">Service <span class="req">*</span></label>
                <div class="svc-picker" id="svcPicker">
                  ${services.map((s) => `
                    <button type="button" class="svc-opt" data-svc="${s.id}">
                      <div class="svc-opt__top">
                        <span class="svc-opt__icon">${icon(s.icon)}</span>
                        <span class="tag">${esc(s.category)}</span>
                      </div>
                      <div class="svc-opt__name">${esc(s.name)}</div>
                      <div class="svc-opt__rate">${Billing.money(s.rate)} / ${esc(s.unit)}</div>
                    </button>`).join('')}
                </div>
                <span class="field__err">Select a service</span>
              </div>

              <div class="field" id="fSlot">
                <label class="field__label">Time slot <span class="req">*</span></label>
                <div class="slot-grid" id="slotGrid">
                  ${Store.slots().map((s) => `
                    <button type="button" class="slot" data-slot="${s.id}" disabled>
                      <span class="slot__label">${esc(s.label)}</span>
                      <span class="slot__time">${esc(s.time)}</span>
                    </button>`).join('')}
                </div>
                <span class="field__err">Select an available slot</span>
              </div>

              <div class="form-grid mt-2">
                <div class="field">
                  <label class="field__label">Quantity <span class="req">*</span></label>
                  <input class="input" type="number" id="nbQty" value="1" min="1" max="365" step="1" />
                  <span class="tiny faint" id="qtyHint">—</span>
                </div>
                <div class="field">
                  <label class="field__label">Guests</label>
                  <input class="input" type="number" id="nbGuests" value="1" min="1" max="500" step="1" />
                  <span class="tiny faint" id="guestHint">—</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div><div class="card__title">03 · Extras &amp; discount</div><div class="card__sub">Add-ons post directly to the bill</div></div>
            </div>
            <div class="card__body">
              <div class="field" style="margin-bottom:16px">
                <label class="field__label">Add-ons</label>
                <div class="addon-chips" id="addonChips">
                  ${Store.addons().map((a) => `
                    <button type="button" class="chip" data-addon="${a.id}">
                      ${icon('plus')} ${esc(a.name)} <span class="faint">${Billing.money(a.rate)}</span>
                    </button>`).join('')}
                </div>
              </div>
              <div class="form-grid">
                <div class="field">
                  <label class="field__label">Discount type</label>
                  <select class="select" id="nbDiscType">
                    <option value="percent">Percentage</option>
                    <option value="flat">Flat amount</option>
                  </select>
                </div>
                <div class="field">
                  <label class="field__label">Discount value</label>
                  <input class="input" type="number" id="nbDiscValue" value="0" min="0" step="0.01" />
                </div>
                <div class="field span-2">
                  <label class="field__label">Notes</label>
                  <textarea class="textarea" id="nbNotes" placeholder="Preferences, arrival time, special instructions…"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div><div class="card__title">04 · Payment</div><div class="card__sub">Optional — collect an advance now</div></div>
              <label class="row" style="gap:8px;font-size:12px;color:var(--ink-mute)">
                <input type="checkbox" id="nbPayNow" /> Collect now
              </label>
            </div>
            <div class="card__body" id="payBox" hidden>
              <div class="form-grid">
                <div class="field">
                  <label class="field__label">Amount</label>
                  <input class="input input--mono" type="number" id="nbPayAmount" value="0" min="0" step="0.01" />
                </div>
                <div class="field">
                  <label class="field__label">Method</label>
                  <select class="select" id="nbPayMethod">
                    <option>UPI</option><option>Card</option><option>Cash</option><option>Bank Transfer</option>
                  </select>
                </div>
                <div class="field span-2">
                  <label class="field__label">Reference</label>
                  <input class="input input--mono" id="nbPayRef" placeholder="Auto-generated if left blank" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="billpanel">
          <div class="billpanel__head">
            <h3>Bill preview</h3>
            <span class="tag" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:rgba(233,231,221,.7)" id="billRef">Draft</span>
          </div>
          <div class="billpanel__body" id="billBody"></div>
          <div class="bill-foot">
            <div class="words" id="billWords"></div>
            <button class="btn btn--brass btn--lg btn--block" data-action="create-booking">
              ${icon('check')} Confirm booking
            </button>
            <p class="bill-note">Availability is validated at confirmation. A receipt is generated automatically.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ── New booking logic ─────────────────────────────────── */
  const nb = {
    serviceId: null, slot: null, addons: new Set(),
  };

  function nbState() {
    return {
      serviceId: nb.serviceId,
      slot: nb.slot,
      date: $('#nbDate') ? $('#nbDate').value : '',
      qty: Number($('#nbQty') ? $('#nbQty').value : 1) || 1,
      guests: Number($('#nbGuests') ? $('#nbGuests').value : 1) || 1,
      discType: $('#nbDiscType') ? $('#nbDiscType').value : 'percent',
      discValue: Number($('#nbDiscValue') ? $('#nbDiscValue').value : 0) || 0,
      addonIds: Array.from(nb.addons),
    };
  }

  function nbItems(st) {
    const items = [];
    const svc = Store.serviceById(st.serviceId);
    if (svc) items.push({ name: svc.name, qty: st.qty, rate: svc.rate, unit: svc.unit });
    st.addonIds.forEach((id) => {
      const a = Store.addons().find((x) => x.id === id);
      if (!a) return;
      const qty = a.unit === 'unit' || a.unit === 'trip' ? st.qty : 1;
      items.push({ name: a.name, qty, rate: a.rate, unit: a.unit });
    });
    return items;
  }

  function nbBill(st) {
    return Billing.computeBill({
      items: nbItems(st),
      discount: { type: st.discType, value: st.discValue },
      gstRate: Store.settings().gstRate,
      paid: 0,
    });
  }

  function renderBill() {
    const st = nbState();
    const bill = nbBill(st);
    const svc = Store.serviceById(st.serviceId);

    const body = $('#billBody');
    if (!body) return;

    body.innerHTML = `
      ${svc ? `<div class="bill-line" style="padding-bottom:8px">
        <span class="k" style="font-size:12.5px;color:var(--ink)">${esc(svc.name)}</span>
        <span class="v">${esc(st.qty)} × ${Billing.money(svc.rate)}</span>
      </div>` : `<div class="bill-line bill-line--muted"><span class="k">Select a service to begin</span><span class="v"></span></div>`}
      ${st.addonIds.map((id) => {
        const a = Store.addons().find((x) => x.id === id);
        if (!a) return '';
        const q = a.unit === 'unit' || a.unit === 'trip' ? st.qty : 1;
        return `<div class="bill-line bill-line--item"><span class="k">${esc(a.name)}</span><span class="v">${q > 1 ? q + ' × ' : ''}${Billing.money(a.rate * q)}</span></div>`;
      }).join('')}
      <div class="bill-line bill-line--sub"><span class="k">Subtotal</span><span class="v">${Billing.money(bill.subtotal)}</span></div>
      ${bill.discount > 0 ? `<div class="bill-line bill-line--disc"><span class="k">Discount${st.discType === 'percent' ? ` (${st.discValue}%)` : ''}</span><span class="v">− ${Billing.money(bill.discount)}</span></div>` : ''}
      <div class="bill-line"><span class="k">Taxable value</span><span class="v">${Billing.money(bill.taxable)}</span></div>
      <div class="bill-line bill-line--muted"><span class="k">CGST @ ${(bill.gstRate * 50).toFixed(1)}%</span><span class="v">${Billing.money(bill.cgst)}</span></div>
      <div class="bill-line bill-line--muted"><span class="k">SGST @ ${(bill.gstRate * 50).toFixed(1)}%</span><span class="v">${Billing.money(bill.sgst)}</span></div>
      <div class="bill-total"><span class="k">Amount payable</span><span class="v">${Billing.money(bill.total)}</span></div>
    `;

    const words = $('#billWords');
    if (words) words.innerHTML = `<strong>In words</strong>${esc(Billing.amountInWords(bill.total))}`;

    const payAmount = $('#nbPayAmount');
    if (payAmount && document.activeElement !== payAmount) payAmount.value = bill.total ? bill.total.toFixed(2) : '0';

    const ref = $('#billRef');
    if (ref) ref.textContent = st.slot ? `${slotName(st.slot)}` : 'Draft';
  }

  function renderSlots() {
    const st = nbState();
    const grid = $('#slotGrid');
    if (!grid) return;
    grid.innerHTML = Store.slots().map((s) => {
      const taken = st.serviceId && st.date ? Store.isSlotTaken(st.serviceId, st.date, s.id) : false;
      const on = nb.slot === s.id;
      return `<button type="button" class="slot ${on ? 'is-on' : ''} ${taken ? 'is-taken' : ''}" data-slot="${s.id}" ${taken || !st.serviceId ? 'disabled' : ''}>
        <span class="slot__label">${esc(s.label)}</span>
        <span class="slot__time">${taken ? 'Booked' : esc(s.time)}</span>
      </button>`;
    }).join('');

    if (nb.slot && st.serviceId && st.date && Store.isSlotTaken(st.serviceId, st.date, nb.slot)) nb.slot = null;
  }

  function renderHints() {
    const st = nbState();
    const svc = Store.serviceById(st.serviceId);
    const qh = $('#qtyHint');
    const gh = $('#guestHint');
    if (qh) qh.textContent = svc ? `Charged per ${svc.unit}` : '—';
    if (gh) gh.textContent = svc ? `Capacity ${svc.capacity} guests` : '—';
  }

  function bindNewBooking() {
    nb.serviceId = null;
    nb.slot = null;
    nb.addons = new Set();

    const custSel = $('#nbCustomer');
    custSel.addEventListener('change', () => {
      const isNew = custSel.value === '__new';
      $('#newCustomerBox').hidden = !isNew;
      $('#fCustomer').classList.remove('field--err');
    });

    $('#svcPicker').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-svc]');
      if (!btn) return;
      nb.serviceId = btn.dataset.svc;
      nb.slot = null;
      $$('#svcPicker .svc-opt').forEach((b) => b.classList.toggle('is-on', b.dataset.svc === nb.serviceId));
      $('#fService').classList.remove('field--err');
      renderSlots(); renderHints(); renderBill();
    });

    $('#slotGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-slot]');
      if (!btn || btn.disabled) return;
      nb.slot = btn.dataset.slot;
      $('#fSlot').classList.remove('field--err');
      renderSlots(); renderBill();
    });

    $('#nbDate').addEventListener('change', () => { renderSlots(); renderBill(); });

    $('#addonChips').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-addon]');
      if (!chip) return;
      const id = chip.dataset.addon;
      if (nb.addons.has(id)) nb.addons.delete(id); else nb.addons.add(id);
      chip.classList.toggle('is-on', nb.addons.has(id));
      renderBill();
    });

    ['#nbQty', '#nbGuests', '#nbDiscValue'].forEach((sel) => {
      const el = $(sel);
      if (el) el.addEventListener('input', () => { renderHints(); renderBill(); });
    });
    $('#nbDiscType').addEventListener('change', renderBill);

    $('#nbPayNow').addEventListener('change', (e) => {
      $('#payBox').hidden = !e.target.checked;
      if (e.target.checked) renderBill();
    });

    renderSlots();
    renderHints();
    renderBill();
  }

  function createBooking() {
    const st = nbState();
    let ok = true;

    const custSel = $('#nbCustomer');
    const chosen = custSel.value;
    if (!chosen) { $('#fCustomer').classList.add('field--err'); ok = false; }

    let newCustomerData = null;
    if (chosen === '__new') {
      const name = $('#ncName').value.trim();
      const phone = $('#ncPhone').value.trim();
      if (!name) { $('#fCName').classList.add('field--err'); ok = false; } else $('#fCName').classList.remove('field--err');
      if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) { $('#fCPhone').classList.add('field--err'); ok = false; } else $('#fCPhone').classList.remove('field--err');
      newCustomerData = {
        name, phone,
        email: $('#ncEmail').value.trim(),
        city: $('#ncCity').value.trim(),
        tier: 'Silver',
      };
    }

    if (!st.serviceId) { $('#fService').classList.add('field--err'); ok = false; }
    if (!st.date) { toast('Choose a booking date', 'bad'); ok = false; }
    if (!st.slot) { $('#fSlot').classList.add('field--err'); ok = false; }
    if (!ok) { toast('Please complete the highlighted fields', 'bad'); return; }

    if (Store.isSlotTaken(st.serviceId, st.date, st.slot)) {
      toast('That slot was just taken — choose another', 'bad');
      renderSlots(); renderBill();
      return;
    }

    let customerId;
    if (newCustomerData) {
      const c = Store.createCustomer(newCustomerData);
      customerId = c.id;
    } else {
      customerId = chosen;
    }

    const items = nbItems(st);
    const booking = Store.createBooking({
      customerId,
      serviceId: st.serviceId,
      date: st.date,
      slot: st.slot,
      qty: st.qty,
      guests: st.guests,
      items,
      discount: { type: st.discType, value: st.discValue },
      notes: $('#nbNotes').value.trim(),
      status: 'confirmed',
    });

    if ($('#nbPayNow').checked) {
      const amt = Number($('#nbPayAmount').value) || 0;
      if (amt > 0) {
        Store.recordPayment(booking.id, {
          amount: amt,
          method: $('#nbPayMethod').value,
          reference: $('#nbPayRef').value.trim() || undefined,
          note: 'Advance at booking',
          date: Store.todayISO(),
        });
      }
    }

    hydrateNavBadge();
    toast(`${booking.id} confirmed for ${fmtDate(booking.date, 'short')}`);
    openInvoiceModal(booking.id);
    navigate('bookings');
  }

  /* ============================================================
     VIEW · Customers
     ============================================================ */
  function viewCustomers() {
    const q = ui.filterQ.toLowerCase();
    let customers = Store.customers().slice();
    if (q) {
      customers = customers.filter((c) =>
        (c.name + ' ' + c.phone + ' ' + c.email + ' ' + c.city).toLowerCase().includes(q));
    }
    customers.sort((a, b) => a.name.localeCompare(b.name));

    return `<div class="shell">
      ${pageHead('Customers', 'Guest records with reservation history and lifetime value.', `
        <div class="search-inline">${icon('search')}<input id="customerSearch" type="search" placeholder="Search guests…" value="${esc(ui.filterQ)}" /></div>
        <button class="btn btn--primary" data-action="add-customer"><span data-icon="plus"></span> Add customer</button>
      `)}

      ${customers.length ? `<div class="cust-grid">
        ${customers.map((c) => {
          const rows = billsList().filter((r) => r.booking.customerId === c.id && r.booking.status !== 'cancelled');
          const spend = rows.reduce((s, r) => s + (r.bill ? r.bill.total : 0), 0);
          return `<div class="cust" data-open-customer="${c.id}">
            <div class="cust__top">
              <div class="cust__av">${esc(initials(c.name))}</div>
              <div class="grow">
                <div class="cust__name trunc">${esc(c.name)}</div>
                <div class="cust__id">${esc(c.id)} · ${esc(c.tier)}</div>
              </div>
              <span class="tag ${c.tier === 'Platinum' ? 'tag--gold' : ''}">${esc(c.tier)}</span>
            </div>
            <div class="cust__rows">
              <div class="cust__row">${icon('phone')}<span class="trunc">${esc(c.phone)}</span></div>
              <div class="cust__row">${icon('mail')}<span class="trunc">${esc(c.email || '—')}</span></div>
              <div class="cust__row">${icon('pin')}<span class="trunc">${esc(c.city || '—')}</span></div>
            </div>
            <div class="cust__foot">
              <span class="cust__stat">Bookings<b>${rows.length}</b></span>
              <span class="cust__stat" style="text-align:center">Lifetime value<b>${Billing.compactMoney(spend)}</b></span>
              <span class="cust__stat" style="text-align:right">Since<b>${esc(String(c.createdAt || '').slice(0, 4) || '—')}</b></span>
            </div>
          </div>`;
        }).join('')}
      </div>` : `<div class="panel">${emptyState('users', 'No customers found', 'Adjust your search or add a new guest record.', `<button class="btn btn--primary btn--sm" data-action="add-customer">${icon('plus')} Add customer</button>`)}</div>`}
    </div>`;
  }

  /* ============================================================
     VIEW · Invoices
     ============================================================ */
  function viewInvoices() {
    let rows = billsList();
    if (ui.filterStatus !== 'all') {
      rows = rows.filter((r) => r.bill && r.bill.paymentStatus === ui.filterStatus);
    }
    rows.sort((x, y) => y.booking.date.localeCompare(x.booking.date));

    return `<div class="shell">
      ${pageHead('Invoices', 'Tax invoices and receipts generated from confirmed bookings.', `
        <button class="btn btn--ghost" data-action="export">${icon('download')} Export ledger</button>
      `)}

      <div class="toolbar">
        <div class="segmented">
          ${[['all', 'All invoices'], ['paid', 'Paid'], ['partial', 'Part paid'], ['pending', 'Unpaid']].map(([k, label]) =>
            `<button data-filter-status="${k}" class="${ui.filterStatus === k ? 'is-on' : ''}">${label}</button>`).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr>
              <th>Invoice</th><th>Guest</th><th>Issued</th><th class="t-right">Subtotal</th>
              <th class="t-right">GST</th><th class="t-right">Total</th><th class="t-right">Balance</th><th>Payment</th>
            </tr></thead>
            <tbody>
              ${rows.map((r) => `
                <tr data-open-invoice="${r.booking.id}">
                  <td class="t-id">${esc(r.booking.id.replace('BK-', 'INV-'))}</td>
                  <td>${customerCell(r.booking.customerId, r.customer ? r.customer.tier : '')}</td>
                  <td class="sm">${fmtDate(r.booking.date, 'short')}</td>
                  <td class="t-right t-mono">${Billing.money(r.bill.subtotal)}</td>
                  <td class="t-right t-mono">${Billing.money(r.bill.tax)}</td>
                  <td class="t-right t-mono t-strong">${Billing.money(r.bill.total)}</td>
                  <td class="t-right t-mono" style="${r.bill.balance > 0 ? 'color:var(--brass-deep)' : 'color:var(--ink-faint)'}">${Billing.money(r.bill.balance)}</td>
                  <td>${payPill(r.bill.paymentStatus)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     VIEW · Payments
     ============================================================ */
  function viewPayments() {
    const pays = Store.payments().slice().sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
    const a = Store.analytics();
    const methodIcon = { UPI: 'card', Card: 'card', Cash: 'cash', 'Bank Transfer': 'bank' };

    return `<div class="shell">
      ${pageHead('Payments', 'Every settlement recorded against a booking, with mode and reference.', `
        <button class="btn btn--primary" data-action="record-payment"><span data-icon="plus"></span> Record payment</button>
      `)}

      <div class="kpi-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
        <div class="kpi"><div class="kpi__label">Collected</div><div class="kpi__value">${Billing.money(a.collected)}</div><div class="kpi__foot">${pays.length} transactions</div></div>
        <div class="kpi"><div class="kpi__label">Outstanding</div><div class="kpi__value" style="color:var(--brass-deep)">${Billing.money(a.outstanding)}</div><div class="kpi__foot">${a.pendingCount} bookings open</div></div>
        <div class="kpi"><div class="kpi__label">Collection rate</div><div class="kpi__value">${Math.round((a.collected / (a.revenue || 1)) * 100)}<small>%</small></div><div class="kpi__foot">of total billed value</div></div>
      </div>

      <div class="panel">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>Payment</th><th>Booking</th><th>Guest</th><th>Method</th><th>Reference</th><th>Date</th><th class="t-right">Amount</th></tr></thead>
            <tbody>
              ${pays.length ? pays.map((p) => {
                const b = Store.bookingById(p.bookingId);
                const c = b ? Store.customerById(b.customerId) : null;
                return `<tr data-open-booking="${p.bookingId}">
                  <td class="t-id">${esc(p.id)}</td>
                  <td class="t-id">${esc(p.bookingId)}</td>
                  <td>${customerCell(b ? b.customerId : null, c ? c.tier : '')}</td>
                  <td><span class="row sm" style="gap:6px">${icon(methodIcon[p.method] || 'cash')} ${esc(p.method)}</span></td>
                  <td class="t-mono tiny">${esc(p.reference || '—')}</td>
                  <td class="sm">${fmtDate(p.date, 'short')}</td>
                  <td class="t-right t-mono t-strong">${Billing.money(p.amount)}</td>
                </tr>`;
              }).join('') : `<tr><td colspan="7">${emptyState('wallet', 'No payments yet', 'Settlements recorded against bookings appear here.')}</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     VIEW · Reports
     ============================================================ */
  function viewReports() {
    const a = Store.analytics();
    const months = lastMonthKeys(6).map((k) => {
      const f = a.months.find((m) => m.key === k);
      return { key: k, revenue: f ? f.revenue : 0 };
    });
    const maxRev = Math.max(...months.map((m) => m.revenue), 1);
    const maxSvc = Math.max(...a.byService.map((s) => s.revenue), 1);
    const totalMethods = a.byMethod.reduce((s, m) => s + m.amount, 0) || 1;

    const topCustomers = Store.customers().map((c) => {
      const rows = billsList().filter((r) => r.booking.customerId === c.id && r.booking.status !== 'cancelled');
      return { c, spend: rows.reduce((s, r) => s + r.bill.total, 0), count: rows.length };
    }).sort((x, y) => y.spend - x.spend).slice(0, 5);

    return `<div class="shell">
      ${pageHead('Reports', 'Revenue composition, tax position and guest value across the book.', `
        <button class="btn btn--ghost" data-action="export">${icon('download')} Export</button>
      `)}

      <div class="kpi-grid">
        <div class="kpi kpi--hero"><div class="kpi__label">Gross billed</div><div class="kpi__value">${Billing.money(a.revenue)}</div>
          <div class="kpi__foot">${a.totalBookings} bookings · ${a.customers} guests</div>
          <div class="kpi__spark">${sparkline(months.map((m) => m.revenue))}</div>
        </div>
        <div class="kpi"><div class="kpi__label">Net of tax</div><div class="kpi__value">${Billing.compactMoney(a.revenue - a.gst)}</div><div class="kpi__foot">taxable value</div></div>
        <div class="kpi"><div class="kpi__label">GST payable</div><div class="kpi__value">${Billing.compactMoney(a.gst)}</div><div class="kpi__foot">CGST ${Billing.compactMoney(a.gst / 2)} · SGST ${Billing.compactMoney(a.gst / 2)}</div></div>
        <div class="kpi"><div class="kpi__label">Avg. ticket</div><div class="kpi__value">${Billing.compactMoney(a.revenue / (a.totalBookings || 1))}</div><div class="kpi__foot">per booking</div></div>
      </div>

      <div class="grid-2" style="margin-bottom:14px">
        <div class="card">
          <div class="card__head"><div class="card__title">Revenue trend</div><span class="tiny faint">6 months</span></div>
          <div class="card__body">
            <div class="bars">
              ${months.map((m) => `
                <div class="bar-col">
                  <span class="bar-value">${m.revenue ? Billing.compactMoney(m.revenue) : '—'}</span>
                  <div class="bar-wrap"><div class="bar" style="height:${Math.max((m.revenue / maxRev) * 100, m.revenue ? 4 : 1.5)}%;${m.revenue ? '' : 'opacity:.25'}"></div></div>
                  <span class="bar-label">${fmtMonth(m.key)}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__head"><div class="card__title">Revenue by service</div><span class="tiny faint">all time</span></div>
          <div class="card__body">
            <div class="hbar">
              ${a.byService.map((s) => `
                <div class="hbar-row">
                  <span class="hbar-name">${esc(s.service.name)}</span>
                  <div class="hbar-track"><div class="hbar-fill" style="width:${(s.revenue / maxSvc) * 100}%"></div></div>
                  <span class="hbar-val">${Billing.compactMoney(s.revenue)}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:14px">
        <div class="card">
          <div class="card__head"><div class="card__title">Payment mix</div><span class="tiny faint">collected value</span></div>
          <div class="card__body">
            <div class="donut-wrap">
              <div class="donut">
                ${donutSVG(a.byMethod.map((m, i) => ({ value: m.amount, color: CHART_COLORS[i % CHART_COLORS.length] })))}
                <div class="donut__center"><strong>${Math.round((a.collected / (a.revenue || 1)) * 100)}%</strong><span>settled</span></div>
              </div>
              <div class="donut-legend">
                ${a.byMethod.map((m, i) => `
                  <div class="donut-row">
                    <span class="legend-swatch" style="background:${CHART_COLORS[i % CHART_COLORS.length]}"></span>
                    <span class="nm">${esc(m.method)}</span>
                    <span class="vl">${Math.round((m.amount / totalMethods) * 100)}%</span>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__head"><div class="card__title">GST position</div><span class="tag">${Math.round(Store.settings().gstRate * 100)}% slab</span></div>
          <div class="card__body">
            <div class="statlist">
              <div class="statrow"><span class="k">Taxable value</span><span class="v">${Billing.money(a.revenue - a.gst)}</span></div>
              <div class="statrow"><span class="k">CGST @ 9%</span><span class="v">${Billing.money(a.gst / 2)}</span></div>
              <div class="statrow"><span class="k">SGST @ 9%</span><span class="v">${Billing.money(a.gst / 2)}</span></div>
              <div class="statrow"><span class="k strong">Total tax liability</span><span class="v" style="color:var(--brass-deep)">${Billing.money(a.gst)}</span></div>
              <div class="statrow"><span class="k">GSTIN</span><span class="v tiny">${esc(Store.settings().gstin)}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__head"><div class="card__title">Top guests by value</div><span class="tiny faint">lifetime billed</span></div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>Guest</th><th>Tier</th><th>City</th><th class="t-right">Bookings</th><th class="t-right">Lifetime value</th></tr></thead>
            <tbody>
              ${topCustomers.map((t) => `
                <tr data-open-customer="${t.c.id}">
                  <td>${customerCell(t.c.id, t.c.phone)}</td>
                  <td><span class="tag ${t.c.tier === 'Platinum' ? 'tag--gold' : ''}">${esc(t.c.tier)}</span></td>
                  <td class="sm">${esc(t.c.city || '—')}</td>
                  <td class="t-right t-mono">${t.count}</td>
                  <td class="t-right t-mono t-strong">${Billing.money(t.spend)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     VIEW · Project brief
     ============================================================ */
  function viewBrief() {
    const team = [
      ['M. Srujan', 'AP25110070668'], ['G. Pranav', 'AP25110070089'], ['M. Anji', 'AP25110070163'],
      ['K. Charan', 'AP25110070165'], ['Akhil', 'AP25110070409'],
    ];
    return `<div class="shell">
      <div class="brief-hero">
        <div class="eyebrow" style="color:var(--brass-light)">Java project · Presentation brief</div>
        <h1 style="margin-top:14px">Booking &amp; Billing Management System</h1>
        <p class="lede">A Java-based application for managing reservations, calculating bills and maintaining payment records — implemented here as a working web model of the same object-oriented design.</p>
        <div class="chips">
          <span>OOP · Java</span><span>JDBC · MySQL</span><span>GST billing</span><span>Availability validation</span><span>Receipt generation</span>
        </div>
        <div class="team">
          ${team.map(([n, r]) => `<span>${esc(n)} · ${esc(r)}</span>`).join('')}
        </div>
      </div>

      <div class="brief-grid">
        <div class="card brief-card">
          <h3><span class="n">01</span> Abstract</h3>
          <ul>
            <li>Computerises reservation creation and customer billing end to end.</li>
            <li>Collects customer details, records bookings, calculates charges and maintains payment status.</li>
            <li>Reduces manual calculation errors and removes duplicate entries.</li>
            <li>Delivered as a console application, or Java Swing desktop UI, backed by MySQL through JDBC.</li>
          </ul>
        </div>

        <div class="card brief-card">
          <h3><span class="n">02</span> Problem &amp; objectives</h3>
          <ul>
            <li><b>Manual records</b> — details scattered across registers, slow to search and update.</li>
            <li><b>Calculation errors</b> — discounts, taxes and extras frequently missed.</li>
            <li><b>Availability conflicts</b> — the same slot assigned more than once.</li>
            <li><b>Objectives</b> — automate bookings, improve accuracy, maintain records, save time, provide transparency.</li>
          </ul>
        </div>

        <div class="card brief-card" style="grid-column:span 2">
          <h3><span class="n">03</span> System workflow</h3>
          <div class="flow">
            ${[['Customer', 'details'], ['Select', 'service / date / slot'], ['Check', 'availability'], ['Create', 'booking'], ['Calculate', 'bill'], ['Record', 'payment'], ['Generate', 'receipt']]
              .map(([t, s], i) => `<div class="flow__step"><div class="n">0${i + 1}</div><div class="t">${t}<br><span class="faint" style="font-weight:400">${s}</span></div></div>`).join('')}
          </div>
          <p class="sm muted" style="margin-top:14px">Validation runs before saving: required fields must be present, dates and quantities must be valid, and the selected slot must be free.</p>
        </div>

        <div class="card brief-card">
          <h3><span class="n">04</span> Modules</h3>
          <ul>
            <li><b>Customer</b> — stores and retrieves guest information.</li>
            <li><b>Booking</b> — reservations, availability and booking status.</li>
            <li><b>Billing</b> — itemised charges and the final bill.</li>
            <li><b>Payment</b> — mode, amount and payment status.</li>
            <li><b>Report / receipt</b> — booking history, status and confirmation receipt.</li>
          </ul>
        </div>

        <div class="card brief-card">
          <h3><span class="n">05</span> Technology &amp; OOP design</h3>
          <ul>
            <li><b>Java</b> — application logic and object-oriented design.</li>
            <li><b>Java Swing</b> — optional graphical interface.</li>
            <li><b>JDBC + MySQL</b> — persistence of customer, booking, bill and payment records.</li>
            <li><b>Classes</b> — Customer, Booking, Bill, Payment and service classes keeping responsibilities separate.</li>
          </ul>
        </div>

        <div class="card brief-card">
          <h3><span class="n">06</span> Billing calculation</h3>
          <div class="formula">
            <div><span>Service charge</span><span>₹1,000.00</span></div>
            <div><span>Additional items</span><span>+ ₹200.00</span></div>
            <div><span>Subtotal</span><span>₹1,200.00</span></div>
            <div><span>Discount @ 5%</span><span>− ₹60.00</span></div>
            <div><span>Taxable value</span><span>₹1,140.00</span></div>
            <div><span>Tax @ 18%</span><span>+ ₹205.20</span></div>
            <div style="border-top:1px solid var(--line);padding-top:7px;margin-top:2px"><span><b>Final amount</b></span><span><b>₹1,345.20</b></span></div>
          </div>
          <p class="tiny faint" style="margin-top:9px">Rates are configurable in Settings; the engine applies the same order of operations.</p>
        </div>

        <div class="card brief-card">
          <h3><span class="n">07</span> Validation rules</h3>
          <ul>
            <li>Blank mandatory fields are rejected.</li>
            <li>Date, time and quantity values are checked.</li>
            <li>A booked slot cannot be confirmed twice.</li>
            <li>Payment is marked paid only when it is recorded successfully.</li>
            <li>Invalid input surfaces a clear, specific message.</li>
          </ul>
        </div>

        <div class="card brief-card">
          <h3><span class="n">08</span> Scope &amp; future work</h3>
          <ul>
            <li><b>In scope</b> — customer entry, booking CRUD, availability checks, automated billing, payment records, receipts.</li>
            <li><b>Future</b> — role-based login, payment gateway integration, SMS/email notifications, PDF export, multi-branch cloud deployment, mobile app.</li>
          </ul>
        </div>
      </div>

      <div class="card brief-card" style="margin-top:14px">
        <h3><span class="n">09</span> Key takeaway</h3>
        <p class="sm" style="color:var(--ink-soft);line-height:1.65;max-width:88ch">
          A booking is complete only when the reservation details, the generated bill and the payment status are correctly linked. Separating customer, booking, bill and payment responsibilities keeps the system organised, accurate and extensible — which is exactly the structure this working model follows.
        </p>
      </div>
    </div>`;
  }

  /* ============================================================
     VIEW · Settings
     ============================================================ */
  function viewSettings() {
    const s = Store.settings();
    const isNight = document.documentElement.dataset.theme === 'night';
    return `<div class="shell">
      ${pageHead('Settings', 'Business identity, billing defaults and local data.', `
        <button class="btn btn--ghost" data-action="export">${icon('download')} Export data</button>
      `)}

      <div class="set-grid">
        <div class="card set-card">
          <h3>Business identity</h3>
          <p class="desc">Appears on every invoice and receipt.</p>
          <div class="set-rows">
            <div class="field"><label class="field__label">Business name</label><input class="input" id="stBusiness" value="${esc(s.business)}" /></div>
            <div class="field"><label class="field__label">Address</label><input class="input" id="stAddress" value="${esc(s.address)}" /></div>
            <div class="field"><label class="field__label">Phone</label><input class="input" id="stPhone" value="${esc(s.phone)}" /></div>
            <div class="field"><label class="field__label">Email</label><input class="input" id="stEmail" value="${esc(s.email)}" /></div>
            <div class="field"><label class="field__label">GSTIN</label><input class="input input--mono" id="stGstin" value="${esc(s.gstin)}" /></div>
            <button class="btn btn--primary btn--block mt-1" data-action="save-settings">Save identity</button>
          </div>
        </div>

        <div class="set-grid" style="grid-template-columns:1fr;gap:14px">
          <div class="card set-card">
            <h3>Billing defaults</h3>
            <p class="desc">Applied to new bookings; existing bills keep their original rate.</p>
            <div class="set-rows">
              <div class="set-row">
                <div class="k">GST rate<small>Split equally between CGST and SGST</small></div>
                <div class="field" style="width:108px">
                  <input class="input input--mono" id="stGstRate" type="number" step="0.5" min="0" max="50" value="${(s.gstRate * 100).toFixed(1)}" />
                </div>
              </div>
              <div class="set-row">
                <div class="k">Currency<small>Indian Rupee, tax inclusive display</small></div>
                <span class="tag tag--gold">INR ₹</span>
              </div>
              <button class="btn btn--ghost btn--block" data-action="save-billing">Update billing defaults</button>
            </div>
          </div>

          <div class="card set-card">
            <h3>Appearance</h3>
            <p class="desc">Switch between the paper and night palettes.</p>
            <div class="set-rows">
              <div class="set-row">
                <div class="k">Theme</div>
                <div class="segmented">
                  <button data-theme-set="light" class="${!isNight ? 'is-on' : ''}">Paper</button>
                  <button data-theme-set="night" class="${isNight ? 'is-on' : ''}">Night</button>
                </div>
              </div>
              <div class="set-row">
                <div class="k">Demo data<small>Restore sample bookings and guests</small></div>
                <button class="btn btn--danger btn--sm" data-action="reset-data">${icon('refresh')} Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card set-card mt-2">
        <h3>System</h3>
        <p class="desc">This model stores records in your browser so the workflow is fully demonstrable without a server.</p>
        <div class="grid-3">
          <div class="statrow" style="border:none;padding:0"><span class="k">Domain classes</span><span class="v">Customer · Booking · Bill · Payment</span></div>
          <div class="statrow" style="border:none;padding:0"><span class="k">Records stored</span><span class="v">${Store.bookings().length} bookings · ${Store.payments().length} payments</span></div>
          <div class="statrow" style="border:none;padding:0"><span class="k">Version</span><span class="v">v1.0 · OOP model</span></div>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     Invoice document
     ============================================================ */
  function invoiceHTML(bookingOrId) {
    const booking = typeof bookingOrId === 'string' ? Store.bookingById(bookingOrId) : bookingOrId;
    if (!booking) return '';
    const bill = Store.billFor(booking);
    const c = Store.customerById(booking.customerId);
    const svc = Store.serviceById(booking.serviceId);
    const s = Store.settings();
    const pays = Store.paymentsFor(booking.id);
    const invNo = booking.id.replace('BK-', 'INV-');

    return `<div class="invoice-doc">
      <div class="inv-head">
        <div class="inv-brand">
          <div class="inv-brand__mark">${icon('sparkle')}</div>
          <div>
            <h2>${esc(s.business)}</h2>
            <p>${esc(s.address)}<br>${esc(s.phone)} · ${esc(s.email)}<br>GSTIN ${esc(s.gstin)}</p>
          </div>
        </div>
        <div class="inv-meta">
          <h3>Tax invoice</h3>
          <div class="no">${esc(invNo)}</div>
          <div class="dt">Issued ${fmtDate(booking.createdAt || booking.date)}</div>
          <div class="dt">${payPill(bill.paymentStatus)}</div>
        </div>
      </div>

      <div class="inv-parties">
        <div class="inv-party">
          <h4>Billed to</h4>
          <div class="nm">${esc(c ? c.name : 'Guest')}</div>
          <div class="ln">${esc(c ? c.phone : '')}</div>
          <div class="ln">${esc(c ? c.email : '')}</div>
          <div class="id">${esc(c ? c.id : '')}</div>
        </div>
        <div class="inv-party">
          <h4>Reservation</h4>
          <div class="nm">${esc(svc ? svc.name : 'Service')}</div>
          <div class="ln">${fmtDate(booking.date, 'long')}</div>
          <div class="ln">${esc(slotLabel(booking.slot))} · ${esc(booking.guests)} guests</div>
          <div class="id">BOOKING ${esc(booking.id)}</div>
        </div>
      </div>

      <div class="inv-items">
        <table class="inv-tbl">
          <thead><tr><th style="width:52%">Description</th><th class="t-right">Qty</th><th class="t-right">Rate</th><th class="t-right">Amount</th></tr></thead>
          <tbody>
            ${bill.items.map((it) => `<tr>
              <td><div style="font-weight:500">${esc(it.name)}</div><div style="font-size:10px;color:#9a9a90;margin-top:1px">per ${esc(it.unit || 'unit')}</div></td>
              <td class="t-right">${it.qty}</td>
              <td class="t-right">${Billing.money(it.rate)}</td>
              <td class="t-right">${Billing.money(it.amount)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="inv-sum">
        <div class="inv-sum__box">
          <div class="inv-sum__row"><span>Subtotal</span><span>${Billing.money(bill.subtotal)}</span></div>
          ${bill.discount > 0 ? `<div class="inv-sum__row inv-sum__row--disc"><span>Discount${bill.discountType === 'percent' ? ` (${bill.discountValue}%)` : ''}</span><span>− ${Billing.money(bill.discount)}</span></div>` : ''}
          <div class="inv-sum__row"><span>Taxable value</span><span>${Billing.money(bill.taxable)}</span></div>
          <div class="inv-sum__row"><span>CGST @ ${(bill.gstRate * 50).toFixed(1)}%</span><span>${Billing.money(bill.cgst)}</span></div>
          <div class="inv-sum__row"><span>SGST @ ${(bill.gstRate * 50).toFixed(1)}%</span><span>${Billing.money(bill.sgst)}</span></div>
          <div class="inv-sum__row inv-sum__row--total"><span>Total</span><span>${Billing.money(bill.total)}</span></div>
          ${bill.paid > 0 ? `<div class="inv-sum__row"><span>Paid</span><span>− ${Billing.money(bill.paid)}</span></div>` : ''}
          ${bill.balance > 0 ? `<div class="inv-sum__row" style="color:#a4741c;font-weight:600"><span>Balance due</span><span>${Billing.money(bill.balance)}</span></div>` : ''}
        </div>
      </div>

      <div class="inv-words"><b>Amount in words:</b> ${esc(Billing.amountInWords(bill.total))}</div>

      ${pays.length ? `<div style="padding:14px 30px 0">
        <h4 style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#9a9a90;font-weight:700;margin-bottom:6px">Payments recorded</h4>
        <table class="inv-tbl"><tbody>
          ${pays.map((p) => `<tr>
            <td style="font-size:11px">${esc(p.method)} <span style="color:#9a9a90">· ${esc(p.reference || '')}</span></td>
            <td class="t-right" style="color:#9a9a90">${fmtDate(p.date, 'short')}</td>
            <td class="t-right">${Billing.money(p.amount)}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>` : ''}

      <div class="inv-foot">
        <div class="inv-terms">
          <strong>Terms</strong>
          Payment due on or before the reservation date. Cancellations within 24 hours are refundable to the original payment method. This is a computer-generated invoice and does not require a physical signature.
        </div>
        <div class="inv-stamp">
          ${bill.paymentStatus === 'paid' ? '<span class="paid">Paid in full</span>' : bill.paymentStatus === 'partial' ? '<span class="paid" style="color:#a4741c;border-color:#a4741c">Part paid</span>' : '<span class="paid" style="color:#a5432f;border-color:#a5432f">Unpaid</span>'}
          <div class="sig">Authorised signatory</div>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     Drawer · booking detail
     ============================================================ */
  function openBookingDrawer(id) {
    const booking = Store.bookingById(id);
    if (!booking) return;
    const bill = Store.billFor(booking);
    const c = Store.customerById(booking.customerId);
    const svc = Store.serviceById(booking.serviceId);
    const pays = Store.paymentsFor(booking.id);

    $('#drawer').innerHTML = `
      <div class="drawer__head">
        <div>
          <div class="eyebrow">Booking</div>
          <h2 class="display" style="font-size:23px;margin-top:7px">${esc(booking.id)}</h2>
          <div class="row mt-1" style="gap:7px">${statusPill(booking.status)} ${payPill(bill.paymentStatus)}</div>
        </div>
        <button class="iconbtn" data-close-drawer aria-label="Close">${icon('x')}</button>
      </div>
      <div class="drawer__body">
        <div class="card" style="padding:16px;margin-bottom:14px">
          <div class="between">
            <div class="who">
              <div class="avatar ${toneFor(c ? c.name : '')}">${esc(initials(c ? c.name : 'G'))}</div>
              <div><div class="who__name">${esc(c ? c.name : 'Guest')}</div>
                <div class="who__meta">${esc(c ? c.phone : '')} · ${esc(c ? c.tier : '')}</div></div>
            </div>
            <button class="btn btn--quiet btn--sm" data-open-customer="${esc(booking.customerId)}">Profile ${icon('right')}</button>
          </div>
          <div class="divider"></div>
          <div class="grid-2" style="gap:10px">
            <div class="col"><span class="tiny faint">Service</span><span class="sm strong">${esc(svc ? svc.name : '—')}</span></div>
            <div class="col"><span class="tiny faint">Category</span><span class="sm">${esc(svc ? svc.category : '—')}</span></div>
            <div class="col"><span class="tiny faint">Date</span><span class="sm">${fmtDate(booking.date)}</span></div>
            <div class="col"><span class="tiny faint">Slot</span><span class="sm">${esc(slotLabel(booking.slot))}</span></div>
            <div class="col"><span class="tiny faint">Quantity</span><span class="sm">${esc(booking.qty)} ${esc(svc ? svc.unit : '')}${booking.qty > 1 ? 's' : ''}</span></div>
            <div class="col"><span class="tiny faint">Guests</span><span class="sm">${esc(booking.guests)}</span></div>
          </div>
          ${booking.notes ? `<div class="divider"></div><div class="col"><span class="tiny faint">Notes</span><span class="sm" style="color:var(--ink-soft)">${esc(booking.notes)}</span></div>` : ''}
        </div>

        <div class="card" style="padding:16px;margin-bottom:14px">
          <div class="between" style="margin-bottom:10px">
            <span class="card__title">Bill</span>
            <span class="tag">${esc(booking.id.replace('BK-', 'INV-'))}</span>
          </div>
          ${bill.items.map((it) => `<div class="bill-line bill-line--item"><span class="k">${esc(it.name)} ${it.qty > 1 ? `<span class="faint">×${it.qty}</span>` : ''}</span><span class="v">${Billing.money(it.amount)}</span></div>`).join('')}
          <div class="bill-line bill-line--sub"><span class="k">Subtotal</span><span class="v">${Billing.money(bill.subtotal)}</span></div>
          ${bill.discount > 0 ? `<div class="bill-line bill-line--disc"><span class="k">Discount</span><span class="v">− ${Billing.money(bill.discount)}</span></div>` : ''}
          <div class="bill-line bill-line--muted"><span class="k">CGST + SGST</span><span class="v">${Billing.money(bill.tax)}</span></div>
          <div class="bill-total"><span class="k">Total</span><span class="v">${Billing.money(bill.total)}</span></div>
          <div class="bill-line" style="margin-top:8px"><span class="k">Paid</span><span class="v" style="color:var(--ok)">${Billing.money(bill.paid)}</span></div>
          <div class="bill-line"><span class="k strong">Balance due</span><span class="v strong" style="color:${bill.balance > 0 ? 'var(--brass-deep)' : 'var(--ink-faint)'}">${Billing.money(bill.balance)}</span></div>
        </div>

        <div class="card" style="padding:16px">
          <div class="between" style="margin-bottom:8px">
            <span class="card__title">Payments</span>
            <button class="btn btn--quiet btn--sm" data-pay="${esc(booking.id)}">${icon('plus')} Record</button>
          </div>
          ${pays.length ? pays.map((p) => `
            <div class="statrow">
              <span class="k">${icon('card')} ${esc(p.method)}<span class="tiny faint" style="margin-left:6px">${esc(p.reference || '')}</span></span>
              <span class="v">${Billing.money(p.amount)}</span>
            </div>`).join('') : `<p class="sm faint" style="padding:6px 0">No payments recorded yet.</p>`}
        </div>
      </div>
      <div class="drawer__foot">
        <button class="btn btn--brass" data-pay="${esc(booking.id)}">${icon('wallet')} Record payment</button>
        <button class="btn btn--ghost" data-invoice="${esc(booking.id)}">${icon('receipt')} Invoice</button>
        <div class="spacer"></div>
        ${booking.status !== 'completed' ? `<button class="btn btn--ghost btn--sm" data-status="${esc(booking.id)}:completed">Mark complete</button>` : ''}
        ${booking.status !== 'cancelled' ? `<button class="btn btn--danger btn--sm" data-status="${esc(booking.id)}:cancelled">Cancel</button>` : `<button class="btn btn--ghost btn--sm" data-status="${esc(booking.id)}:confirmed">Restore</button>`}
      </div>
    `;
    showDrawer();
  }

  function openCustomerDrawer(id) {
    const c = Store.customerById(id);
    if (!c) return;
    const rows = billsList().filter((r) => r.booking.customerId === id).sort((a, b) => b.booking.date.localeCompare(a.booking.date));
    const lifetime = rows.filter((r) => r.booking.status !== 'cancelled').reduce((s, r) => s + r.bill.total, 0);
    const outstanding = rows.reduce((s, r) => s + (r.booking.status !== 'cancelled' ? r.bill.balance : 0), 0);

    $('#drawer').innerHTML = `
      <div class="drawer__head">
        <div class="who" style="gap:12px">
          <div class="cust__av" style="width:44px;height:44px;flex:0 0 44px;font-size:18px">${esc(initials(c.name))}</div>
          <div>
            <h2 class="display" style="font-size:21px">${esc(c.name)}</h2>
            <div class="tiny faint mt-0">${esc(c.id)} · ${esc(c.tier)} member</div>
          </div>
        </div>
        <button class="iconbtn" data-close-drawer aria-label="Close">${icon('x')}</button>
      </div>
      <div class="drawer__body">
        <div class="grid-2" style="gap:9px;margin-bottom:14px">
          <div class="card" style="padding:13px"><span class="tiny faint">Lifetime billed</span><div class="mono" style="font-size:16px;margin-top:3px">${Billing.money(lifetime)}</div></div>
          <div class="card" style="padding:13px"><span class="tiny faint">Outstanding</span><div class="mono" style="font-size:16px;margin-top:3px;color:${outstanding > 0 ? 'var(--brass-deep)' : 'var(--ink-faint)'}">${Billing.money(outstanding)}</div></div>
        </div>

        <div class="card" style="padding:16px;margin-bottom:14px">
          <div class="col" style="gap:9px">
            <div class="row sm">${icon('phone')} <span>${esc(c.phone)}</span></div>
            <div class="row sm">${icon('mail')} <span>${esc(c.email || '—')}</span></div>
            <div class="row sm">${icon('pin')} <span>${esc(c.city || '—')}</span></div>
            <div class="row sm">${icon('clock')} <span>Guest since ${fmtDate(c.createdAt)}</span></div>
          </div>
        </div>

        <div class="card" style="padding:16px">
          <div class="between" style="margin-bottom:10px">
            <span class="card__title">Bookings (${rows.length})</span>
            <button class="btn btn--quiet btn--sm" data-action="new-booking">${icon('plus')} New</button>
          </div>
          ${rows.length ? `<div class="timeline">
            ${rows.map((r) => `<div class="tl-item" data-open-booking="${r.booking.id}">
              <div class="tl-date"><div class="d num">${parseISO(r.booking.date).getDate()}</div><div class="m">${MONTHS[parseISO(r.booking.date).getMonth()]}</div></div>
              <div class="tl-main">
                <div class="tl-title trunc">${esc(r.service ? r.service.name : '')}</div>
                <div class="tl-meta">${statusPill(r.booking.status)}<span class="tl-dot"></span><span>${Billing.money(r.bill.total)}</span></div>
              </div>
              <span class="tl-amt">${r.bill.balance > 0 ? `<span style="color:var(--brass-deep)">${Billing.money(r.bill.balance)}</span>` : icon('check')}</span>
            </div>`).join('')}
          </div>` : `<p class="sm faint">No bookings yet.</p>`}
        </div>
      </div>
      <div class="drawer__foot">
        <button class="btn btn--primary" data-action="new-booking">${icon('plus')} New booking</button>
        <button class="btn btn--ghost" data-edit-customer="${esc(c.id)}">${icon('edit')} Edit</button>
      </div>
    `;
    showDrawer();
  }

  /* ============================================================
     Overlays
     ============================================================ */
  function showDrawer() {
    $('#scrim').hidden = false;
    $('#drawer').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    $('#drawer').hidden = true;
    if ($('#modal').hidden) {
      $('#scrim').hidden = true;
      document.body.style.overflow = '';
    }
  }
  function showModal(html) {
    $('#modal').innerHTML = `<div class="modal__box">${html}</div>`;
    $('#modal').hidden = false;
    if ($('#drawer').hidden) $('#scrim').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $('#modal').hidden = true;
    $('#modal').innerHTML = '';
    if ($('#drawer').hidden) {
      $('#scrim').hidden = true;
      document.body.style.overflow = '';
    }
  }

  function openInvoiceModal(id) {
    const b = Store.bookingById(id);
    if (!b) return;
    ui.currentInvoice = id;
    showModal(`
      <div class="modal__box" style="width:min(860px,100%)">
        <div class="modal__head no-print">
          <div class="between">
            <div>
              <h3>Invoice ${esc(b.id.replace('BK-', 'INV-'))}</h3>
              <p>Generated from booking ${esc(b.id)}</p>
            </div>
            <button class="iconbtn" data-close-modal aria-label="Close">${icon('x')}</button>
          </div>
        </div>
        <div class="modal__body" style="padding-top:16px">${invoiceHTML(b)}</div>
        <div class="modal__foot no-print" style="border-top:1px solid var(--line-soft)">
          <button class="btn btn--ghost" data-close-modal>Close</button>
          <button class="btn btn--ghost" data-print="${esc(b.id)}">${icon('print')} Print</button>
          <button class="btn btn--primary" data-pay="${esc(b.id)}">${icon('wallet')} Record payment</button>
        </div>
      </div>`);
    $$('#modal .modal__box').forEach((el) => { el.style.maxHeight = 'calc(100vh - 40px)'; });
  }

  function openPaymentModal(bookingId) {
    const options = Store.bookings().filter((b) => b.status !== 'cancelled');
    const preselect = bookingId || (options[0] ? options[0].id : '');
    const b = preselect ? Store.bookingById(preselect) : null;
    const bill = b ? Store.billFor(b) : null;

    showModal(`
      <div class="modal__box">
        <div class="modal__head">
          <div class="between">
            <div><h3>Record payment</h3><p>Settlement is written to the bill immediately.</p></div>
            <button class="iconbtn" data-close-modal aria-label="Close">${icon('x')}</button>
          </div>
        </div>
        <div class="modal__body">
          <div class="form-grid">
            <div class="field span-2">
              <label class="field__label">Booking</label>
              <select class="select" id="pmBooking">
                ${options.map((o) => {
                  const cc = Store.customerById(o.customerId);
                  const bb = Store.billFor(o);
                  return `<option value="${o.id}" ${o.id === preselect ? 'selected' : ''}>${esc(o.id)} · ${esc(cc ? cc.name : '')} · balance ${Billing.money(bb.balance)}</option>`;
                }).join('')}
              </select>
            </div>
            <div class="field">
              <label class="field__label">Amount <span class="req">*</span></label>
              <input class="input input--mono" type="number" id="pmAmount" value="${bill ? bill.balance.toFixed(2) : '0.00'}" min="0" step="0.01" />
            </div>
            <div class="field">
              <label class="field__label">Method</label>
              <select class="select" id="pmMethod">
                <option>UPI</option><option>Card</option><option>Cash</option><option>Bank Transfer</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label">Reference</label>
              <input class="input input--mono" id="pmRef" placeholder="Auto-generated" />
            </div>
            <div class="field">
              <label class="field__label">Date</label>
              <input class="input" type="date" id="pmDate" value="${Store.todayISO()}" />
            </div>
            <div class="field span-2">
              <label class="field__label">Note</label>
              <input class="input" id="pmNote" placeholder="e.g. balance settlement at check-in" />
            </div>
          </div>
          <div class="card" style="padding:12px;margin-top:14px;background:var(--card-warm)" id="pmSummary"></div>
        </div>
        <div class="modal__foot">
          <button class="btn btn--ghost" data-close-modal>Cancel</button>
          <button class="btn btn--brass" data-save-payment>${icon('check')} Record payment</button>
        </div>
      </div>`);

    const refresh = () => {
      const bid = $('#pmBooking').value;
      const bk = Store.bookingById(bid);
      const bl = bk ? Store.billFor(bk) : null;
      const sum = $('#pmSummary');
      if (!bl || !sum) return;
      const entered = Number($('#pmAmount').value) || 0;
      const after = Math.max(bl.balance - entered, 0);
      sum.innerHTML = `<div class="between">
        <span class="sm muted">Total ${Billing.money(bl.total)} · paid ${Billing.money(bl.paid)}</span>
        <span class="sm">Balance after: <b class="mono" style="color:${after > 0 ? 'var(--brass-deep)' : 'var(--ok)'}">${Billing.money(after)}</b></span>
      </div>`;
    };

    $('#pmBooking').addEventListener('change', () => {
      const bk = Store.bookingById($('#pmBooking').value);
      const bl = bk ? Store.billFor(bk) : null;
      $('#pmAmount').value = bl ? bl.balance.toFixed(2) : '0.00';
      refresh();
    });
    $('#pmAmount').addEventListener('input', refresh);
    refresh();
  }

  function openCustomerModal(id) {
    const editing = id ? Store.customerById(id) : null;
    showModal(`
      <div class="modal__box">
        <div class="modal__head">
          <div class="between">
            <div><h3>${editing ? 'Edit customer' : 'New customer'}</h3><p>Contact details are used on invoices and receipts.</p></div>
            <button class="iconbtn" data-close-modal aria-label="Close">${icon('x')}</button>
          </div>
        </div>
        <div class="modal__body">
          <div class="form-grid">
            <div class="field span-2" id="mName">
              <label class="field__label">Full name <span class="req">*</span></label>
              <input class="input" id="cmName" value="${editing ? esc(editing.name) : ''}" placeholder="e.g. Ananya Menon" />
              <span class="field__err">Name is required</span>
            </div>
            <div class="field" id="mPhone">
              <label class="field__label">Phone <span class="req">*</span></label>
              <input class="input" id="cmPhone" value="${editing ? esc(editing.phone) : ''}" placeholder="+91 98470 00000" />
              <span class="field__err">Enter a valid phone</span>
            </div>
            <div class="field">
              <label class="field__label">Email</label>
              <input class="input" id="cmEmail" type="email" value="${editing ? esc(editing.email) : ''}" placeholder="guest@example.com" />
            </div>
            <div class="field">
              <label class="field__label">City</label>
              <input class="input" id="cmCity" value="${editing ? esc(editing.city) : ''}" placeholder="Kochi" />
            </div>
            <div class="field">
              <label class="field__label">Tier</label>
              <select class="select" id="cmTier">
                ${['Silver', 'Gold', 'Platinum'].map((t) => `<option ${editing && editing.tier === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="field span-2">
              <label class="field__label">Notes</label>
              <textarea class="textarea" id="cmNotes" placeholder="Preferences, allergies, special requests…">${editing ? esc(editing.notes) : ''}</textarea>
            </div>
          </div>
        </div>
        <div class="modal__foot">
          <button class="btn btn--ghost" data-close-modal>Cancel</button>
          <button class="btn btn--primary" data-save-customer="${editing ? esc(editing.id) : ''}">${icon('check')} ${editing ? 'Save changes' : 'Create customer'}</button>
        </div>
      </div>`);
  }

  function openConfirm(title, copy, onYes, yesLabel = 'Confirm') {
    showModal(`
      <div class="modal__box" style="width:min(420px,100%)">
        <div class="modal__head">
          <h3>${esc(title)}</h3>
          <p>${esc(copy)}</p>
        </div>
        <div class="modal__foot">
          <button class="btn btn--ghost" data-close-modal>Cancel</button>
          <button class="btn btn--danger" id="confirmYes">${esc(yesLabel)}</button>
        </div>
      </div>`);
    $('#confirmYes').addEventListener('click', () => { closeModal(); onYes(); });
  }

  /* ============================================================
     Actions
     ============================================================ */
  function saveCustomer(id) {
    const name = $('#cmName').value.trim();
    const phone = $('#cmPhone').value.trim();
    let ok = true;
    if (!name) { $('#mName').classList.add('field--err'); ok = false; } else $('#mName').classList.remove('field--err');
    if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) { $('#mPhone').classList.add('field--err'); ok = false; } else $('#mPhone').classList.remove('field--err');
    if (!ok) return;
    const payload = {
      name, phone,
      email: $('#cmEmail').value.trim(),
      city: $('#cmCity').value.trim(),
      tier: $('#cmTier').value,
      notes: $('#cmNotes').value.trim(),
    };
    if (id) {
      Store.updateCustomer(id, payload);
      toast('Customer updated');
    } else {
      const c = Store.createCustomer(payload);
      toast(`${c.name} added`);
    }
    closeModal();
    render();
  }

  function savePayment() {
    const bookingId = $('#pmBooking').value;
    const amount = Number($('#pmAmount').value) || 0;
    if (!bookingId) { toast('Choose a booking', 'bad'); return; }
    if (amount <= 0) { toast('Enter an amount greater than zero', 'bad'); return; }
    Store.recordPayment(bookingId, {
      amount,
      method: $('#pmMethod').value,
      reference: $('#pmRef').value.trim() || undefined,
      note: $('#pmNote').value.trim(),
      date: $('#pmDate').value || Store.todayISO(),
    });
    closeModal();
    toast(`${Billing.money(amount)} recorded against ${bookingId}`);
    render();
    if (!$('#drawer').hidden && $('#drawer').innerHTML.includes(bookingId)) openBookingDrawer(bookingId);
  }

  function printInvoice(id) {
    const target = id || ui.currentInvoice || (Store.bookings()[0] && Store.bookings()[0].id);
    if (!target) { toast('Nothing to print yet', 'bad'); return; }
    $('#printArea').innerHTML = invoiceHTML(target);
    window.print();
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings: Store.settings(),
      customers: Store.customers(),
      bookings: Store.bookings().map((b) => ({ ...b, bill: Store.billFor(b) })),
      payments: Store.payments(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurelia-booking-billing-${Store.todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Ledger exported as JSON');
  }

  /* ============================================================
     Search
     ============================================================ */
  function buildSearchIndex() {
    const items = [];
    Store.bookings().forEach((b) => {
      const c = Store.customerById(b.customerId);
      const s = Store.serviceById(b.serviceId);
      items.push({
        type: 'booking', id: b.id,
        title: `${b.id} · ${c ? c.name : 'Guest'}`,
        sub: `${s ? s.name : ''} · ${fmtDate(b.date, 'short')} · ${slotName(b.slot)}`,
        icon: 'calendar',
      });
    });
    Store.customers().forEach((c) => {
      items.push({
        type: 'customer', id: c.id, title: c.name, sub: `${c.id} · ${c.phone}`, icon: 'user',
      });
    });
    return items;
  }

  function openSearch(q = '') {
    const panel = $('#searchPanel');
    const all = buildSearchIndex();
    const query = q.trim().toLowerCase();
    const results = (query ? all.filter((r) => (r.title + ' ' + r.sub).toLowerCase().includes(query)) : all).slice(0, 8);
    ui.searchCursor = 0;
    panel.innerHTML = `
      <div class="searchpanel__head">${query ? `Results for “${esc(q)}”` : 'Jump to'}</div>
      <div class="searchpanel__list">
        ${results.length ? results.map((r, i) => `
          <div class="sres ${i === 0 ? 'is-cursor' : ''}" data-search-result="${esc(r.type)}:${esc(r.id)}">
            <span class="sres__icon">${icon(r.icon)}</span>
            <div class="sres__main"><div class="sres__t">${esc(r.title)}</div><div class="sres__s">${esc(r.sub)}</div></div>
            <span class="sres__k">${r.type === 'booking' ? 'BK' : 'CU'}</span>
          </div>`).join('') : `<div style="padding:22px;text-align:center" class="sm faint">No matches — try a name, booking ID or service.</div>`}
      </div>`;
    panel.hidden = false;
    ui.searchOpen = true;
    ui.lastResults = results;
  }
  function closeSearch() {
    $('#searchPanel').hidden = true;
    ui.searchOpen = false;
  }

  /* ============================================================
     Router / render
     ============================================================ */
  const VIEWS = {
    dashboard: viewDashboard,
    bookings: viewBookings,
    new: viewNew,
    customers: viewCustomers,
    invoices: viewInvoices,
    payments: viewPayments,
    reports: viewReports,
    brief: viewBrief,
    settings: viewSettings,
  };

  function render() {
    const view = VIEWS[ui.route] || viewDashboard;
    const canvas = $('#canvas');
    canvas.innerHTML = view();
    hydrateIcons(canvas);

    $$('.navitem').forEach((a) => a.classList.toggle('is-active', a.dataset.view === ui.route));

    if (ui.route === 'new') bindNewBooking();
    if (ui.route === 'bookings') {
      const s = $('#bookingSearch');
      if (s) {
        s.addEventListener('input', (e) => {
          ui.filterQ = e.target.value;
          const pos = e.target.selectionStart;
          render();
          const el = $('#bookingSearch');
          if (el) { el.focus(); el.setSelectionRange(pos, pos); }
        });
      }
    }
    if (ui.route === 'customers') {
      const s = $('#customerSearch');
      if (s) {
        s.addEventListener('input', (e) => {
          ui.filterQ = e.target.value;
          const pos = e.target.selectionStart;
          render();
          const el = $('#customerSearch');
          if (el) { el.focus(); el.setSelectionRange(pos, pos); }
        });
      }
    }
    canvas.scrollTop = 0;
  }

  function navigate(route) {
    ui.route = VIEWS[route] ? route : 'dashboard';
    ui.filterQ = '';
    if (route !== 'invoices' && route !== 'bookings') ui.filterStatus = 'all';
    if (location.hash !== '#/' + route) history.pushState(null, '', '#/' + route);
    closeDrawer();
    render();
    $('#rail').classList.remove('is-open');
    hydrateNavBadge();
  }

  function hydrateNavBadge() {
    const badge = $('#navBookingBadge');
    if (!badge) return;
    const active = Store.bookings().filter((b) => b.status !== 'cancelled').length;
    badge.textContent = String(active);
    badge.dataset.tone = 'alert';
  }

  function routeFromHash() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    return h || 'dashboard';
  }

  /* ============================================================
     Global events
     ============================================================ */
  document.addEventListener('click', (e) => {
    const t = e.target;

    const link = t.closest('[data-link]');
    if (link) { navigate(link.dataset.link); return; }

    const nav = t.closest('.navitem');
    if (nav) { e.preventDefault(); navigate(nav.dataset.view); return; }

    if (t.closest('#menuBtn')) { $('#rail').classList.toggle('is-open'); return; }

    if (t.closest('[data-close-drawer]')) { closeDrawer(); return; }
    if (t.closest('[data-close-modal]')) { closeModal(); return; }

    if (t.closest('#scrim')) {
      if (!$('#modal').hidden) closeModal();
      else closeDrawer();
      return;
    }
    if (t.closest('#modal') && !t.closest('.modal__box')) { closeModal(); return; }

    const bookingEl = t.closest('[data-open-booking]');
    if (bookingEl) { openBookingDrawer(bookingEl.dataset.openBooking); return; }

    const custEl = t.closest('[data-open-customer]');
    if (custEl) { openCustomerDrawer(custEl.dataset.openCustomer); return; }

    const invEl = t.closest('[data-open-invoice]');
    if (invEl) { openInvoiceModal(invEl.dataset.openInvoice); return; }

    const invBtn = t.closest('[data-invoice]');
    if (invBtn) { openInvoiceModal(invBtn.dataset.invoice); return; }

    const payBtn = t.closest('[data-pay]');
    if (payBtn) { openPaymentModal(payBtn.dataset.pay); return; }

    const printBtn = t.closest('[data-print]');
    if (printBtn) { printInvoice(printBtn.dataset.print); return; }

    const statusBtn = t.closest('[data-status]');
    if (statusBtn) {
      const [id, status] = statusBtn.dataset.status.split(':');
      if (status === 'cancelled') {
        openConfirm('Cancel this booking?', 'The reservation will be marked cancelled and its slot released. Recorded payments remain in the ledger.', () => {
          Store.setBookingStatus(id, 'cancelled');
          toast(`${id} cancelled`, 'bad');
          render(); openBookingDrawer(id);
        }, 'Cancel booking');
      } else {
        Store.setBookingStatus(id, status);
        toast(`${id} marked ${status}`);
        render(); openBookingDrawer(id);
      }
      return;
    }

    const editCust = t.closest('[data-edit-customer]');
    if (editCust) { openCustomerModal(editCust.dataset.editCustomer); return; }

    const filterBtn = t.closest('[data-filter-status]');
    if (filterBtn) { ui.filterStatus = filterBtn.dataset.filterStatus; render(); return; }

    const themeBtn = t.closest('[data-theme-set]');
    if (themeBtn) {
      setTheme(themeBtn.dataset.themeSet);
      render();
      return;
    }

    const sres = t.closest('[data-search-result]');
    if (sres) {
      const [type, id] = sres.dataset.searchResult.split(':');
      closeSearch();
      if (type === 'booking') openBookingDrawer(id);
      else openCustomerDrawer(id);
      return;
    }

    const action = t.closest('[data-action]');
    if (action) {
      const a = action.dataset.action;
      if (a === 'new-booking') navigate('new');
      else if (a === 'add-customer') openCustomerModal();
      else if (a === 'record-payment') openPaymentModal();
      else if (a === 'create-booking') createBooking();
      else if (a === 'save-payment') savePayment();
      else if (a === 'export') exportData();
      else if (a === 'save-settings') {
        Store.updateSettings({
          business: $('#stBusiness').value.trim(),
          address: $('#stAddress').value.trim(),
          phone: $('#stPhone').value.trim(),
          email: $('#stEmail').value.trim(),
          gstin: $('#stGstin').value.trim(),
        });
        toast('Business identity saved');
        render();
      } else if (a === 'save-billing') {
        const rate = Number($('#stGstRate').value);
        if (Number.isNaN(rate) || rate < 0 || rate > 50) { toast('GST rate must be between 0 and 50', 'bad'); return; }
        Store.updateSettings({ gstRate: rate / 100 });
        toast(`GST rate set to ${rate}%`);
        render();
      } else if (a === 'reset-data') {
        openConfirm('Reset demo data?', 'All bookings, customers and payments in this browser will be replaced with the original sample set.', () => {
          Store.reset();
          toast('Demo data restored');
          navigate('dashboard');
        }, 'Reset data');
      }
      return;
    }

    const saveCust = t.closest('[data-save-customer]');
    if (saveCust) { saveCustomer(saveCust.dataset.saveCustomer || null); return; }

    if (t.closest('#printCtxBtn')) { printInvoice(); return; }

    if (!t.closest('.searchpanel') && !t.closest('.topbar__search')) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#globalSearch').focus();
      openSearch($('#globalSearch').value);
      return;
    }
    if (e.key === 'Escape') {
      if (ui.searchOpen) { closeSearch(); return; }
      if (!$('#modal').hidden) { closeModal(); return; }
      if (!$('#drawer').hidden) { closeDrawer(); return; }
    }
    if (ui.searchOpen) {
      const list = $$('.sres');
      if (!list.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        ui.searchCursor = (ui.searchCursor + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
        list.forEach((el, i) => el.classList.toggle('is-cursor', i === ui.searchCursor));
        list[ui.searchCursor].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const el = list[ui.searchCursor];
        if (el) el.click();
      }
    }
  });

  const searchInput = $('#globalSearch');
  searchInput.addEventListener('input', (e) => openSearch(e.target.value));
  searchInput.addEventListener('focus', (e) => openSearch(e.target.value));

  window.addEventListener('popstate', () => {
    ui.route = routeFromHash();
    render();
    hydrateNavBadge();
  });

  /* ── Theme ─────────────────────────────────────────────── */
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('aurelia.theme', theme); } catch (err) { /* noop */ }
  }

  /* ── Boot ──────────────────────────────────────────────── */
  function boot() {
    try {
      const saved = localStorage.getItem('aurelia.theme');
      if (saved) document.documentElement.dataset.theme = saved;
    } catch (err) { /* noop */ }

    const now = new Date();
    $('#topbarDate').textContent = `${DAYS[now.getDay()]} · ${now.getDate()} ${MONTHS_LONG[now.getMonth()]} ${now.getFullYear()}`;

    ui.route = routeFromHash();
    hydrateIcons(document);
    render();
    hydrateNavBadge();
  }

  boot();
})();
