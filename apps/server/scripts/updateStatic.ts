import FSEX, { remove } from 'fs-extra'

const { copy } = FSEX;

(async () => {
  // copy frontend artifacts
  await remove("./backend/static/");
  await copy("./frontend/dist/", "./backend/static/");
})();