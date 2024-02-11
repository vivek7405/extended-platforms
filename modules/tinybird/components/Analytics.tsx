import Header from "./Header";
import Widgets from "./Widgets";

export default function Analytics({ domain }: { domain: string }) {
  return (
    <>
      <div className="w-full max-w-7xl">
        <div className="space-y-6 sm:space-y-10">
          <Header />
          <main>
            <Widgets domain={domain} />
          </main>
        </div>
      </div>
    </>
  );
}
