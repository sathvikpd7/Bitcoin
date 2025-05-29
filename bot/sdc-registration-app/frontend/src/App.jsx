import Navbar from './components/Navbar';
import Landing from './components/Landing';
import RegistrationForm from './components/RegistrationForm';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="font-sans">
      <Navbar />
      <Landing />
      <RegistrationForm />
      <Timeline />
      <Footer />
    </div>
  );
}