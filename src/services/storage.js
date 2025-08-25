const MAP_KEY = "amtl_url_maps";          
const CLICK_KEY_PREFIX = "amtl_clicks_";  

const readJSON = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const getAllMaps = () => readJSON(MAP_KEY, {});
export const saveMaps = (obj) => writeJSON(MAP_KEY, obj);

export const addMap = (record) => {
  const maps = getAllMaps();
  maps[record.code] = record;
  saveMaps(maps);
  return record;
};

export const getMap = (code) => getAllMaps()[code];

export const removeMap = (code) => {
  const maps = getAllMaps();
  delete maps[code];
  saveMaps(maps);
};

export const recordClick = (code, click) => {
  const key = CLICK_KEY_PREFIX + code;
  const list = readJSON(key, []);
  list.push(click);
  writeJSON(key, list);
};

export const getClicks = (code) => readJSON(CLICK_KEY_PREFIX + code, []);
