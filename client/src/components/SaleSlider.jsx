import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    eyebrow: "New season",
    title: "Up to 40% off Clothing",
    sub: "Fresh arrivals for Men, Women & Kids — refresh your wardrobe today.",
    cta: "Shop Clothing",
    image: "https://loremflickr.com/1400/600/fashion,shopping?lock=201",
    overlay: "linear-gradient(100deg, rgba(255,95,109,0.55) 0%, rgba(168,85,247,0.35) 60%, rgba(168,85,247,0.15) 100%)",
  },
  {
    id: 2,
    eyebrow: "Home refresh",
    title: "Furniture & Decor Sale",
    sub: "Statement pieces for every room, all handpicked and ready to ship.",
    cta: "Shop Home",
    image: "https://loremflickr.com/1400/600/furniture,interior?lock=202",
    overlay: "linear-gradient(100deg, rgba(17,153,142,0.55) 0%, rgba(56,239,125,0.35) 60%, rgba(56,239,125,0.15) 100%)",
  },
  {
    id: 3,
    eyebrow: "Tech deals",
    title: "Electronics from $29",
    sub: "Headphones, speakers & wearables — modern tech, honest prices.",
    cta: "Shop Electronics",
    image: "https://loremflickr.com/1400/600/electronics,gadgets?lock=203",
    overlay: "linear-gradient(100deg, rgba(57,106,252,0.55) 0%, rgba(41,72,255,0.35) 60%, rgba(41,72,255,0.15) 100%)",
  },
];

const SaleSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="slide" key={slide.id}>
            <img
              className="slide-bg"
              src={slide.image}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://picsum.photos/1400/600";
              }}
            />
            <div className="slide-overlay" style={{ background: slide.overlay }} />
            <div className="slide-content">
              <p className="slide-eyebrow">{slide.eyebrow}</p>
              <h2>{slide.title}</h2>
              <p className="slide-sub">{slide.sub}</p>
              <Link to="/" className="slide-cta">
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SaleSlider;
