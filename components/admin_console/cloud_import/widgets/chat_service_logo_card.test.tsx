// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import {mountWithIntl} from 'tests/helpers/intl-test-helper';

import ChatServiceLogoCard from './chat_service_logo_card';

describe('admin_console/chat_service_logo_card', () => {
    test('chatServiceLogoCard match snapshot', () => {
        const wrapper = shallow(
            <ChatServiceLogoCard chatService='slack'/>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('chatServiceLogoCard shows failed', () => {
        const wrapper = mountWithIntl(
            <ChatServiceLogoCard chatService='slack'/>,
        );
        expect(wrapper).toMatchSnapshot();
    });

});
