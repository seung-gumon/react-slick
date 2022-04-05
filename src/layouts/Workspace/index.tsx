import axios from 'axios';
import React, { FC, useCallback, useEffect, useState } from 'react';
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
import { IUser, IWorkspace } from '../../typings/db';
import useInput from '../../hooks/useInput';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { data, mutate, error } = useSWR<IUser | false>('http://localhost:8080/api/users', fetcher);

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
    // setShowCreateWorkspaceModal(false);
    // setShowCreateChannelModal(false);
    // setShowInviteWorkspaceModal(false);
    // setShowInviteChannelModal(false);
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
          <WorkspaceName
          // onClick={toggleWorkspaceModal}
          >
            Sleact
          </WorkspaceName>
          <MenuScroll>
            {/* <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList /> */}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="sleact/channel" element={<Channel />} />
            <Route path="dm" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;
