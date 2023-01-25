import { Home } from './Home';
import { PageList } from './PageList';
import { PageDetail } from './PageDetail';

const routes = {
  "": Home,
  "home": Home,
  "#": Home,
  "pagelist": PageList,
  "games": PageList,
  "pagedetail": PageDetail,
  "game": PageDetail,
};

export { routes };
