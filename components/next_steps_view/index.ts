// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {getProfiles} from 'mattermost-redux/actions/users';
import {makeGetCategory} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, isCurrentUserSystemAdmin, getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getLicense} from 'mattermost-redux/selectors/entities/general';
import {getTeam} from 'mattermost-redux/selectors/entities/teams';

import {setShowNextStepsView} from 'actions/views/next_steps';
import {closeRightHandSide} from 'actions/views/rhs';
import {GlobalState} from 'types/store';
import {Preferences} from 'utils/constants';

import LocalStorageStore from 'stores/local_storage_store';

import {getSteps, isFirstAdmin} from './steps';

import NextStepsView from './next_steps_view';

function makeMapStateToProps() {
    const getCategory = makeGetCategory();

    return (state: GlobalState) => {
        const teamId = LocalStorageStore.getPreviousTeamId(getCurrentUserId(state));
        const team = getTeam(state, teamId || '');
        return {
            currentUser: getCurrentUser(state),
            isAdmin: isCurrentUserSystemAdmin(state),
            preferences: getCategory(state, Preferences.RECOMMENDED_NEXT_STEPS),
            steps: getSteps(state),
            isFirstAdmin: isFirstAdmin(state),
            isCloud: getLicense(state).Cloud === 'true',
            team: team
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators(
            {
                savePreferences,
                setShowNextStepsView,
                getProfiles,
                closeRightHandSide,
            },
            dispatch,
        ),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(NextStepsView);
