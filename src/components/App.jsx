import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreBtn } from './LoadMoreBtn/LoadMoreBtn';
import { ApiRequest } from '../Api/ApiRequest';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lastPageNumber, setLastPageNumber] = useState(null);
  const [foundImages, setFoundImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [existImagesToShow, setExistImagesToShow] = useState(false);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    if (page === 1) {
      setFoundImages([]);
    }

    setIsLoading(true);
    setExistImagesToShow(false);

    ApiRequest(searchQuery, page)
      .then(result => {
        if (result.totalHits === 0) {
          toast.error('There are no results matching your query', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: false,
            theme: 'colored',
          });
        }
        if (page === 1) {
          setFoundImages(result.hits);

          if (result.hits.length < result.totalHits) {
            setLastPageNumber(Math.ceil(result.totalHits / result.hits.length));

            setExistImagesToShow(true);
          }
        } else {
          setFoundImages(prevState => [...prevState, ...result.hits]);

          setExistImagesToShow(true);

          if (page === lastPageNumber) {
            setExistImagesToShow(false);
          }
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        setIsLoading(false);
        setTimeout(
          () =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            }),
          200
        );
      });
  }, [searchQuery, page, lastPageNumber]);

  const formSubmitHandler = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
    setLastPageNumber(null);
  };

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <div>
      <Searchbar onSubmit={formSubmitHandler} />

      {foundImages.length !== 0 && <ImageGallery foundImages={foundImages} />}

      <Loader loading={isLoading} />
      {existImagesToShow && <LoadMoreBtn onLoadMoreBtn={onLoadMore} />}
      <ToastContainer />
    </div>
  );
};
