// src/components/Carousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
// importar estilos base
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// registra los módulos en SwiperCore
SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function Carousel({ slides }) {
  return (
    <Swiper
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      loop
      className="w-full h-40 md:h-80"
    >
      {slides.map((src, idx) => (
        <SwiperSlide key={idx}>
          <img
            src={src}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
