import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const RecommendBook = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [description, setDescription] = useState("");

  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const inputRefs = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(headingRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      tl.from(inputRefs.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.15,
      });

      tl.from(buttonRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    }, containerRef);

    return () => ctx.revert(); // clean up
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      bookTitle,
      authorName,
      description,
    });

    alert("Recommendation submitted to the server!");

    setBookTitle("");
    setAuthorName("");
    setDescription("");
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 ref={headingRef} style={{ marginBottom: "20px" }}>
          Recommend a Book
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Book Title</label>
            <input
              ref={(el) => (inputRefs.current[0] = el)}
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                color: "#333",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Author Name</label>
            <input
              ref={(el) => (inputRefs.current[1] = el)}
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                color: "#333",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Why do you recommend this book?</label>
            <textarea
              ref={(el) => (inputRefs.current[2] = el)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              style={{
                width: "100%",
                color: "#333",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "transparent",
              }}
            ></textarea>
          </div>
          <button
            ref={buttonRef}
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit Recommendation
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecommendBook;
