/* ============================================================
   Billing engine — pure functions, mirrors the Bill class
   Formula: subtotal -> discount -> taxable -> CGST + SGST -> total
   ============================================================ */
const Billing = (() => {
  const GST_RATE = 0.18;
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  function money(n, opts = {}) {
    const value = Number(n) || 0;
    const abs = Math.abs(value);
    const str = abs.toLocaleString('en-IN', {
      minimumFractionDigits: opts.compact ? 0 : 2,
      maximumFractionDigits: opts.compact ? 0 : 2,
    });
    return (value < 0 ? '-' : '') + '₹' + str;
  }

  function compactMoney(n) {
    const v = Number(n) || 0;
    if (Math.abs(v) >= 10000000) return '₹' + (v / 10000000).toFixed(2) + ' Cr';
    if (Math.abs(v) >= 100000) return '₹' + (v / 100000).toFixed(2) + ' L';
    if (Math.abs(v) >= 1000) return '₹' + (v / 1000).toFixed(1) + 'k';
    return '₹' + Math.round(v);
  }

  /**
   * @param {Object} input
   * @param {Array}  input.items        [{ name, qty, rate, unit }]
   * @param {number} input.serviceCharge
   * @param {Object} input.discount     { type: 'percent'|'flat', value }
   * @param {number} input.gstRate
   * @param {number} input.paid         amount already settled
   */
  function computeBill(input = {}) {
    const items = (input.items || []).map((it) => {
      const qty = Number(it.qty) || 0;
      const rate = Number(it.rate) || 0;
      return { ...it, qty, rate, amount: round2(qty * rate) };
    });

    const itemsTotal = round2(items.reduce((s, it) => s + it.amount, 0));
    const serviceCharge = round2(input.serviceCharge || 0);
    const subtotal = round2(itemsTotal + serviceCharge);

    const d = input.discount || { type: 'percent', value: 0 };
    const dValue = Number(d.value) || 0;
    let discount = d.type === 'percent' ? round2((subtotal * dValue) / 100) : round2(dValue);
    discount = Math.min(discount, subtotal);
    discount = Math.max(discount, 0);

    const taxable = round2(subtotal - discount);
    const gstRate = input.gstRate === undefined ? GST_RATE : input.gstRate;
    const cgst = round2((taxable * gstRate) / 2);
    const sgst = round2((taxable * gstRate) / 2);
    const tax = round2(cgst + sgst);
    const total = round2(taxable + tax);

    const paid = round2(input.paid || 0);
    const balance = round2(Math.max(total - paid, 0));
    const status = paid <= 0 ? 'pending' : balance <= 0.5 ? 'paid' : 'partial';

    return {
      items,
      itemsTotal,
      serviceCharge,
      subtotal,
      discountType: d.type,
      discountValue: dValue,
      discount,
      taxable,
      gstRate,
      cgst,
      sgst,
      tax,
      total,
      paid,
      balance,
      paymentStatus: status,
      effectiveRate: subtotal > 0 ? round2((total / subtotal - 1) * 100) : 0,
    };
  }

  const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function two(n) {
    if (n < 20) return ONES[n];
    const t = TENS[Math.floor(n / 10)];
    const o = ONES[n % 10];
    return o ? t + ' ' + o : t;
  }
  function three(n) {
    let s = '';
    if (n > 99) {
      s += ONES[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n) s += ' ';
    }
    if (n) s += two(n);
    return s;
  }

  function amountInWords(amount) {
    const value = round2(amount);
    let rupees = Math.floor(value);
    const paise = Math.round((value - rupees) * 100);
    if (rupees === 0 && paise === 0) return 'Zero Rupees Only';

    const parts = [];
    const crore = Math.floor(rupees / 10000000); rupees %= 10000000;
    const lakh = Math.floor(rupees / 100000); rupees %= 100000;
    const thousand = Math.floor(rupees / 1000); rupees %= 1000;

    if (crore) parts.push(three(crore) + ' Crore');
    if (lakh) parts.push(three(lakh) + ' Lakh');
    if (thousand) parts.push(three(thousand) + ' Thousand');
    if (rupees) parts.push(three(rupees));

    let words = parts.join(' ').replace(/\s+/g, ' ').trim();
    words += ' Rupees';
    if (paise) words += ' and ' + two(paise) + ' Paise';
    return words + ' Only';
  }

  return { GST_RATE, round2, money, compactMoney, computeBill, amountInWords };
})();
