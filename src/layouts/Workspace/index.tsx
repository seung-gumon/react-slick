import axios from 'axios';
import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { Navigate, Routes, Route } from 'react-router';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
  WorkspaceName,
  MenuScroll,
  LogOutButton,
  Chats,
  ProfileModal,
} from '../Workspace/styles';
import { Button, Input, Label } from '../../pages/SignUp/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '../../components/Menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser, IWorkspace } from '../../typings/db';
import useInput from '../../hooks/useInput';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import CreateChannelModal from '../../components/CreateChannelModal';
import { useParams } from 'react-router';

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { data, mutate, error } = useSWR<IUser | false>('http://localhost:8080/api/users', fetcher);

  const { data: channelData } = useSWR<IChannel[]>(
    data ? `http://localhost:8080/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const logOut = useCallback(() => {
    axios
      .post('http://localhost:8080/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  const toggleUserProfile = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowUserMenu((prev: boolean) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {}, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          'http://localhost:8080/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    // setShowInviteWorkspaceModal(false);
    // setShowInviteChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  if (error) return <Navigate to="/login" />;

  if (!data) {
    return <div>failed to load</div>;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={toggleUserProfile}>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={toggleUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.nickname, { s: '36px', d: 'retro' })} alt={data.nickname} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={logOut}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>
          {data?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={logOut}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {/* <ChannelList />
            <DMList /> */}
            {channelData?.map((v) => (
              <div>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path=":workspace/channel/:channel" element={<Channel />} />
            <Route path=":workspace/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>

      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </div>
  );
};

export default Workspace;
