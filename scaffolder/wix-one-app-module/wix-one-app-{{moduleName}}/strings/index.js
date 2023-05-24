const i18n = require('@wix/wix-react-native-i18n');

const stringsByLocale = {
  ar: () => require('./messages_ar.json'),
  cs: () => require('./messages_cs.json'),
  da: () => require('./messages_da.json'),
  de: () => require('./messages_de.json'),
  el: () => require('./messages_el.json'),
  en: () => require('./messages_en.json'),
  es: () => require('./messages_es.json'),
  fi: () => require('./messages_fi.json'),
  fr: () => require('./messages_fr.json'),
  he: () => require('./messages_he.json'),
  hi: () => require('./messages_hi.json'),
  hu: () => require('./messages_hu.json'),
  id: () => require('./messages_id.json'),
  it: () => require('./messages_it.json'),
  ja: () => require('./messages_ja.json'),
  ko: () => require('./messages_ko.json'),
  lt: () => require('./messages_lt.json'),
  nl: () => require('./messages_nl.json'),
  no: () => require('./messages_no.json'),
  pl: () => require('./messages_pl.json'),
  pt: () => require('./messages_pt.json'),
  ru: () => require('./messages_ru.json'),
  sv: () => require('./messages_sv.json'),
  th: () => require('./messages_th.json'),
  tr: () => require('./messages_tr.json'),
  uk: () => require('./messages_uk.json'),
  vi: () => require('./messages_vi.json'),
  zh: () => require('./messages_zh.json'),
};

module.exports = i18n(stringsByLocale);
