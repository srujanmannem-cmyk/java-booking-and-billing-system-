/* ============================================================
   Store — domain model (Customer, Service, Booking, Bill, Payment)
   Mirrors the OOP design in the project deck. Persists to localStorage.
   ============================================================ */
const Store = (() => {
  const KEY = 'aurelia.booking.v1';

  const SLOTS = [
    { id: 'MORN', label: 'Morning', time: '09:00 – 12:00' },
    { id: 'AFTN', label: 'Afternoon', time: '12:00 – 16:00' },
    { id: 'EVEN', label: 'Evening', time: '16:00 – 20:00' },
    { id: 'NIGHT', label: 'Night', time: '20:00 – 23:00' },
  ];

  const SERVICES = [
    { id: 'SV-01', name: 'Deluxe Room', category: 'Stay', rate: 4500, unit: 'night', capacity: 2, icon: 'bed', tint: 'sage' },
    { id: 'SV-02', name: 'Premium Suite', category: 'Stay', rate: 9800, unit: 'night', capacity: 3, icon: 'crown', tint: 'brass' },
    { id: 'SV-03', name: 'Banquet Hall', category: 'Event', rate: 65000, unit: 'event', capacity: 250, icon: 'sparkle', tint: 'plum' },
    { id: 'SV-04', name: 'Conference Room', category: 'Event', rate: 12000, unit: 'session', capacity: 40, icon: 'board', tint: 'ocean' },
    { id: 'SV-05', name: 'Poolside Cabana', category: 'Leisure', rate: 3200, unit: 'day', capacity: 6, icon: 'sun', tint: 'ocean' },
    { id: 'SV-06', name: 'Signature Spa Ritual', category: 'Leisure', rate: 5400, unit: 'session', capacity: 2, icon: 'leaf', tint: 'sage' },
    { id: 'SV-07', name: 'Chef’s Table Dining', category: 'Dining', rate: 3800, unit: 'guest', capacity: 12, icon: 'cup', tint: 'plum' },
    { id: 'SV-08', name: 'Airport Transfer', category: 'Travel', rate: 2200, unit: 'trip', capacity: 4, icon: 'car', tint: 'brass' },
  ];

  const ADDONS = [
    { id: 'AD-01', name: 'Welcome Decoration', rate: 1500, unit: 'flat' },
    { id: 'AD-02', name: 'Photography Coverage', rate: 8500, unit: 'flat' },
    { id: 'AD-03', name: 'Live Music Ensemble', rate: 11000, unit: 'flat' },
    { id: 'AD-04', name: 'Extra Bed', rate: 900, unit: 'unit' },
    { id: 'AD-05', name: 'Airport Pickup', rate: 2200, unit: 'trip' },
    { id: 'AD-06', name: 'Late Checkout', rate: 1200, unit: 'flat' },
  ];

  const SETTINGS = {
    business: 'Aurélia Resort & Banquet',
    tagline: 'Reservations · Billing · Payments',
    address: '12 Marine Crescent, Kochi, Kerala 682001',
    phone: '+91 484 400 1932',
    email: 'reservations@aurelia.example',
    gstin: '32ABCDE1234F1Z5',
    gstRate: 0.18,
    currency: 'INR',
  };

  const pad4 = (n) => String(n).padStart(4, '0');
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const addDays = (iso, days) => {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  let state = null;

  function blank() {
    return {
      customers: [],
      bookings: [],
      payments: [],
      counter: { booking: 1023, customer: 0, payment: 0 },
      settings: { ...SETTINGS },
      seeded: false,
    };
  }

  function seed(s) {
    const people = [
      { name: 'Ananya Menon', phone: '+91 98470 21143', email: 'ananya.menon@example.com', city: 'Kochi', tier: 'Gold' },
      { name: 'Rohit Sharma', phone: '+91 99610 88204', email: 'rohit.sharma@example.com', city: 'Bengaluru', tier: 'Platinum' },
      { name: 'Meera Krishnan', phone: '+91 94470 55108', email: 'meera.k@example.com', city: 'Thrissur', tier: 'Silver' },
      { name: 'Arjun Nair', phone: '+91 97440 31277', email: 'arjun.nair@example.com', city: 'Kozhikode', tier: 'Gold' },
      { name: 'Divya Pillai', phone: '+91 90370 66412', email: 'divya.pillai@example.com', city: 'Kochi', tier: 'Silver' },
      { name: 'Karthik Iyer', phone: '+91 98950 10238', email: 'karthik.iyer@example.com', city: 'Chennai', tier: 'Platinum' },
      { name: 'Sneha Thomas', phone: '+91 94950 77301', email: 'sneha.thomas@example.com', city: 'Kottayam', tier: 'Gold' },
      { name: 'Vikram Reddy', phone: '+91 90000 45812', email: 'vikram.reddy@example.com', city: 'Hyderabad', tier: 'Silver' },
    ];
    people.forEach((p, i) => {
      s.customers.push({ id: 'CU-' + pad4(i + 1), ...p, notes: '', createdAt: addDays(todayISO(), -90 + i * 4) });
    });
    s.counter.customer = people.length;

    const plans = [
      { c: 0, svc: 'SV-03', offset: 24, slot: 'EVEN', qty: 1, guests: 180, status: 'confirmed', addons: ['AD-01', 'AD-02'], disc: 8, paidRatio: 1 },
      { c: 1, svc: 'SV-02', offset: 3, slot: 'AFTN', qty: 2, guests: 2, status: 'confirmed', addons: ['AD-04'], disc: 5, paidRatio: 0.5 },
      { c: 2, svc: 'SV-06', offset: 1, slot: 'MORN', qty: 1, guests: 2, status: 'confirmed', addons: [], disc: 0, paidRatio: 1 },
      { c: 3, svc: 'SV-01', offset: 6, slot: 'NIGHT', qty: 3, guests: 2, status: 'pending', addons: ['AD-06'], disc: 0, paidRatio: 0 },
      { c: 4, svc: 'SV-04', offset: 2, slot: 'MORN', qty: 1, guests: 32, status: 'confirmed', addons: ['AD-05'], disc: 10, paidRatio: 1 },
      { c: 5, svc: 'SV-07', offset: -2, slot: 'EVEN', qty: 4, guests: 4, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 6, svc: 'SV-05', offset: 8, slot: 'AFTN', qty: 1, guests: 5, status: 'pending', addons: [], disc: 5, paidRatio: 0 },
      { c: 7, svc: 'SV-02', offset: -6, slot: 'EVEN', qty: 1, guests: 2, status: 'completed', addons: ['AD-02', 'AD-03'], disc: 12, paidRatio: 1 },
      { c: 1, svc: 'SV-08', offset: -12, slot: 'NIGHT', qty: 2, guests: 2, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 2, svc: 'SV-01', offset: -18, slot: 'AFTN', qty: 1, guests: 1, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 0, svc: 'SV-04', offset: -24, slot: 'MORN', qty: 2, guests: 25, status: 'completed', addons: ['AD-05'], disc: 5, paidRatio: 1 },
      { c: 4, svc: 'SV-07', offset: -30, slot: 'NIGHT', qty: 2, guests: 2, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 6, svc: 'SV-03', offset: -40, slot: 'EVEN', qty: 1, guests: 140, status: 'completed', addons: ['AD-01'], disc: 0, paidRatio: 1 },
      { c: 3, svc: 'SV-06', offset: -52, slot: 'AFTN', qty: 2, guests: 2, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 5, svc: 'SV-01', offset: 12, slot: 'EVEN', qty: 2, guests: 3, status: 'confirmed', addons: [], disc: 0, paidRatio: 0.35 },
      { c: 1, svc: 'SV-03', offset: -48, slot: 'EVEN', qty: 1, guests: 210, status: 'completed', addons: ['AD-01', 'AD-02', 'AD-03'], disc: 10, paidRatio: 1 },
      { c: 0, svc: 'SV-02', offset: -58, slot: 'MORN', qty: 2, guests: 2, status: 'completed', addons: ['AD-04'], disc: 5, paidRatio: 1 },
      { c: 6, svc: 'SV-04', offset: -63, slot: 'AFTN', qty: 1, guests: 28, status: 'completed', addons: ['AD-05'], disc: 0, paidRatio: 1 },
      { c: 4, svc: 'SV-01', offset: -71, slot: 'NIGHT', qty: 2, guests: 2, status: 'completed', addons: ['AD-06'], disc: 0, paidRatio: 1 },
      { c: 7, svc: 'SV-06', offset: -78, slot: 'MORN', qty: 1, guests: 2, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 2, svc: 'SV-03', offset: -86, slot: 'EVEN', qty: 1, guests: 160, status: 'completed', addons: ['AD-01'], disc: 12, paidRatio: 1 },
      { c: 5, svc: 'SV-07', offset: -94, slot: 'EVEN', qty: 6, guests: 6, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 0, svc: 'SV-05', offset: -103, slot: 'AFTN', qty: 2, guests: 8, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 3, svc: 'SV-08', offset: -112, slot: 'NIGHT', qty: 3, guests: 3, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 6, svc: 'SV-02', offset: -121, slot: 'EVEN', qty: 1, guests: 2, status: 'completed', addons: ['AD-02'], disc: 8, paidRatio: 1 },
      { c: 1, svc: 'SV-04', offset: -132, slot: 'MORN', qty: 2, guests: 30, status: 'completed', addons: ['AD-05'], disc: 5, paidRatio: 1 },
      { c: 4, svc: 'SV-01', offset: -141, slot: 'AFTN', qty: 3, guests: 4, status: 'completed', addons: ['AD-04'], disc: 0, paidRatio: 1 },
      { c: 7, svc: 'SV-03', offset: -152, slot: 'EVEN', qty: 1, guests: 120, status: 'completed', addons: ['AD-03'], disc: 0, paidRatio: 1 },
      { c: 2, svc: 'SV-07', offset: -160, slot: 'NIGHT', qty: 2, guests: 2, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
      { c: 5, svc: 'SV-06', offset: -168, slot: 'MORN', qty: 2, guests: 2, status: 'completed', addons: [], disc: 0, paidRatio: 1 },
    ];

    plans.forEach((p, i) => {
      const service = SERVICES.find((x) => x.id === p.svc);
      const date = addDays(todayISO(), p.offset);
      const bookingId = 'BK-' + pad4(++s.counter.booking);
      const items = [{ name: service.name, qty: p.qty, rate: service.rate, unit: service.unit }];
      p.addons.forEach((aid) => {
        const a = ADDONS.find((x) => x.id === aid);
        const qty = a.unit === 'unit' || a.unit === 'trip' ? p.qty : 1;
        items.push({ name: a.name, qty, rate: a.rate, unit: a.unit });
      });
      const gross = items.reduce((t, it) => t + it.qty * it.rate, 0);
      const discount = Billing.round2((gross * p.disc) / 100);
      const total = Billing.round2((gross - discount) * (1 + s.settings.gstRate));
      const paid = Billing.round2(total * p.paidRatio);

      s.bookings.push({
        id: bookingId,
        customerId: s.customers[p.c].id,
        serviceId: service.id,
        date,
        slot: p.slot,
        qty: p.qty,
        guests: p.guests,
        status: p.status,
        notes: '',
        createdAt: addDays(date, -3),
        items,
        discount: { type: 'percent', value: p.disc },
        gstRate: s.settings.gstRate,
        serviceCharge: 0,
      });

      if (paid > 0) {
        s.payments.push({
          id: 'PM-' + pad4(++s.counter.payment),
          bookingId,
          amount: paid,
          method: i % 4 === 0 ? 'UPI' : i % 4 === 1 ? 'Card' : i % 4 === 2 ? 'Bank Transfer' : 'Cash',
          reference: 'TXN' + (7420193 + i * 1337),
          date,
          note: paid >= total ? 'Full settlement' : 'Advance payment',
        });
      }
    });

    s.seeded = true;
    return s;
  }

  function load() {
    if (state) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.bookings) && Array.isArray(parsed.customers)) {
          parsed.payments = parsed.payments || [];
          parsed.settings = { ...SETTINGS, ...(parsed.settings || {}) };
          parsed.counter = parsed.counter || { booking: 1023, customer: 0, payment: 0 };
          state = parsed;
          return;
        }
      }
    } catch (e) { /* storage unavailable — run in memory */ }
    state = seed(blank());
    save();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
  }

  function getState() { load(); return state; }

  const settings = () => getState().settings;
  const customers = () => getState().customers;
  const bookings = () => getState().bookings;
  const payments = () => getState().payments;
  const services = () => SERVICES;
  const addons = () => ADDONS;
  const slots = () => SLOTS;

  const customerById = (id) => getState().customers.find((c) => c.id === id) || null;
  const bookingById = (id) => getState().bookings.find((b) => b.id === id) || null;
  const serviceById = (id) => SERVICES.find((s) => s.id === id) || null;
  const slotById = (id) => SLOTS.find((s) => s.id === id) || null;

  function paymentsFor(bookingId) {
    return getState().payments.filter((p) => p.bookingId === bookingId);
  }

  function billFor(booking) {
    if (!booking) return null;
    const paid = Billing.round2(paymentsFor(booking.id).reduce((s, p) => s + Number(p.amount || 0), 0));
    return Billing.computeBill({
      items: booking.items || [],
      serviceCharge: booking.serviceCharge || 0,
      discount: booking.discount || { type: 'percent', value: 0 },
      gstRate: booking.gstRate === undefined ? settings().gstRate : booking.gstRate,
      paid,
    });
  }

  function createCustomer(data) {
    const s = getState();
    const customer = {
      id: 'CU-' + pad4(++s.counter.customer),
      name: String(data.name || '').trim(),
      phone: String(data.phone || '').trim(),
      email: String(data.email || '').trim(),
      city: String(data.city || '').trim(),
      tier: data.tier || 'Silver',
      notes: data.notes || '',
      createdAt: todayISO(),
    };
    s.customers.push(customer);
    save();
    return customer;
  }

  function updateCustomer(id, data) {
    const s = getState();
    const c = s.customers.find((x) => x.id === id);
    if (!c) return null;
    Object.assign(c, data);
    save();
    return c;
  }

  function isSlotTaken(serviceId, date, slot, ignoreBookingId) {
    return getState().bookings.some(
      (b) => b.serviceId === serviceId && b.date === date && b.slot === slot &&
        b.status !== 'cancelled' && b.id !== ignoreBookingId
    );
  }

  function createBooking(data) {
    const s = getState();
    const booking = {
      id: 'BK-' + pad4(++s.counter.booking),
      customerId: data.customerId,
      serviceId: data.serviceId,
      date: data.date,
      slot: data.slot,
      qty: Number(data.qty) || 1,
      guests: Number(data.guests) || 1,
      status: data.status || 'confirmed',
      notes: data.notes || '',
      createdAt: todayISO(),
      items: data.items || [],
      discount: data.discount || { type: 'percent', value: 0 },
      gstRate: s.settings.gstRate,
      serviceCharge: Number(data.serviceCharge) || 0,
    };
    s.bookings.push(booking);
    save();
    return booking;
  }

  function updateBooking(id, patch) {
    const s = getState();
    const b = s.bookings.find((x) => x.id === id);
    if (!b) return null;
    Object.assign(b, patch);
    save();
    return b;
  }

  const setBookingStatus = (id, status) => updateBooking(id, { status });

  function deleteBooking(id) {
    const s = getState();
    const i = s.bookings.findIndex((b) => b.id === id);
    if (i === -1) return false;
    s.bookings.splice(i, 1);
    s.payments = s.payments.filter((p) => p.bookingId !== id);
    save();
    return true;
  }

  function recordPayment(bookingId, { amount, method, reference, note, date }) {
    const s = getState();
    const payment = {
      id: 'PM-' + pad4(++s.counter.payment),
      bookingId,
      amount: Billing.round2(Number(amount) || 0),
      method: method || 'Cash',
      reference: reference || 'TXN' + Math.floor(1000000 + Math.random() * 8999999),
      date: date || todayISO(),
      note: note || '',
    };
    s.payments.push(payment);
    const booking = s.bookings.find((b) => b.id === bookingId);
    if (booking) {
      const bill = billFor(booking);
      if (bill && bill.balance <= 0.5) booking.status = 'completed';
    }
    save();
    return payment;
  }

  function updateSettings(patch) {
    const s = getState();
    s.settings = { ...s.settings, ...patch };
    save();
    return s.settings;
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
    state = seed(blank());
    save();
    return state;
  }

  function analytics() {
    const s = getState();
    const rows = s.bookings.map((b) => ({ booking: b, bill: billFor(b) }));
    const active = rows.filter((x) => x.booking.status !== 'cancelled');
    const revenue = Billing.round2(active.reduce((t, x) => t + (x.bill ? x.bill.total : 0), 0));
    const collected = Billing.round2(active.reduce((t, x) => t + (x.bill ? x.bill.paid : 0), 0));
    const outstanding = Billing.round2(Math.max(revenue - collected, 0));
    const gst = Billing.round2(active.reduce((t, x) => t + (x.bill ? x.bill.tax : 0), 0));
    const today = todayISO();

    const byService = {};
    active.forEach((x) => {
      const svc = serviceById(x.booking.serviceId);
      if (!svc) return;
      if (!byService[svc.id]) byService[svc.id] = { service: svc, count: 0, revenue: 0 };
      byService[svc.id].count += 1;
      byService[svc.id].revenue += x.bill ? x.bill.total : 0;
    });

    const byMethod = {};
    s.payments.forEach((p) => {
      byMethod[p.method] = (byMethod[p.method] || 0) + Number(p.amount || 0);
    });

    const months = {};
    active.forEach((x) => {
      const key = (x.booking.date || '').slice(0, 7);
      if (!key) return;
      if (!months[key]) months[key] = { key, revenue: 0, count: 0 };
      months[key].revenue += x.bill ? x.bill.total : 0;
      months[key].count += 1;
    });

    return {
      revenue,
      collected,
      outstanding,
      gst,
      totalBookings: active.length,
      todayCount: active.filter((x) => x.booking.date === today).length,
      upcomingCount: active.filter((x) => x.booking.date >= today).length,
      pendingCount: active.filter((x) => x.booking.status === 'pending').length,
      completedCount: active.filter((x) => x.booking.status === 'completed').length,
      customers: s.customers.length,
      byService: Object.values(byService).sort((a, b) => b.revenue - a.revenue),
      byMethod: Object.entries(byMethod).map(([method, amount]) => ({ method, amount })).sort((a, b) => b.amount - a.amount),
      months: Object.values(months).sort((a, b) => a.key.localeCompare(b.key)),
    };
  }

  return {
    SLOTS, SERVICES, ADDONS,
    getState, settings, customers, bookings, payments, services, addons, slots,
    customerById, bookingById, serviceById, slotById, paymentsFor, billFor,
    createCustomer, updateCustomer, createBooking, updateBooking, setBookingStatus,
    deleteBooking, recordPayment, isSlotTaken, updateSettings, reset, analytics,
    todayISO, addDays,
  };
})();
