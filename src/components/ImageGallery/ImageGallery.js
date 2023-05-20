import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Modal/Modal';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ foundImages }) => {
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [imageAlt, setImageAlt] = useState(0);

  const onOpenModal = ({ largeImageURL, id }) => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
    setImageAlt(id);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <ul className={css.gallery}>
      {foundImages.map(image => (
        <ImageGalleryItem
          key={image.id}
          imageToShow={image}
          openModal={onOpenModal}
        />
      ))}
      {showModal && (
        <Modal closeModal={onCloseModal}>
          <img src={largeImageURL} alt={imageAlt} />
        </Modal>
      )}
    </ul>
  );
};

ImageGallery.propTypes = {
  foundImages: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};
