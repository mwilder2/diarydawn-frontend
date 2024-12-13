import * as UserActions from './store/user.actions';
import { UserState, userFeatureKey } from './store/user.reducer';
import * as UserSelectors from './store/user.selectors';
import { UserService } from './services/user.service';

export { UserActions, UserSelectors, UserState, UserService, userFeatureKey };
