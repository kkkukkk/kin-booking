import TermsClient from "./components/TermsClient";

const TermsPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-none relative">
        <TermsClient />
      </div>
    </div>
  )
};

export default TermsPage;