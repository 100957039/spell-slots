import IconGrid from "./components/iconGrid";
import Menu from "./components/menu";
import '../styles/globals.css';

// <IconGrid num={9} />

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <Menu />
    </main>
  );
}
