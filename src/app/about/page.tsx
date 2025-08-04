import AboutClient from './components/AboutClient';

const AboutPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-none relative">
        <AboutClient />
      </div>
    </div>
  )
};

export default AboutPage; 