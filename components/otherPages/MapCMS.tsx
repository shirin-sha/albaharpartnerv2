import React from "react";
import { ContactUsContent } from "@/types/contact-us";
import { toGoogleMapsEmbedUrl } from "@/lib/google-maps";

interface Props {
  data: ContactUsContent;
}

export default function MapCMS({ data }: Props) {
  if (!data.mapSection.isActive) return null;

  const embedUrl = toGoogleMapsEmbedUrl(data.mapSection.mapUrl);
  if (!embedUrl) return null;

  return (
    <section className="section-map">
      <div className="wg-map">
        <div className="box-map">
          <div id="map" className="map">
            <iframe
              src={embedUrl}
              width="100%"
              style={{ width: "100%", height: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
