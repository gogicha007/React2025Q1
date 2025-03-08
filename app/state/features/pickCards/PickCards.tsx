import type { RootState } from '~/state/store';
import { useSelector, useDispatch } from 'react-redux';
import Papa from 'papaparse';
import { clearSelection } from './selectedCardsSlice';
import type { IResponse } from '~/types/interface';

type Props = {
  data: IResponse;
};
const PickCards = (props: Props) => {
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
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${selectedCards.length}_characters.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <h2>Items selected: {selectedCards.length}</h2>
      <button onClick={() => dispatch(clearSelection())}>Deselect all</button>
      <button onClick={handleDownloadCSV}>Download CSV</button>
    </>
  );
};

export default PickCards;
