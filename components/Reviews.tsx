"use client";
import { useEffect } from "react";

export default function Reviews() {
  useEffect(() => {
    if (document.getElementById("fb-sdk")) {
      // @ts-ignore
      window.FB && window.FB.XFBML && window.FB.XFBML.parse();
      return;
    }
    const s = document.createElement("script");
    s.id = "fb-sdk";
    s.async = true;
    s.defer = true;
    s.crossOrigin = "anonymous";
    s.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
    s.onload = () => {
      // @ts-ignore
      window.FB && window.FB.XFBML && window.FB.XFBML.parse();
    };
    document.body.appendChild(s);
  }, []);

  return (
    <div className="reveal" data-anim="right">
      <h2>Reviews</h2>
      <div className="embed-card">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/search/top?q=guitar%20harbour%20custom%20shop"
          data-tabs="reviews"
          data-width=""
          data-height=""
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        />
      </div>
      <p className="muted" style={{ marginTop: 12 }}>
        If reviews don’t load, <a href="https://www.facebook.com/search/top?q=guitar%20harbour%20custom%20shop" target="_blank" rel="noopener noreferrer">see them on Facebook</a>.
      </p>
    </div>
  );
}