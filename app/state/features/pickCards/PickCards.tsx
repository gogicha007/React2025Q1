import type { RootState } from '~/state/store';
import type { IResponse } from '~/types/interface';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelection } from './selectedCardsSlice';
import { useRef, useState } from 'react';
import Papa from 'papaparse';

type Props = {
  data: IResponse;
};

const PickCards = (props: Props) => {
  const [downloadUrl, setDownloadUrl] = useState('');
  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  const [fileName, setFileName] = useState('');

  const dispatch = useDispatch();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );

  const handleDownloadCSV = () => {
    if (!props.data || !props.data.results) return;

    const selectedData = props.data.results.filter((card) =>
      selectedCards.includes(card.id)
    );

    if (selectedData.length === 0) {
      alert('No cards selected for download!');
      return;
    }

    const csv = Papa.unparse(
      selectedData.map(({ id, name, image, species, status }) => ({
        ID: id,
        Name: name,
        Image: image,
        Species: species,
        Status: status,
      })),
      {
        quotes: true,
        header: true,
      }
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setFileName(`${selectedCards.length}_characters.csv`);
    setTimeout(() => {
      if (downloadRef.current) {
        downloadRef.current.click();
        URL.revokeObjectURL(url);
        setDownloadUrl('');
        setFileName('');
      }
    });
  };
  return (
    <>
      <h2>Items selected: {selectedCards.length}</h2>
      <button onClick={() => dispatch(clearSelection())}>Deselect all</button>
      <button onClick={handleDownloadCSV}>Download CSV</button>
      <a
        ref={downloadRef}
        href={downloadUrl}
        download={fileName}
        style={{ display: 'none' }}
        data-testid="csvDownloadLink"
        id="csvDownloadLink"
      >
        Download File
      </a>
    </>
  );
};

export default PickCards;
