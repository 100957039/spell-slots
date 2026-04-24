import IconGrid from "./components/iconGrid";
import '../styles/globals.css';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <IconGrid num={9} />
    </main>
  );
}
