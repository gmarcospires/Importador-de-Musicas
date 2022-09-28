import Page from '../../pages/inicio';
import { Modal } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../../redux/features/modal/modalSlice';
import { getCookies } from 'cookies-next';

export const getServerSideProps = ({ req, res }) => {
  return {
    props: {
      cookies: getCookies({ req, res }),
    },
  };
};

export default function Home(props) {
  const modalLogin = useSelector((state) => state.modal.value);
  const dispatch = useDispatch();
  const theme = props.theme;
  console.log(props);
  return (
    <Modal
      id='modalLogin'
      overlayColor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={modalLogin}
      transition='fade'
      style={{ width: '100%', height: '90%' }}
      transitionDuration={600}
      transitionTimingFunction='ease'
      onClose={() => {
        dispatch(toggleModal(modalLogin));
      }}
      title='Login'
      centered
    >
      <Page cookies={props.cookies}></Page>
    </Modal>
  );
}
