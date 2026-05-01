import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="container home-hero-content">
          <div className="home-copy">
            <h1>Browse Our Inventory</h1>
            <p className="lead">
              Fresh singles, slabs, and sealed Pokemon products from Twin Unity.
            </p>
            <div className="actions">
              <Link className="btn primary" href="/single-cards">
                Shop
              </Link>
            </div>
          </div>
          <div className="home-art" aria-hidden="true">
            <Image
              className="home-logo"
              src="/twin-unity-logo-transparent.png"
              alt=""
              width={701}
              height={407}
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
