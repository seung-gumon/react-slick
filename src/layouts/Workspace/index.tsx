import axios from 'axios';
import { FC, useCallback, useEffect } from 'react';
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
  Chats,
} from '../Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
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

  if (error) return <Navigate to="/login" />;

  if (!data) {
    return <div>failed to load</div>;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={logOut}>로그아웃</button>
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
