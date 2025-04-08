// src/CardListPage.js
import CardList from '../components/CardList'

const CardListPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">保存されたカード一覧</h2>
      <CardList />
    </div>
  );
};

export default CardListPage;
