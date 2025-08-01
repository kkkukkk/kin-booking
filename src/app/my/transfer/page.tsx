import Card from '@/components/Card';
import TransferClient from './components/TransferClient';

interface TransferPageProps {}

const TransferPage = ({}: TransferPageProps) => {
  return (
    <Card innerScroll>
      <TransferClient />
    </Card>
  );
};

export default TransferPage; 