import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import scn from 'react-intl/locale-data/scn';

addLocaleData([...scn, ...en]);

// Write wrapper here

export { IntlProvider };
