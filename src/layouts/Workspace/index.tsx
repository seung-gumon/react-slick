import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
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
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '../../components/Menu';

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const { data, mutate, error } = useSWR('http://localhost:8080/api/users', fetcher);

  const logOut = useCallback(() => {
    axios
      .post('http://localhost:8080/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  const toggleUserProfile = useCallback(() => {
    setShowUserMenu((prev: boolean) => !prev);
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
          {/* {data?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })} */}
          <AddButton
          // onClick={onClickCreateWorkspace}
          >
            +
          </AddButton>
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
      {children}
    </div>
  );
};

export default Workspace;
