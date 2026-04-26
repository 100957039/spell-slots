import IconGrid from "./components/iconGrid.jsx";
import Menu from "./components/menu.jsx";
import '../styles/globals.css';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <Menu />
    </main>
  );
}
