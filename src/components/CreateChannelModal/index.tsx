import Modal from '../Modal';
import { Label } from '../../pages/SignUp/styles';
import { Input, Button } from '../../pages/SignUp/styles';
import React, { useCallback, VFC } from 'react';
import useInput from '../../hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

interface IProps {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<IProps> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:8080/api/${workspace}/channels`,
        {
          name: newChannel,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setShowCreateChannelModal(false);
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.reponse?.data, { position: 'bottom-center' });
      });
  }, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
