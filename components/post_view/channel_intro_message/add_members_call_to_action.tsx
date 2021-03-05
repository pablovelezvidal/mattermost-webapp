import React from 'react';

import ToggleModalButtonRedux from 'components/toggle_modal_button_redux';
import ToggleModalButton from 'components/toggle_modal_button.jsx';
import InvitationModal from 'components/invitation_modal';
import ChannelInviteModal from 'components/channel_invite_modal';
import AddGroupsToChannelModal from 'components/add_groups_to_channel_modal';
import ChannelPermissionGate from 'components/permissions_gates/channel_permission_gate';
import {FormattedMessage} from 'react-intl';

import {Channel} from 'mattermost-redux/types/channels';
import {Permissions} from 'mattermost-redux/constants';

import {Constants, ModalIdentifiers} from 'utils/constants';
import * as Utils from 'utils/utils.jsx';

import './add_members_call_to_action.scss';

import MembersSvg from './members_illustration.svg';

export interface AddMembersCallToActionProps {
    totalUsers: number;
    usersLimit: number;
    channel: Channel;
    setHeader: React.ReactNode;
}
 
const AddMembersCallToAction: React.FC<AddMembersCallToActionProps> = ({totalUsers, usersLimit, channel, setHeader}: AddMembersCallToActionProps) => {
    const inviteUsers = totalUsers < usersLimit;
    console.log('channel', channel);
    return ( 
         inviteUsers ? lessThanMaxFreeUsers(setHeader) :moreThanMaxFreeUsers(channel, setHeader)
     );
};

const lessThanMaxFreeUsers = (setHeader: React.ReactNode) => {
    return (
        <>
            {setHeader}
            <div className="LessThanMaxFreeUsers">
                <MembersSvg/>
                <div className="titleAndButton">
                    <FormattedMessage
                        id='intro_messages.inviteOthersToWorkspace.title'
                        defaultMessage='Let’s add some people to the workspace!'
                    />
                    <ToggleModalButtonRedux
                        accessibilityLabel={Utils.localizeMessage('intro_messages.inviteOthers', 'Invite others to the workspace')}
                        id='introTextInvite'
                        className='intro-links color--link cursor--pointer'
                        modalId={ModalIdentifiers.INVITATION}
                        dialogType={InvitationModal}
                    >
                        <FormattedMessage
                            id='generic_icons.add'
                            defaultMessage='Add Icon'
                        >
                            {(title: string) => (
                                <i
                                    className='icon fa fa-envelope'
                                    title={title}
                                />
                            )}
                        </FormattedMessage>
                        <FormattedMessage
                            id='intro_messages.inviteOthersToWorkspace.button'
                            defaultMessage='Invite others to the workspace'
                        />
                    </ToggleModalButtonRedux>
                </div>
            </div>
        </>
    )
}

const moreThanMaxFreeUsers = (channel: Channel, setHeader: React.ReactNode) => {
    const modal = channel.group_constrained ? AddGroupsToChannelModal : ChannelInviteModal;
    const channelIsArchived = channel.delete_at !== 0;
    if (channelIsArchived) {
        return null;
    }
    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
    return (
        <div className='MoreThanMaxFreeUsersWrapper'>
            <div className="MoreThanMaxFreeUsers">
                <ChannelPermissionGate
                    channelId={channel.id}
                    teamId={channel.team_id}
                    permissions={[isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS : Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS]}
                >
                    <ToggleModalButton
                        className='intro-links color--link'
                        dialogType={modal}
                        dialogProps={{channel}}
                    >
                        <FormattedMessage
                            id='generic_icons.add'
                            defaultMessage='Add Icon'
                        >
                            {(title: string) => (
                                <i
                                    className='fa fa-user-plus'
                                    title={title}
                                />
                            )}
                        </FormattedMessage>
                        {isPrivate && channel.group_constrained &&
                            <FormattedMessage
                                id='intro_messages.inviteGropusToWorkspace.button'
                                defaultMessage='Add groups to this private channel'
                            />}
                        {isPrivate && !channel.group_constrained &&
                            <FormattedMessage
                                id='intro_messages.inviteMembersToPrivateWorkspace.button'
                                defaultMessage='Add members to this private channel'
                            />}
                        {!isPrivate &&
                            <FormattedMessage
                                id='intro_messages.inviteMembersToWorkspace.button'
                                defaultMessage='Add members to this channel'
                            />}
                    </ToggleModalButton>
                </ChannelPermissionGate>
            </div>
            {setHeader}
        </div>
    );
}
 
export default AddMembersCallToAction;